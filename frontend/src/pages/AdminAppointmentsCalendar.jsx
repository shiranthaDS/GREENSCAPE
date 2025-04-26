import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const AdminAppointmentsCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [scheduledDates, setScheduledDates] = useState([]);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);

      const dates = data
        .filter((appt) => appt.siteVisitDate)
        .map((appt) => new Date(appt.siteVisitDate));
      setScheduledDates(dates);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const filteredAppointments = appointments.filter(
      (appt) => new Date(appt.siteVisitDate).toDateString() === date.toDateString()
    );
    setSelectedDateAppointments(filteredAppointments);
    setIsCalendarModalOpen(true);
  };

  return (
    <div className="1container">
      <h2>Scheduled Appointments Calendar</h2>
      
      <button onClick={() => navigate("/admin/table")}>View Appointments</button>

      <div className="calendar-container">
        <Calendar onClickDay={handleDateClick} tileClassName={tileClassName} />
      </div>

      {isCalendarModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Appointments on {selectedDate ? selectedDate.toLocaleDateString() : ""}</h3>
            {selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map((appt) => (
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
              ))
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

export default AdminAppointmentsCalendar;
