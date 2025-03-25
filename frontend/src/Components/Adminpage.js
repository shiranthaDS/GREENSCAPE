import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./admincss.css"; // Include the CSS file

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobApplications");
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/jobApplications/updateStatus/${id}`, { status });
      alert(`Application status updated to ${status}`);
      // Refresh the list
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/jobApplications/delete/${id}`);
      alert("Application deleted.");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Job Applications Report", 20, 10);

    const tableData = applications.map((app) => [
      app.name,
      app.email,
      app.tel,
      app.address,
      app.job,
      app.nic,
      app.status,
    ]);

    doc.autoTable({
      head: [["Name", "Email", "Telephone", "Address", "Job", "NIC", "Status"]],
      body: tableData,
    });

    doc.save("JobApplicationsReport.pdf");
  };

  const filteredApplications = applications.filter((application) =>
    application.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h1>Job Applications</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by NIC"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={generatePDF} className="generate-button">
          Generate PDF Report
        </button>
      </div>
      <table className="applications-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>Address</th>
            <th>Job</th>
            <th>NIC</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((application) => (
            <tr key={application._id}>
              <td>{application.name}</td>
              <td>{application.email}</td>
              <td>{application.tel}</td>
              <td>{application.address}</td>
              <td>{application.job}</td>
              <td>{application.nic}</td>
              <td>{application.status}</td>
              <td>
                {application.resume && (
                  <a
                    href={`http://localhost:5000/uploads/${application.resume}`}
                    download
                  >
                    Download
                  </a>
                )}
              </td>
              <td>
                <button
                  className="action-button approve"
                  onClick={() => handleUpdateStatus(application._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="action-button reject"
                  onClick={() => handleUpdateStatus(application._id, "Rejected")}
                >
                  Reject
                </button>
                <button
                  className="action-button delete"
                  onClick={() => handleDelete(application._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
