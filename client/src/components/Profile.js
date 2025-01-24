import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Profile.css';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [measurements, setMeasurements] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/profile', { headers });
      const { username, email, profile_picture } = response.data;
      setUsername(username);
      setEmail(email);
      setProfilePictureUrl(profile_picture);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error fetching profile');
    }
  };

  const fetchMeasurements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/measurements', { headers });
      setMeasurements(response.data);
    } catch (error) {
      console.error('Error fetching measurements:', error);
      toast.error('Error fetching measurements');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMeasurements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      await axios.put('/api/profile', { username, email, password }, { headers });
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

const handleProfilePictureChange = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('profilePicture', file);

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.put('/api/profile-picture', formData, {
      headers,
      onUploadProgress: (progressEvent) => {
        const uploadPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Update UI with upload progress (e.g., progress bar)
        console.log(`Upload progress: ${uploadPercentage}%`);
      },
    });
    const { profile_picture_url } = response.data;
    setProfilePictureUrl(profile_picture_url);

    toast.success('Profile picture updated successfully!');
    fetchProfile(); // Refresh the profile data
  } catch (error) {
    console.error('Error updating profile picture:', error);
    toast.error('Error updating profile picture');

    // Handle specific errors (optional)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
    } else if (error.code === 'ECONNREFUSED') {
      // Handle network error
    }
  }
};


const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete('/api/profile', { headers });
      toast.success('Account deleted successfully!');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error deleting account');
    }
  };

  
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/') ;
  };

  const toggleMeasurements = () => {
    setShowMeasurements(!showMeasurements);
  };

  return (
    <div className="container">
      <Navbar username={username} handleLogout={handleLogout} />
      <div className="card profile-container">
        <h2>Profile</h2>
        <div className="profile-picture">
          <img src={profilePictureUrl} alt="Profile" />
          <input type="file" onChange={handleProfilePictureChange} />
        </div>
        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Update Profile</button>
          </form>
        ) : (
          <div className="profile-details">
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <button onClick={() => setEditMode(true)} className="edit-button">Edit Profile</button>
          </div>
        )}
        <button onClick={toggleMeasurements} className="toggle-button">
          {showMeasurements ? 'Hide Measurements' : 'View Measurements'}
        </button>
        {showMeasurements && (
          <div>
            <h2>Measurements</h2>
            <ul className="measurements-list">
              {measurements.map((measurement) => (
                <li key={measurement.id} className="measurement-item">
                  {Object.entries(measurement).map(([key, value]) => (
                    <span key={key} className="measurement-detail">{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={openDeleteModal} className="delete-button">Delete Account</button>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete your account?</h3>
              <button onClick={handleDeleteAccount} className="confirm-button">Yes</button>
              <button onClick={closeDeleteModal} className="cancel-button">No</button>
            </div>
          </div>
        )}
        <div className="navigation-buttons">
          <Link to="/">Back to Home</Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}