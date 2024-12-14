import { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/search", {
        query,
      });
      const data = response.data.results;
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {results.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Search Results</h2>
          </div>

          {/* Display first result summary */}
          <div className="bg-gray-100 p-6 mb-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Summary</h3>
            <p>{results[0].text}</p>
            <div className="mt-2 text-sm text-gray-500">
              <strong>Source:</strong> {results[0].source}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <strong>Citations:</strong> {results[0].citations.join(", ")}
            </div>
          </div>

          {/* List of results */}
          <div>
            {results.slice(1).map((result, index) => (
              <div
                key={index}
                className="bg-white p-4 mb-4 rounded-lg shadow-md"
              >
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.url}
                </a>
                <p className="mt-2">{result.summary}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Source:</strong> {result.source}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Citations:</strong> {result.citations.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
