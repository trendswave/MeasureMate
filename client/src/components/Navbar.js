import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function Navbar({ username, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="tabs">
        <Link to="/" className="tab">Home</Link>
        <Link to="/measurements" className="tab">Measurements</Link>
        <Link to="/profile" className="tab">Profile</Link>
        <Link to="/add-edit-measurements" className="tab">Add/Edit Measurements</Link>
        <Link to="" className="tab">AI<sup>soon</sup></Link>
      </div>
      <div className="auth-links">
        {username ? (
          <>
            <span className="tab">Welcome, {username}</span>
            <button onClick={handleLogout} className="tab">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="tab">Login</Link>
            <Link to="/register" className="tab">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}