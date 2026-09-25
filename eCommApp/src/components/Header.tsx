import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

const Header = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            <header className="app-header">
                <h1>The Daily Harvest</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                    <button type="button" onClick={() => setIsContactOpen(true)}>Contact Us</button>
                    <Link to="/login" className="nav-button">Admin Login</Link>
                </nav>
            </header>
            {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
        </>
    );
};

export default Header;
