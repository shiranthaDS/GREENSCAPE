import React from "react";
import AppointmentForm from "./pages/AppointmentForm";
import AdminAppointments from "./pages/AdminAppointments";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AppointmentForm/>
      <AdminAppointments /> 
    </div>
  );
}

export default App;
