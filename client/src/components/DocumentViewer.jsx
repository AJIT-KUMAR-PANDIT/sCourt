import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const DocumentViewer = ({ docId }) => {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use useCallback to memoize the fetchDocument function
  const fetchDocument = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`/full-document?id=${docId}`);
    const data = await response.json();
    setDocument(data);
    setIsLoading(false);
  }, [docId]); // Dependency on docId

  useEffect(() => {
    if (docId) {
      fetchDocument();
    }
  }, [docId, fetchDocument]); // Add fetchDocument here as a dependency

  if (isLoading) return <p>Loading...</p>;

  if (!document) return <p>No document available</p>;

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-2">Full Document</h2>
      <p>{document.fullText}</p>
      <h3 className="text-lg mt-4">Summary:</h3>
      <p>{document.summary}</p>
      <p className="text-sm mt-2 text-gray-600">{document.citation}</p>
    </div>
  );
};

// Define prop types for the component
DocumentViewer.propTypes = {
  docId: PropTypes.string.isRequired, // docId is expected to be a string and is required
};

export default DocumentViewer;
