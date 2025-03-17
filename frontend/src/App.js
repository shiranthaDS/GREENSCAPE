import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Import Router and Route
import AppointmentForm from "./pages/AppointmentForm";
import AdminAppointments from "./pages/AdminAppointments";
import CostEstimator from "./pages/cost";
import AppointmentList from "./pages/AppointmentList";  
import CustomerProfile from "./pages/CustomerProfile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <Router> {/* Wrap the entire app in Router */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
          {/* Navigation Buttons */}
          <nav className="mb-4">
            <Link to="/signup">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Signup</button>
            </Link>
            <Link to="/login">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Login</button>
            </Link>
            <Link to="/admin-appointments">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Admin Appointments</button>
            </Link>
            <Link to="/appointment-form">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Appointment Form</button>
            </Link>
            <Link to="/cost-estimator">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Cost Estimator</button>
            </Link>
            <Link to="/appointment-list">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Appointment List</button>
            </Link>
            <Link to="/customer-profile">
              <button className="p-2 bg-blue-500 text-white rounded-md m-2">Customer Profile</button>
            </Link>
          </nav>
          
          {/* Routes for Pages */}
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-appointments" element={<AdminAppointments />} />
            <Route path="/appointment-form" element={<AppointmentForm />} />
            <Route path="/cost-estimator" element={<CostEstimator />} />
            <Route path="/appointment-list" element={<AppointmentList />} />
            <Route path="/customer-profile" element={<CustomerProfile />} />
            <Route path="/" element={<Home />} /> {/* Home route for the landing page */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Dummy Home component for the root path (can be replaced with the actual home page)
const Home = () => (
  <div>
    <h1>Welcome to the Greenscape App</h1>
  </div>
);

export default App;
