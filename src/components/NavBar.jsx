import React from "react";
import ToggleMenu from "./ToggleMenu";
import "../css/NavBar.module.css";
const NavBar = () => {
    return (
        <div className="body">
            <div>
                <ToggleMenu />
            </div>
            <h1>검색창 자리</h1>
        </div>
    );
};

export default NavBar;
