import React from "react";
import ToggleMenu from "./ToggleMenu";
import "../css/NavBar.css"
import "../components/SearchBar"
import SearchBar from "../components/SearchBar";

const NavBar = () => {
  return (
    <div className="body">
      <div>
        <ToggleMenu/>
      </div>
      <div>
        <SearchBar/>
      </div>
    </div>
  );
};

export default NavBar;
