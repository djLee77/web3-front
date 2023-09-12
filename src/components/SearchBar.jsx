import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search-result?query=${searchTerm}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a product..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;