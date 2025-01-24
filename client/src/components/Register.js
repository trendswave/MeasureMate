import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', { username, email, password });
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Error registering');
    }
  };

  return (
    <div className="container">
      <div className="card register-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="navigation-buttons">
          <Link to="/login">Login</Link>
          <Link to="/reset-password">Reset Password</Link>
          <Link to="/">Back to Home</Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}