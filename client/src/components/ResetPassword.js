import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import the global CSS file

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reset-password/${token}`, { newPassword });
      toast.success('Password reset successfully!');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error resetting password');
    }
  };

  return (
    <div className="container">
      <div className="card reset-password-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
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