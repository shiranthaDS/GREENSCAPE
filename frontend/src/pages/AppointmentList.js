import { useEffect, useState } from "react";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);

      // Group by service type
      const grouped = data.reduce((acc, appt) => {
        if (!acc[appt.serviceType]) {
          acc[appt.serviceType] = [];
        }
        acc[appt.serviceType].push(appt);
        return acc;
      }, {});
      setGroupedAppointments(grouped);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Handle project selection to show customer info
  const handleProjectSelection = (projectId) => {
    setSelectedProjectId(projectId);
    const customer = appointments.find((appt) => appt.projectId === projectId);
    setSelectedCustomer(customer || null);
  };

  return (
    <div className="container">
      <h2>project List of task assesment </h2>

      {/* 🔹 Table grouped by Service Type */}
      <table border="1">
        <thead>
          <tr>
            <th>Service</th>
            <th>Project IDs</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedAppointments).map(([service, appts]) => (
            <tr key={service}>
              <td>{service}</td>
              <td>
                <ul>
                  {appts
                    .filter((appt) => appt.projectId)
                    .map((appt) => (
                      <li key={appt.projectId}>{appt.projectId}</li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Select Project ID to view Customer Info */}
      <div className="selection-container">
        <h3>Select Project ID</h3>
        <select onChange={(e) => handleProjectSelection(e.target.value)} value={selectedProjectId}>
          <option value="">-- Select Project ID --</option>
          {appointments
            .filter((appt) => appt.projectId)
            .map((appt) => (
              <option key={appt.projectId} value={appt.projectId}>
                {appt.projectId}
              </option>
            ))}
        </select>
      </div>

      {/* 🔹 Display Customer Info */}
      {selectedCustomer && (
        <div className="customer-info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          <p><strong>Email:</strong> {selectedCustomer.email}</p>
          <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
          <p><strong>Address:</strong> {selectedCustomer.address}, {selectedCustomer.city}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
