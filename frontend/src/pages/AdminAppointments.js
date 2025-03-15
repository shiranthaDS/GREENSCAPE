import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    siteVisitDate: "",
    siteAnalysisStatus: "Pending",
    projectStatus: "Not Started",
    projectId: "",
  });

  const [scheduledDates, setScheduledDates] = useState([]);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ Store the clicked date

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);

      // Extract and store scheduled site visit dates
      const dates = data
        .filter((appt) => appt.siteVisitDate)
        .map((appt) => new Date(appt.siteVisitDate));
      setScheduledDates(dates);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      siteVisitDate: appointment.siteVisitDate || "",
      siteAnalysisStatus: appointment.siteAnalysisStatus || "Pending",
      projectStatus: appointment.projectStatus || "Not Started",
      projectId: appointment.projectId || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!selectedAppointment) return;
    try {
      await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}/update-info`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment info:", error);
    }
  };

  // 🔹 Highlight scheduled site visit dates in the calendar
  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      scheduledDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      )
    ) {
      return "highlight-date";
    }
  };

  // 🔹 Handle click on a scheduled date in the calendar
  const handleDateClick = (date) => {
    setSelectedDate(date); // ✅ Save clicked date
    const filteredAppointments = appointments.filter(
      (appt) => new Date(appt.siteVisitDate).toDateString() === date.toDateString()
    );
    setSelectedDateAppointments(filteredAppointments);
    setIsCalendarModalOpen(true);
  };

  return (
    <div className="container">
      <h2>Appointment Details</h2>

      {/* 🔹 Calendar Section */}
      <div className="calendar-container">
        <Calendar onClickDay={handleDateClick} tileClassName={tileClassName} />
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>App ID</th>
            <th>Customer Info</th>
            <th>City</th>
            <th>Service</th>
            <th>Site Visit</th>
            <th>Project</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.appointmentId}</td>
              <td>
                <strong>Name:</strong> {appointment.name} <br />
                <strong>Email:</strong> {appointment.email} <br />
                <strong>Phone:</strong> {appointment.phone} <br />
                <strong>Address:</strong> {appointment.address}
              </td>
              <td>{appointment.city}</td>
              <td>{appointment.serviceType}</td>
              <td>
                <strong>Date:</strong> {appointment.siteVisitDate ? new Date(appointment.siteVisitDate).toLocaleDateString() : "Not Set"} <br />
                <strong>Analysis:</strong> {appointment.siteAnalysisStatus || "Pending"}
              </td>
              <td>
                <strong>Status:</strong> {appointment.projectStatus || "Not Started"} <br />
                <strong>Project ID:</strong> {appointment.projectId || "Not Assigned"}
              </td>
              <td>
                <button onClick={() => handleEditClick(appointment)}>Update Info</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Modal for Updating Appointment Info */}
      {isModalOpen && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Info - {selectedAppointment.appointmentId}</h3>

            <label>
              Site Visit Date:
              <input type="date" name="siteVisitDate" value={formData.siteVisitDate} onChange={handleChange} />
            </label>

            <label>
              Site Analysis Status:
              <select name="siteAnalysisStatus" value={formData.siteAnalysisStatus} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label>
              Project Status:
              <select name="projectStatus" value={formData.projectStatus} onChange={handleChange}>
                <option value="Not Started">Not Started</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Hold">Hold</option>
              </select>
            </label>

            <label>
              Project ID:
              <input type="text" name="projectId" value={formData.projectId} onChange={handleChange} />
            </label>

            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 🔹 Modal for Showing Appointments on Clicked Date */}
      {isCalendarModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Appointments on {selectedDate ? selectedDate.toLocaleDateString() : ""}</h3> {/* ✅ Show Selected Date */}
            {selectedDateAppointments.length > 0 ? (
              <div>
                {selectedDateAppointments.map((appt) => (
                  <div key={appt._id} className="appointment-details">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {appt.name}</p>
                    <p><strong>Email:</strong> {appt.email}</p>
                    <p><strong>Phone:</strong> {appt.phone}</p>
                    <p><strong>Address:</strong> {appt.address}, {appt.city}</p>

                    <h4>Service Details</h4>
                    <p><strong>Service Type:</strong> {appt.serviceType}</p>

                    <hr />
                  </div>
                ))}
              </div>
            ) : (
              <p>No appointments scheduled.</p>
            )}
            <button onClick={() => setIsCalendarModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default AdminAppointments;
