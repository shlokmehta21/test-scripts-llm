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
    if (pattern.startsWith("/") && pattern.endsWith("/")) {
      if (
        filePath.startsWith(pattern.slice(1)) ||
        filePath === pattern.slice(1, -1)
      ) {
        return true;
      }
    } else if (pattern.endsWith("/")) {
      if (filePath.startsWith(pattern) || filePath === pattern.slice(0, -1)) {
        return true;
      }
    } else if (pattern.startsWith("/")) {
      if (
        filePath === pattern.slice(1) ||
        filePath.startsWith(pattern.slice(1) + path.sep)
      ) {
        return true;
      }
    } else {
      const regexPattern = new RegExp(pattern.replace(/\*/g, ".*"));
      if (regexPattern.test(filePath)) {
        return true;
      }
    }
  }
  return false;
}

// Print directory structure recursively
function printDirectoryStructure(startPath, exclusionPatterns) {
  function generateTree(dirPath, prefix = "") {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    entries.sort(
      (a, b) =>
        b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name)
    );

    let tree = [];
    entries.forEach((entry, index) => {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.relative(startPath, fullPath);
      if (isExcluded(relPath, exclusionPatterns)) return;

      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const newPrefix = prefix + (isLast ? "    " : "│   ");

      if (entry.isDirectory()) {
        tree.push(`${prefix}${connector}${entry.name}/`);
        tree = tree.concat(generateTree(fullPath, newPrefix));
      } else {
        tree.push(`${prefix}${connector}${entry.name}`);
      }
    });
    return tree;
  }

  return ["/", ...generateTree(startPath)].join("\n");
}

// Scan folder and process files
function scanFolder(startPath, fileTypes, outputFile, exclusionPatterns) {
  const output = [];

  output.push("Directory Structure:");
  output.push("-------------------");
  output.push(printDirectoryStructure(startPath, exclusionPatterns));
  output.push("\n\nFile Contents:");
  output.push("--------------");

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
          output.push(`File: ${relPath}`);
          output.push("-".repeat(50));
          output.push(content);
          output.push("\n\n");
        } catch (err) {
          console.error(`Error reading file ${relPath}: ${err.message}`);
          output.push(
            `Error reading file ${relPath}: ${err.message}. Content skipped.\n\n`
          );
        }
      }
    });
  }

  processDirectory(startPath);

  fs.writeFileSync(outputFile, output.join("\n"), "utf-8");
  console.log(`Scan complete. Results written to ${outputFile}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      "Usage: node script.js <start_path> <output_file> [exclusion_file] [file_extensions...]"
    );
    console.log("Both exclusion_file and file_extensions are optional.");
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

  scanFolder(
    startPath,
    fileExtensions.length > 0 ? fileExtensions : null,
    outputFile,
    exclusionPatterns
  );
}

main();
