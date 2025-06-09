import './Navbar.css';
import React, { useState } from 'react';

function Navbar( { onSearch }) {
    const [input, setInput] = useState("");
    const handleSumbit = (e) => {
        e.preventDefault();
        console.log("Search query", input);
        onSearch(input);
    };
    return (
        <nav className="navbar">
        <div className="navbar-container">
            <a href="/" className="navbar-logo">
            <i>
            SHOP ONLINE
            </i>
            </a>
            <ul className="nav-menu">
                <li className="nav-item">
                    <form className="nav-search" onSubmit={handleSumbit}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="nav-search-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}

                        />
                        <button type="submit" className="nav-search-btn">
                            <i>Go</i>
                        </button>
                    </form>
                </li>
                <li className="nav-item">
                    <a href="/" className="nav-links"><i>Home</i></a>
                </li>
                <li className="nav-item">
                    <a href="/about" className="nav-links"><i>About</i></a>
                </li>
                <li className="nav-item">
                    <a href="/contact" className="nav-links"><i>Contact</i></a>
                </li>
            </ul>
        </div>
        </nav>
    );
}
export default Navbar;