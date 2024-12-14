import { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState(""); // Search query state
  const [results, setResults] = useState([]); // Search results state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state

  // Function to handle the search
  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query"); // If no query, show an error
      return;
    }

    setLoading(true); // Set loading state to true
    setError(""); // Reset error message
    try {
      // Make a POST request to the backend server to fetch search results
      const response = await axios.post("http://localhost:3000/search", {
        query, // Send query to the backend
      });
      const data = response.data.results; // Get results from the response
      setResults(data); // Update the results state
    } catch (err) {
      console.error(err); // Log error
      setError("An error occurred while fetching the search results"); // Set error state
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {console.log(results.text)}
      <div className="flex justify-center mb-8">
        {/* Input for search query */}
        <input
          type="text"
          placeholder="Search for legal documents..."
          className="w-1/2 p-4 border rounded-lg shadow-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state on input change
        />
        <button
          onClick={handleSearch} // Trigger search on button click
          className="ml-4 p-4 bg-blue-500 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Show loading message if results are being fetched */}
      {loading && <div className="text-center text-lg">Searching...</div>}

      {/* Show error message if there was an issue with the search */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Display results if any exist */}
      {results.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Search Results</h2>
          </div>

          {/* Display first result summary */}
          <div className="bg-gray-100 p-6 mb-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Summary</h3>
            <p>{results.text}</p> {/* Display text of first result */}
            <div className="mt-2 text-sm text-gray-500">
              <strong>Citations:</strong> {results[0].citations.join(", ")}{" "}
              {/* Display citations */}
            </div>
          </div>

          {/* List of other results */}
          <div>
            {results.slice(1).map((result, index) => (
              <div
                key={index}
                className="bg-white p-4 mb-4 rounded-lg shadow-md"
              >
                {/* Display URL for other results */}
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.url}
                </a>
                <p className="mt-2">{result.summary}</p>{" "}
                {/* Display summary of the result */}
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Citations:</strong> {result.citations.join(", ")}{" "}
                  {/* Display citations */}
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
