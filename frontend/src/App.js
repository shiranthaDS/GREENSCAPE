import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppointmentForm from "./pages/AppointmentForm";
import AdminAppointments from "./pages/AdminAppointments";
import CostEstimator from "./pages/cost";
import AppointmentList from "./pages/AppointmentList";
import CustomerProfile from "./pages/CustomerProfile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ServiceList from "./pages/ServiceList";
import AdminServiceForm from "./pages/AdminServiceForm";
import AdminLayout from "./pages/AdminLayout";  // ✅ Import AdminLayout
import AdminAppointmentsCalendar from "./pages/AdminAppointmentsCalendar";  // ✅ Import AdminAppointmentsCalendar
import ServicesDemandAnalysis from "./pages/ServicesDemandAnalysis";
function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Wrap Admin Pages inside AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="table" element={<AdminAppointments />} />
          <Route path="manage-services" element={<AdminServiceForm />} />
          <Route path="project" element={<AppointmentList />} />
          <Route path="calendar" element={<AdminAppointmentsCalendar />} />
          <Route path="analysis" element={<ServicesDemandAnalysis />} />
        </Route>

        {/* ✅ Public Routes */}
      
       
        <Route path="cost-estimator" element={<CostEstimator />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment-form" element={<AppointmentForm />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
