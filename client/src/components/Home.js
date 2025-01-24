import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import axios from 'axios'; 

export default function Home() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/api/profile', { headers }); // Use axios to fetch data
        setUsername(response.data.username);
        // toast.success('logged in successfully!');
      } catch (error) {
        console.error('Error fetching username:', error);
        toast.error('Error fetching username');
      }
    };
    fetchUsername();
  }, []);
 


  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="tabs">
          <div className="tab active">Home</div>
          <Link to="/measurements" className="tab">Measurements</Link>
          {<Link to="/Profile" className="tab">profile</Link>}
         <Link to="/fashion-ai" className="tab">FASHION AI<sup>soon</sup></Link> 
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
      <div className="card home-container">
        <h2>Welcome to MeasureMate</h2>
        <p>
          MeasureMate is your go-to solution for managing and tracking your measurements. Whether you're a tailor, a fitness enthusiast, or just someone who wants to keep track of their body measurements, MeasureMate provides an easy and efficient way to store and access your data.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}