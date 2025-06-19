import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Body.css";
import Item from './Item';

function Body({ searchQuery }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trending, setTrending] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const observer = useRef();
    const currentQuery = useRef(searchQuery);

    const lastItemRef = useCallback(node => {
        if (loading || !hasMore) return;
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
        setError(null);
        currentQuery.current = searchQuery;
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery || loading || !hasMore) return;
        
        setLoading(true);
        fetch(`http://localhost:3001/search?query=${searchQuery}&page=${page}&limit=12`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Only update if we're still on the same search query
            if (currentQuery.current === searchQuery) {
                setResults(prevResults => {
                    const newResults = [...prevResults, ...(data.products || [])];
                    // If we got fewer results than requested, we've reached the end
                    setHasMore(data.products && data.products.length === 12);
                    return newResults;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [searchQuery, page]);

    // Add new useEffect for trending products
    useEffect(() => {
        if (!searchQuery) {
            setTrendingLoading(true);
            fetch('http://localhost:3001/trending/makeup')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`error ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setTrending(data.products || []);
                })
                .catch(error => {
                    console.error('Error fetching trending products:', error);
                })
                .finally(() => {
                    setTrendingLoading(false);
                });
        }
    }, [searchQuery]);

    return (
        <div className="body-container">
            {!searchQuery ? (
                <>
                    <h2 className="trending-title">Trending in Makeup</h2>
                    {trendingLoading ? (
                        <h3>Loading trending products...</h3>
                    ) : (
                        <ul className="trending-grid">
                            {trending.map((item, idx) => (
                                <div key={item.id}>
                                    <Item item={item} />
                                </div>
                            ))}
                        </ul>
                    )}
                </>
            ) : error ? (
                <h2>Error: {error}</h2>
            ) : (
                <>
                    <h2><i>Results for {searchQuery} </i></h2>
                    <ul>
                        {results.map((item, idx) => (
                            <div key={idx} ref={idx === results.length - 1 ? lastItemRef : null}>
                                <Item item={item} />
                            </div>
                        ))}
                    </ul>
                    {loading && <h2>Loading</h2>}
                    {!hasMore && results.length > 0 && <h2>No more results</h2>}
                </>
            )}
        </div>
    );
}

export default Body;