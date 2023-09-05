import { React, useState } from "react";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const onChange = (e) =>{
        setSearch(e.target.value);
    }
    return(
        <div>
            <input type="text" value={search} onChange={onChange}></input>
        </div>
    )
}

export default SearchBar;