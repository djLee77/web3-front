import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "../css/SearchBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase } from "@mui/material";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search-result?query=${searchTerm}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={style.container}>
      <IconButton type="button" onClick={handleSearch} sx={{ p: "10px" }}>
        <SearchIcon />
      </IconButton>
      <InputBase
        style={{ width: "550px" }}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default SearchBar;
