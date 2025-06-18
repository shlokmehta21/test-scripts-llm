const { ChatOllama } = require("@langchain/ollama");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // 1. Load and Split Data from local file
    console.log("Loading local document...");
    
    // Check if output.txt exists
    const filePath = path.join(__dirname, 'output.txt');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}. Please ensure output.txt is in the same directory as this script.`);
    }
    
    // Load the local text file
    const loader = new TextLoader(filePath);
    const documents = await loader.load();
    
    console.log(`Loaded document with ${documents[0].pageContent.length} characters`);
    
    // Split the document into smaller chunks for large files
    console.log("Splitting documents...");
    const textSplitter = new RecursiveCharacterTextSplitter({ 
      chunkSize: 500,   // Smaller chunks for large files
      chunkOverlap: 50,  // Reduced overlap
      separators: ["\n\n", "\n", " ", ""] // Better separators for code
    });
    const docSplits = await textSplitter.splitDocuments(documents);
    
    console.log(`Created ${docSplits.length} document chunks`);
    
    // Limit the number of chunks to avoid memory issues
    const maxChunks = 200; // Process only first 200 chunks
    const limitedChunks = docSplits.slice(0, maxChunks);
    console.log(`Processing ${limitedChunks.length} chunks (limited from ${docSplits.length})`);

    // 2. Convert Documents to Embeddings and Store Them in ChromaDB
    console.log("Creating vector store...");
    const embeddings = new OllamaEmbeddings({ 
      model: "nomic-embed-text",
      baseUrl: "http://localhost:11434"
    });
    
    // Process chunks in batches to avoid memory issues
    const batchSize = 10;
    console.log(`Processing ${limitedChunks.length} chunks in batches of ${batchSize}...`);
    
    let vectorStore;
    
    for (let i = 0; i < limitedChunks.length; i += batchSize) {
      const batch = limitedChunks.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(limitedChunks.length/batchSize)}...`);
      
      try {
        if (i === 0) {
          // Create the vector store with the first batch
          vectorStore = await Chroma.fromDocuments(batch, embeddings, { 
            collectionName: "local-repo-rag",
            url: "http://localhost:8000"
          });
        } else {
          // Add subsequent batches to the existing vector store
          await vectorStore.addDocuments(batch);
        }
      } catch (error) {
        console.error(`Error processing batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        // Continue with next batch instead of failing completely
        continue;
      }
    }
    if (!vectorStore) {
      throw new Error("Failed to create vector store - all batches failed");
    }
    
    console.log("Vector store created successfully!");
    
    const retriever = vectorStore.asRetriever({
      k: 3 // Return top 3 most relevant chunks (reduced from 5)
    });

    // 3. Initialize the LLM
    const llm = new ChatOllama({ 
      model: "llama2", // Make sure this model is available in your Ollama
      baseUrl: "http://localhost:11434"
    });

    // 4. Before RAG - General question about the codebase
    console.log("\n=== Before RAG ===\n");
    const beforeRAGTemplate = "What can you tell me about {topic}? Provide a general overview.";
    const beforeRAGPrompt = new PromptTemplate({ 
      template: beforeRAGTemplate, 
      inputVariables: ["topic"] 
    });
    
    const beforeRAGChain = new LLMChain({ llm, prompt: beforeRAGPrompt });
    const beforeRAGResponse = await beforeRAGChain.call({ topic: "Next.js portfolio website development" });
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
      "What UI components and styling approach is used?"
    ];
    
    for (const question of questions) {
      console.log(`\nQuestion: ${question}`);
      console.log("---");
      
      const retrievedDocs = await retriever.getRelevantDocuments(question);
      const context = retrievedDocs.map(doc => doc.pageContent).join("\n\n");
      
      const afterRAGResponse = await afterRAGChain.call({ 
        context, 
        question 
      });
      
      console.log("RAG-Enhanced Response:");
      console.log(afterRAGResponse.text);
      console.log("\n" + "=".repeat(50));
    }

  } catch (error) {
    console.error("Error:", error.message);
    console.error("\nTroubleshooting tips:");
    console.error("1. Ensure output.txt is in the same directory as this script");
    console.error("2. Make sure Ollama is running: ollama serve");
    console.error("3. Verify you have the required models: ollama pull llama2 && ollama pull nomic-embed-text");
    console.error("4. Ensure ChromaDB is running on port 8000");
  }
}

// Run the main function
main().catch(console.error);
