import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
        <div className="navbar-container">
            <a href="/" className="navbar-logo">
            MyApp
            </a>
            <ul className="nav-menu">
            <li className="nav-item">
                <a href="/" className="nav-links">Home</a>
            </li>
            <li className="nav-item">
                <a href="/about" className="nav-links">About</a>
            </li>
            <li className="nav-item">
                <a href="/contact" className="nav-links">Contact</a>
            </li>
            </ul>
        </div>
        </nav>
    );
}
export default Navbar;