import { useEffect, useState } from "react";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Appointment Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-lg">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-2 px-4 border">Appointment ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">City</th>
              <th className="py-2 px-4 border">Service Type</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="text-center border-b hover:bg-gray-100">
                <td>{appointment.appointmentId}</td>
                <td>{appointment.name}</td>
                <td>{appointment.email}</td>
                <td>{appointment.phone}</td>
                <td>{appointment.address}</td>  
                <td>{appointment.city}</td>
                <td>{appointment.serviceType}</td>
                <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;
