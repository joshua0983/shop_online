import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Body.css";
import Item from './Item';

const FILTER_OPTIONS = [
    { label: "All", value: "" },
    { label: "Foundation", value: "foundation" },
    { label: "Lipstick", value: "lipstick" },
    { label: "Mascara", value: "mascara" },
    { label: "Blush", value: "blush" },
    { label: "Concealer", value: "concealer" },
    { label: "Powder", value: "powder" },
    { label: "Eyeliner", value: "eyeliner" },
    { label: "Palette", value: "palette" },
    // Add more as needed
];

function Body({ searchQuery }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trending, setTrending] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");
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
            if (currentQuery.current === searchQuery) {
                setResults(prevResults => {
                    const newResults = [...prevResults, ...(data.products || [])];

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

    // Filter results based on dropdown
    const filteredResults = filter
        ? results.filter(item =>
            item.name.toLowerCase().includes(filter) ||
            item.categories.toLowerCase().includes(filter)
        )
        : results;

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
                    <div style={{ margin: "20px 0" }}>
                        <label htmlFor="filter-dropdown" style={{ marginRight: 8 }}>Filter:</label>
                        <select
                            id="filter-dropdown"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            {FILTER_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <ul>
                        {filteredResults.map((item, idx) => (
                            <div key={item.id || idx} ref={idx === filteredResults.length - 1 ? lastItemRef : null}>
                                <Item item={item} />
                            </div>
                        ))}
                    </ul>
                    {loading && <h2>Loading more...</h2>}
                    {!hasMore && filteredResults.length > 0 && <h2>No more results</h2>}
                </>
            )}
        </div>
    );
}

export default Body;