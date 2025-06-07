import './Navbar.css';

function Navbar() {
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