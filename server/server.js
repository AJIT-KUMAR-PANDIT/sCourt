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

// Helper function to get available sites from the environment variable
const getAvailableSites = () => {
  const sites = process.env.SEARCH_SITES;
  return sites ? sites.split(",") : [];
};

// Function to validate if the site is available
const isValidSite = (site) => {
  const availableSites = getAvailableSites();
  return availableSites.includes(site);
};

// Helper function to interact with Groq
const queryGroq = async (prompt, maxTokens = 300, temperature = 0.7) => {
  try {
    const payload = {
      model: "llama3-8b-8192", // Specify the model (update with the correct model if needed)
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

// Helper function to add citation to results
const addCitations = (text) => {
  const citationPattern = /\[\d+\]/g; // Simple pattern to match citations like [1], [2], etc.
  const citations = text.match(citationPattern) || [];
  return { text, citations };
};

// Helper function to extract metadata such as title and links
const extractMetadata = (text) => {
  const metadata = [];
  const urlPattern = /https?:\/\/[^\s]+/g; // Extract URLs
  const titlePattern = /(?:Title:|Document Title:)\s*(.*)/g; // Example title pattern

  const urls = text.match(urlPattern) || [];
  const titles = text.match(titlePattern) || [];

  // Combine extracted URLs and titles into metadata
  for (let i = 0; i < Math.min(urls.length, titles.length); i++) {
    metadata.push({ title: titles[i] || "Untitled", url: urls[i] });
  }

  return metadata;
};

// Search Endpoint
app.post("/search", async (req, res) => {
  const { query, site } = req.body; // Allow site parameter to specify which site to search

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  // Check if the provided site is valid
  if (site && !isValidSite(site)) {
    return res
      .status(400)
      .json({ message: `Search is not allowed on site: ${site}` });
  }

  // If no site is provided, perform search on all allowed sites
  const prompt = site
    ? `Search for legal documents related to "${query}" on ${site} and provide a brief list of the most relevant results with short summaries, citations, titles, and links.`
    : `Search for legal documents related to "${query}" and provide a brief list of the most relevant results with short summaries, citations, titles, and links.`;

  try {
    const result = await queryGroq(prompt, 500);
    const resultWithCitations = addCitations(result); // Add citations to result

    // Extract metadata (URLs and Titles) from the Groq result
    const metadata = extractMetadata(resultWithCitations.text);

    // Return results along with citations and metadata
    res.json({ results: resultWithCitations, metadata });
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

  const prompt = `Provide the full content of the legal document titled "${title}". Include citations where applicable.`; // Added citation request

  try {
    const fullText = await queryGroq(prompt, 1000);
    const fullTextWithCitations = addCitations(fullText); // Add citations to full document
    res.json({ fullText: fullTextWithCitations });
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

  const prompt = `From the document titled "${title}", extract the parts relevant to "${query}". Include citations for each relevant fragment.`; // Added citation request

  try {
    const fragments = await queryGroq(prompt, 500);
    const fragmentsWithCitations = addCitations(fragments); // Add citations to fragments
    res.json({ fragments: fragmentsWithCitations });
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

  const prompt = `Provide metadata for the legal document titled "${title}". Include details like author, date, court, case number, and any relevant citations.`; // Added citation request

  try {
    const metadata = await queryGroq(prompt, 300);
    const metadataWithCitations = addCitations(metadata); // Add citations to metadata
    res.json({ metadata: metadataWithCitations });
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
