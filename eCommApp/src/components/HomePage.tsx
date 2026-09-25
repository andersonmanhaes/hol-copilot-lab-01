import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ContactModal from './ContactModal';

const HomePage = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <h2>Welcome to the The Daily Harvest!</h2>
                <p>Check out our products page for some great deals.</p>
                <button type="button" onClick={() => setIsContactOpen(true)}>Contact Us</button>
            </main>
            <Footer />
            {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
        </div>
    );
};

export default HomePage;
