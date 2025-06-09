import React, {use, useEffect, useState} from "react";
import "./Body.css";

function Body() {
    const [results, setResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState(false);
    useEffect(() => {
        if (!searchQuery) return;
        setLoading(true);
        fetch(`/search?query=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
            setResults(data.products || []);
            setLoading(false);
        });
    }, [searchQuery]);
    return (
        <div className="body-container">
           { searchQuery ? (
            <h2>Results for {searchQuery}</h2>
              ) : (
            <h2>No search query provided.</h2>
           )}
        </div>

    )
}
export default Body;