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
        <div className="hero-copy">
          <p className="eyebrow">Knowledge Sharing Platform</p>
          <h1>Build your channel and share learning materials beautifully.</h1>
          <p>
            Upload files, publish by category, and let learners discover your channel from anywhere.
          </p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/register')}>Create Account</button>
            <button className="secondary" onClick={() => navigate('/channels')}>Explore Channels</button>
          </div>
        </div>

        <div className="hero-panel">
          <h3>What You Can Do</h3>
          <ul>
            <li>Create a custom channel URL</li>
            <li>Add a profile logo and categories</li>
            <li>Share movies, books, videos, and study materials</li>
          </ul>
        </div>
      </header>

      <section className="features-section">
        <h2>Why WebNote</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Secure Storage</h3>
            <p>Your uploaded content stays tied to your account with visibility controls.</p>
          </div>
          <div className="feature-card">
            <h3>Channel Experience</h3>
            <p>Each user gets a discoverable channel page with searchable public materials.</p>
          </div>
          <div className="feature-card">
            <h3>Fast Discovery</h3>
            <p>Visitors can browse all channels and jump directly to the content they need.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Copyright 2026 WebNote</p>
      </footer>
    </div>
  );
}

export default Home;
