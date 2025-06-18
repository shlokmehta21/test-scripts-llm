const fs = require("fs");
const path = require("path");

// Parse exclusion file to extract patterns
function parseExclusionFile(filePath) {
  const patterns = new Set();
  if (filePath && fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        patterns.add(trimmed);
      }
    }
  }
  return patterns;
}

// Check if a path is excluded based on patterns
function isExcluded(filePath, exclusionPatterns) {
  for (const pattern of exclusionPatterns) {
    const regexPattern = new RegExp(pattern.replace(/\*/g, ".*"));
    if (regexPattern.test(filePath)) {
      return true;
    }
  }
  return false;
}

// Scan folder and process files into JSON chunks
function scanFolderToJSON(startPath, exclusionPatterns, fileTypes) {
  const chunks = [];

  function processDirectory(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(startPath, fullPath);

      if (isExcluded(relPath, exclusionPatterns)) return;

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (
        !fileTypes ||
        fileTypes.some((ext) => entry.name.endsWith(ext))
      ) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");

          // Split large files into smaller chunks
          const maxChunkSize = 1000; // Adjust based on your token limit
          const fileChunks = splitContent(content, maxChunkSize);

          fileChunks.forEach((chunk, index) => {
            chunks.push({
              path: relPath,
              description: `Part ${index + 1} of ${entry.name}`,
              content: chunk,
            });
          });
        } catch (err) {
          console.error(`Error reading file ${relPath}: ${err.message}`);
        }
      }
    });
  }

  processDirectory(startPath);
  return chunks;
}

// Split content into smaller chunks
function splitContent(content, maxChunkSize) {
  const lines = content.split("\n");
  const chunks = [];
  let currentChunk = [];

  lines.forEach((line) => {
    currentChunk.push(line);
    if (currentChunk.join("\n").length > maxChunkSize) {
      chunks.push(currentChunk.join("\n"));
      currentChunk = [];
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n"));
  }

  return chunks;
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      "Usage: node script.js <start_path> <output_file> [exclusion_file] [file_extensions...]"
    );
    process.exit(1);
  }

  const [startPath, outputFile, exclusionFile, ...fileExtensions] = args;
  const exclusionPatterns = exclusionFile
    ? parseExclusionFile(exclusionFile)
    : new Set();

  console.log(
    exclusionFile
      ? `Using exclusion patterns from ${exclusionFile}: ${Array.from(
          exclusionPatterns
        ).join(", ")}`
      : "No exclusion file specified. Scanning all files."
  );
  console.log(
    fileExtensions.length
      ? `Scanning for file types: ${fileExtensions.join(", ")}`
      : "No file types specified. Scanning all files."
  );

  const chunks = scanFolderToJSON(
    startPath,
    exclusionPatterns,
    fileExtensions.length > 0 ? fileExtensions : null
  );

  fs.writeFileSync(outputFile, JSON.stringify(chunks, null, 2), "utf-8");
  console.log(`Codebase transformed. Results written to ${outputFile}`);
}

main();
