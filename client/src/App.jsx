import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle the search
  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Make a POST request to the backend server to fetch search results
      const response = await axios.post("http://localhost:3000/search", {
        query,
      });

      // Set the entire search data response
      setSearchData(response.data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the search results");
    } finally {
      setLoading(false);
    }
  };

  // Render citations
  const renderCitations = (citations) => {
    return citations && citations.length > 0
      ? citations.join(", ")
      : "No citations available";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {console.log(searchData)}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for legal documents..."
          className="w-1/2 p-4 border rounded-lg shadow-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-4 p-4 bg-blue-500 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {loading && <div className="text-center text-lg">Searching...</div>}

      {error && <div className="text-center text-red-500">{error}</div>}

      {searchData && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Search Results</h2>
          </div>

          {/* Main result display */}
          <div className="bg-gray-100 p-6 mb-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Main Result</h3>
            <p>{searchData.results.text}</p>
            <div className="mt-2 text-sm text-gray-500">
              <strong>Citations:</strong>{" "}
              {renderCitations(searchData.results.citations)}
            </div>
          </div>

          {/* Metadata section */}
          {searchData.metadata && searchData.metadata.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Additional Information
              </h3>
              {searchData.metadata.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 mb-4 rounded-lg shadow-md"
                >
                  <p>{item.title || "No additional details"}</p>
                  <br />
                  <p>
                    <a
                      href={item.url.slice(0, -1)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link: {item.url.slice(0, -1)}
                    </a>
                  </p>
                  {item.citations && (
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Citations:</strong>{" "}
                      {renderCitations(item.citations)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
