import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Body.css";
import Item from './Item';

function Body({ searchQuery }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState("");
    const [filterOptions, setFilterOptions] = useState([{ label: "All", value: "" }]);
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
        })
        .finally(() => {
            setLoading(false);
        });
    }, [searchQuery, page]);

    useEffect(() => {
        fetch('http://localhost:3001/categories')
            .then(res => res.json())
            .then(data => {
                if (data.categories && data.categories.length > 0) {
                    setFilterOptions([
                        { label: "All", value: "" },
                        ...data.categories.map(cat => ({
                            label: cat,
                            value: cat.toLowerCase()
                        }))
                    ]);
                }
            })
            .catch(() => {
                setFilterOptions([{ label: "All", value: "" }]);
            });
    }, []);

    // Filter results based on dropdown
    const filteredResults = filter
        ? results.filter(item =>
            item.name.toLowerCase().includes(filter) ||
            item.categories.toLowerCase().includes(filter)
        )
        : results;

    return (
        <div className="body-container">
            {searchQuery && (
                <>
                    <div style={{ margin: "20px 0" }}>
                        <label htmlFor="filter-dropdown" style={{ marginRight: 8 }}>Filter:</label>
                        <select
                            id="filter-dropdown"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            {filterOptions.map(opt => (
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