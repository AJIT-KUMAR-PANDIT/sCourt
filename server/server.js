// Load environment variables
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const { Groq } = require("groq-sdk");

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Groq with the API key
const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
  console.error("GROQ_API_KEY is missing in the .env file");
  process.exit(1);
}

const groq = new Groq({ apiKey: groqApiKey });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static frontend files

// Helper function to interact with Groq
const queryGroq = async (prompt, maxTokens = 300, temperature = 0.7) => {
  try {
    const payload = {
      model: "llama3-8b-8192", // Specify the model (update with the correct model if needed)   mixtral-8x7b-32768
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    };

    const response = await groq.chat.completions.create(payload);
    return response.choices[0].message.content || response.choices[0].content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Error communicating with Groq API");
  }
};

// Search Endpoint
app.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const prompt = `Search for legal documents related to "${query}" and provide a brief list of the most relevant results with short summaries.`;

  try {
    const result = await queryGroq(prompt, 500);
    res.json({ results: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Full Document Endpoint (Lazy Load)
app.post("/full-document", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Document title is required" });
  }

  const prompt = `Provide the full content of the legal document titled "${title}".`;

  try {
    const fullText = await queryGroq(prompt, 1000);
    res.json({ fullText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Document Fragments Endpoint
app.post("/document-fragments", async (req, res) => {
  const { title, query } = req.body;

  if (!title || !query) {
    return res
      .status(400)
      .json({ message: "Document title and fragment query are required" });
  }

  const prompt = `From the document titled "${title}", extract the parts relevant to "${query}".`;

  try {
    const fragments = await queryGroq(prompt, 500);
    res.json({ fragments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Document Metadata Endpoint
app.post("/document-metadata", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Document title is required" });
  }

  const prompt = `Provide metadata for the legal document titled "${title}". Include details like author, date, court, and case number.`;

  try {
    const metadata = await queryGroq(prompt, 300);
    res.json({ metadata });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Groq API Integration Server!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
