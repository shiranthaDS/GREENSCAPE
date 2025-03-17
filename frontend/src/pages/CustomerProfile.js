import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const CustomerProfile = () => {
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate hook

  // Fetch email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      handleFetchAppointments(storedEmail); // Fetch appointments on load
    } else {
      // If email is not found in localStorage, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleFetchAppointments = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/customer?email=${email}`);
      const data = await response.json();

      if (data.length > 0) {
        setAppointments(data);
        setError("");
      } else {
        setAppointments([]);
        setError("No appointments found for this email.");
      }
    } catch (error) {
      console.error("Error fetching customer appointments:", error);
      setError("Error fetching appointments.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login"); // Redirect to login page after logout
  };

  // Extract customer details from the first appointment (if available)
  const customerInfo = appointments.length > 0 ? appointments[0] : null;

  return (
    <div className="container">
      <h2>Customer Profile</h2>

      {/* Display Customer Info at the Top */}
      {customerInfo && (
        <div className="customer-info">
          <p><strong>Name:</strong> {customerInfo.name || "Not Available"}</p>
          <p><strong>Email:</strong> {customerInfo.email || "Not Available"}</p>
          <p><strong>Phone:</strong> {customerInfo.phone || "Not Available"}</p>
          <p><strong>Address:</strong> {customerInfo.address || "Not Available"}</p>
          <p><strong>First Appointment Date:</strong> {customerInfo.createdAt ? new Date(customerInfo.createdAt).toLocaleDateString() : "Not Set"}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {/* Appointments Table */}
      {appointments.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Service</th>
              <th>Site Visit</th>
              <th>Project Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.appointmentId}</td>
                <td>{appointment.serviceType}</td>
                <td>{appointment.siteVisitDate ? new Date(appointment.siteVisitDate).toLocaleDateString() : "Not Set"}</td>
                <td>{appointment.projectStatus || "Not Started"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Logout Button */}
      <div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default CustomerProfile;
