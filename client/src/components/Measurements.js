import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import './Measurements.css';

export default function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('/api/measurements', { headers });
        setMeasurements(response.data);
        toast.success('Measurements fetched successfully!');
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

    fetchMeasurements();
    fetchUsername();
  }, []);

  return (
    <div className="container">
      <Navbar username={username} handleLogout={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }} />
      <h2>{username}'s Measurements</h2>
      <table>
        <thead>
          <tr>
            <th>Measurement</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={measurement.id}>
              {Object.entries(measurement).map(([key, value]) => (
                <td key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}