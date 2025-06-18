const { ChatOllama } = require("langchain/chat_models/ollama");
const { OllamaEmbeddings } = require("langchain/embeddings/ollama");
const { Chroma } = require("langchain/vectorstores/chroma");
const { CharacterTextSplitter } = require("langchain/text_splitter");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    // 1. Load and Split Data from local file
    console.log("Loading local document...");

    // Check if output.txt exists
    const filePath = path.join(__dirname, "output.txt");
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `File not found: ${filePath}. Please ensure output.txt is in the same directory as this script.`
      );
    }

    // Load the local text file
    const loader = new TextLoader(filePath);
    const documents = await loader.load();

    console.log(
      `Loaded document with ${documents[0].pageContent.length} characters`
    );

    // Split the document into chunks
    console.log("Splitting documents...");
    const textSplitter = new CharacterTextSplitter({
      chunkSize: 1000, // Reduced chunk size for code files
      chunkOverlap: 200, // Increased overlap for better context retention
    });
    const docSplits = await textSplitter.splitDocuments(documents);

    console.log(`Created ${docSplits.length} document chunks`);

    // 2. Convert Documents to Embeddings and Store Them in ChromaDB
    console.log("Creating vector store...");
    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text",
      baseUrl: "http://localhost:11434", // Ensure Ollama is running on default port
    });

    // Create ChromaDB vector store
    const vectorStore = await Chroma.fromDocuments(docSplits, embeddings, {
      collectionName: "local-repo-rag",
      url: "http://localhost:8000", // Default ChromaDB port
    });

    const retriever = vectorStore.asRetriever({
      k: 5, // Return top 5 most relevant chunks
    });

    // 3. Initialize the LLM
    const llm = new ChatOllama({
      model: "llama2", // Make sure this model is available in your Ollama
      baseUrl: "http://localhost:11434",
    });

    // 4. Before RAG - General question about the codebase
    console.log("\n=== Before RAG ===\n");
    const beforeRAGTemplate =
      "What can you tell me about {topic}? Provide a general overview.";
    const beforeRAGPrompt = new PromptTemplate({
      template: beforeRAGTemplate,
      inputVariables: ["topic"],
    });

    const beforeRAGChain = new LLMChain({ llm, prompt: beforeRAGPrompt });
    const beforeRAGResponse = await beforeRAGChain.call({
      topic: "Next.js portfolio website development",
    });
    console.log("General AI Response:");
    console.log(beforeRAGResponse.text);

    // 5. After RAG - Specific question about your codebase
    console.log("\n=== After RAG ===\n");
    const afterRAGTemplate = `
Answer the question based only on the following context from the codebase:

Context:
{context}

Question: {question}

Please provide a detailed answer based on the code structure and implementation shown in the context.
`;

    const afterRAGPrompt = new PromptTemplate({
      template: afterRAGTemplate,
      inputVariables: ["context", "question"],
    });

    const afterRAGChain = new LLMChain({ llm, prompt: afterRAGPrompt });

    // Example questions about your codebase
    const questions = [
      "What is the structure of this Next.js application?",
      "What are the main features and components of this portfolio website?",
      "How is the chat functionality implemented?",
      "What UI components and styling approach is used?",
    ];

    for (const question of questions) {
      console.log(`\nQuestion: ${question}`);
      console.log("---");

      const retrievedDocs = await retriever.getRelevantDocuments(question);
      const context = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");

      const afterRAGResponse = await afterRAGChain.call({
        context,
        question,
      });

      console.log("RAG-Enhanced Response:");
      console.log(afterRAGResponse.text);
      console.log("\n" + "=".repeat(50));
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.error("\nTroubleshooting tips:");
    console.error(
      "1. Ensure output.txt is in the same directory as this script"
    );
    console.error("2. Make sure Ollama is running: ollama serve");
    console.error(
      "3. Verify you have the required models: ollama pull llama2 && ollama pull nomic-embed-text"
    );
    console.error("4. Ensure ChromaDB is running on port 8000");
  }
}

// Run the main function
main().catch(console.error);
