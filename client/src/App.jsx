import { useState } from "react";
import SearchBox from "./components/SearchBox";
import DocumentViewer from "./components/DocumentViewer";
import ChatBox from "./components/ChatBox";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleSearchResults = (data) => {
    setSearchResults(data.results);
  };

  const handleSelectDocument = (docId) => {
    setSelectedDocId(docId);
  };

  return (
    <div className="container mx-auto p-6">
      <SearchBox onSearchResults={handleSearchResults} />

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Search Results:</h3>
          {searchResults.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-300 rounded-lg mb-2"
            >
              <h4 className="font-semibold">{doc.title}</h4>
              <p>{doc.snippet}</p>
              <button
                onClick={() => handleSelectDocument(doc.id)}
                className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Full Document
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDocId && (
        <div>
          <DocumentViewer docId={selectedDocId} />
          <ChatBox documentContent={selectedDocId} />
        </div>
      )}
    </div>
  );
};

export default App;
