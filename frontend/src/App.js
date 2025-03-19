import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Import Router and Route
import AppointmentForm from "./pages/AppointmentForm";
import AdminAppointments from "./pages/AdminAppointments";
import CostEstimator from "./pages/cost";
import AppointmentList from "./pages/AppointmentList";  
import CustomerProfile from "./pages/CustomerProfile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Router> {/* Wrap the entire app in Router */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
          
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

export default App;
