import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './AddEditMeasurements.css';

export default function AddEditMeasurements() {
  const [measurements, setMeasurements] = useState([]);
  const [measurementData, setMeasurementData] = useState({
    name: '',
    chest: '',
    belly: '',
    shoulder: '',
    sleeve: '',
    hip: '',
    armhole: '',
    cufflinks: '',
    muscle: '',
    neck: '',
    length: '',
    waist: '',
    thigh: '',
    knee: '',
    bottom: '',
    agbada: '',
    cap: '',
    phoneNumber: ''
  });
  const [editId, setEditId] = useState(null);
  const [username, setUsername] = useState('');

  const fetchMeasurements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/measurements', { headers });
      setMeasurements(response.data);
      // toast.success('Measurements fetched successfully!');
    } catch (error) {
      console.error('Error fetching measurements:', error);
      toast.error('Error fetching measurements');
    }
  };

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/profile', { headers });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
      toast.error('Error fetching username');
    }
  };

  useEffect(() => {
    fetchMeasurements();
    fetchUsername();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurementData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('http://localhost:5000/api/measurements', measurementData, { headers });
      toast.success('Measurement added successfully!');
      setMeasurementData({
        name: '',
        chest: '',
        belly: '',
        shoulder: '',
        sleeve: '',
        hip: '',
        armhole: '',
        cufflinks: '',
        muscle: '',
        neck: '',
        length: '',
        waist: '',
        thigh: '',
        knee: '',
        bottom: '',
        agbada: '',
        cap: '',
        phoneNumber: ''
      });
      fetchMeasurements(); // Refresh the measurements list
    } catch (error) {
      console.error('Error adding measurement:', error);
      toast.error('Error adding measurement');
    }
  };

  const handleEditMeasurement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:5000/api/measurements/${editId}`, measurementData, { headers });
      toast.success('Measurement updated successfully!');
      setEditId(null);
      fetchMeasurements(); // Refresh the measurements list
    } catch (error) {
      console.error('Error updating measurement:', error);
      toast.error('Error updating measurement');
    }
  };

  const handleEditClick = (measurement) => {
    setMeasurementData(measurement);
    setEditId(measurement.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <Navbar username={username} handleLogout={handleLogout} />
      <div className="card measurements-container">
        <h2>Add/Edit Measurements</h2>
        <form onSubmit={editId ? handleEditMeasurement : handleAddMeasurement} className="measurement-form">
          {Object.keys(measurementData).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={measurementData[key]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="submit-button">
            {editId ? 'Update Measurement' : 'Add Measurement'}
          </button>
        </form>
        <h2>Existing Measurements</h2>
        <ul className="measurements-list">
          {measurements.map((measurement) => (
            <li key={measurement.id} className="measurement-item">
              {Object.entries(measurement).map(([key, value]) => (
                <span key={key} className="measurement-detail">{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</span>
              ))}
              <button onClick={() => handleEditClick(measurement)} className="edit-button">Edit</button>
            </li>
          ))}
        </ul>
        <div className="navigation-buttons">
          <Link to="/">Back to Home</Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}