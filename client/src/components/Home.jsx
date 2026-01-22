// -------------------- components/Home.jsx --------------------
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from './Navbar';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />

      <header className="hero-section">
        <h1>Welcome to <span className="highlight">WebNote</span></h1>
        <p>Your secure place to upload, access, and manage your files—anytime, anywhere.</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose WebNote?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>🛡️ Secure Uploads</h3>
            <p>Your files are stored safely, accessible only by you.</p>
          </div>
          <div className="feature-card">
            <h3>☁️ Access Anywhere</h3>
            <p>Login from any device and manage your files instantly.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Simple & Fast</h3>
            <p>No complexity. Just register, login, upload, and go.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 WebNote. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
