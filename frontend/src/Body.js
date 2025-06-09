import React, {useEffect, useState} from "react";
import "./Body.css";

function Body({ searchQuery }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
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
           { !searchQuery ? (
                <h2>No search query provided.</h2>
            ) : loading ? (
                <h2>Loading...</h2>
            ) : (
                <>
                    <h2>Results for {searchQuery}</h2>
                    <ul>
                        {results.map((item, idx) => (
                            <li key={idx}>{item.name}  </li>
                        ))}
                    </ul>
                </>
            )}
        </div>

    )
}
export default Body;