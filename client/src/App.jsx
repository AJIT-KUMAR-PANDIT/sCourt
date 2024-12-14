import React, { useState } from "react";

const App = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [citations, setCitations] = useState([]);
  const [error, setError] = useState("");

  // Function to handle the search request to the backend API
  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError("");
    setResponse("");
    setCitations([]);

    try {
      const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.results) {
        setResponse(data.results.text); // Assuming response.text contains the legal document's summary or full content
        setCitations(data.results.citations); // Assuming citations are part of the response
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Legal Document Search
        </h1>

        {/* Input Section */}
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Search for legal documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Response Display */}
        {!loading && response && (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">
                Search Results:
              </h3>
              <p className="text-gray-800">{response}</p>
            </div>

            {/* Citations */}
            {citations.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="text-lg font-medium text-gray-700">
                  Citations:
                </h4>
                <ul className="list-disc pl-5">
                  {citations.map((citation, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      <span className="font-bold">[{index + 1}]</span>{" "}
                      {citation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Example of Full Document Request */}
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">
            Request Full Document:
          </h3>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter document title to view full content"
          />
          <button
            onClick={handleSearch} // Adjust this to fetch the full document
            className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            View Full Document
          </button>
        </div>

        {/* Example of Document Fragments Request */}
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">
            Request Document Fragments:
          </h3>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter document title and fragment query"
          />
          <button
            onClick={handleSearch} // Adjust this to fetch document fragments
            className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Get Fragments
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
