import { useState } from "react";
import PropTypes from "prop-types";

const SearchBox = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const response = await fetch(`/search?query=${query}`);
    const data = await response.json();
    onSearchResults(data); // Pass the data to the parent component
  };

  return (
    <div className="mb-4 p-4 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Search Indian Kanoon</h2>
      <input
        type="text"
        className="p-2 border border-gray-300 rounded-lg w-full"
        placeholder="Enter search term"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
};

// Add PropTypes validation for the onSearchResults prop
SearchBox.propTypes = {
  onSearchResults: PropTypes.func.isRequired, // onSearchResults should be a required function
};

export default SearchBox;
