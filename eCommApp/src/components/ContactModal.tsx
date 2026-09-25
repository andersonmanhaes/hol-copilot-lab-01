import { useState } from 'react';

interface ContactModalProps {
    onClose: () => void;
}

const ContactModal = ({ onClose }: ContactModalProps) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.currentTarget.reset();
        setSubmitted(true);
    };

    return (
        <div className="modal-backdrop" role="presentation">
            <div className="modal-content contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
                {submitted ? (
                    <>
                        <h2 id="contact-modal-title">Thank you for your message.</h2>
                        <button type="button" onClick={onClose}>Continue</button>
                    </>
                ) : (
                    <>
                        <h2 id="contact-modal-title">Contact Us</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <label htmlFor="contact-name">Name</label>
                            <input id="contact-name" name="name" type="text" required autoFocus />

                            <label htmlFor="contact-email">Email</label>
                            <input id="contact-email" name="email" type="email" required />

                            <label htmlFor="contact-request">Request</label>
                            <textarea id="contact-request" name="request" required />

                            <button type="submit">Submit</button>
                        </form>
                        <button type="button" onClick={onClose} className="close-button" aria-label="Close contact form">×</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactModal;