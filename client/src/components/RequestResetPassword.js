import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import the global CSS file

export default function RequestResetPassword() {
  const [email, setEmail] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/request-reset-password', { email });
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error('Error requesting password reset');
    }
  };

  return (
    <div className="container">
      <div className="card request-reset-password-container">
        <h2>Request Password Reset</h2>
        <form onSubmit={handleRequestReset}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Request Password Reset</button>
        </form>
        <div className="navigation-buttons">
          <Link to="/login" className="tab" >Back to Login</Link>
          <Link to="/" className="tab" >Back to Home</Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}