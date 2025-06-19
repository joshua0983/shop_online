import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Body.css";
import Item from './Item';

function Body({ searchQuery }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    
    const lastItemRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        setResults([]);
        setPage(1);
        setHasMore(true);
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery) return;
        setLoading(true);
        fetch(`http://localhost:3001/search?query=${searchQuery}&page=${page}&limit=12`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setResults(prevResults => [...prevResults, ...(data.products || [])]);
            setHasMore(data.products.length > 0);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            setLoading(false);
        });
    }, [searchQuery, page]);

    return (
        <div className="body-container">
           { !searchQuery ? (
                <h2>No search query provided.</h2>
            ) : (
                <>
                    <h2>Results for {searchQuery}</h2>
                    <ul>
                        {results.map((item, idx) => (
                            <div key={idx} ref={idx === results.length - 1 ? lastItemRef : null}>
                                <Item item={item} />
                            </div>
                        ))}
                    </ul>
                    {loading && <h2>Loading more...</h2>}
                </>
            )}
        </div>
    );
}

export default Body;