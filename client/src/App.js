import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login';
import Register from './components/Register';
import Profile from './components/Profile';
import Measurements from './components/Measurements';
// import Bookings from './components/Bookings';
// import Query from './components/Query';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import AddEditMeasurements from './components/AddEditMeasurements';
// import ViewMeasurements from './components/ViewMeasurements';
// import SuperuserDashboard from './components/SuperuserDashboard';
// import RegisterSuperUser from './components/RegisterSuperUser';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import FashionAI from './components/FashionAI';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/fashion-ai" element={<FashionAI />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/measurements" element={<Measurements />} />
          {/* <Route path="/bookings" element={<Bookings />} />
          <Route path="/query" element={<Query />} /> */}
          <Route path="/add-edit-measurements" element={<AddEditMeasurements />} />
          <Route path="/request-reset-password" element={<RequestResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* <Route path="/add-measurement" element={<AddEditMeasurements />} /> */}
          {/* <Route path="/edit-measurement/:id" element={<AddEditMeasurements />} />
          <Route path="/view-measurements" element={<ViewMeasurements />} /> */}
          {/* <Route path="/superuser-dashboard" element={<SuperuserDashboard />} /> */}
          {/* <Route path="/register-superuser" element={<RegisterSuperUser />} /> */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute> }/> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;