import React, {useEffect, useState} from "react";
import "./Body.css";
import Item from './Item';

function Body({ searchQuery }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!searchQuery) return;
        setLoading(true);
        fetch(`http://localhost:3001/search?query=${searchQuery}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setResults(data.products || []);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            setLoading(false);
        })
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
                            <Item key={idx} item={item} />
                        ))}
                    </ul>
                </>
            )}
        </div>

    )
}
export default Body;