// -------------------- components/Login.jsx --------------------
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Navbar from './Navbar';


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">

        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" onChange={handleChange} /><br />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );

}

export default Login;
