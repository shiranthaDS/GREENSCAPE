import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct way to import
import Swal from "sweetalert2"; // Import SweetAlert2
import "./admincss.css"; // Include the CSS file

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

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
      Swal.fire(`Application status updated to ${status}`, "", "success");
      // Refresh the list
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error updating status", "", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/jobApplications/delete/${id}`);
      Swal.fire("Application deleted.", "", "success");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
      Swal.fire("Error deleting application", "", "error");
    }
  };

  const confirmAction = (id, action, status) => {
    Swal.fire({
      title: `Are you sure you want to ${action}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        if (action === "delete") {
          handleDelete(id);
        } else {
          handleUpdateStatus(id, status);
        }
      }
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
  
    const currentDate = new Date().toLocaleDateString();
  
    const logoUrl = "./image/logo.jpeg";
    const img = new Image();
    img.src = logoUrl;
  
    img.onload = () => {
      doc.addImage(img, "JPEG", 10, 10, 40, 20);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text("Greenscape (Pvt)Ltd", 55, 15);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("No 10, New plaza road, Mababe, Sri Lanka", 55, 22);
      doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 55, 28);
  
      doc.setLineWidth(0.5);
      doc.line(10, 35, 287, 35);
  
      const tableData = applications.map((app) => [
        app.name,
        app.email,
        app.tel,
        app.address,
        app.job,
        app.nic,
        app.status,
      ]);
  
      autoTable(doc, {
        startY: 40,
        head: [["Name", "Email", "Telephone", "Address", "Job", "NIC", "Status"]],
        body: tableData,
        tableWidth: "auto",
        margin: { left: 10, right: 10 },
        headStyles: {
          fillColor: [46, 139, 87],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
      });
  
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(10);
      doc.text(`Date: ${currentDate}`, 14, finalY);
      doc.text("Signature: _______________________", 220, finalY);
  
      doc.save("JobApplicationsReport.pdf");
    };
  };
  
  // Filter applications based on the search term
  const filteredApplications = applications.filter((application) =>
    application.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredApplications.slice(indexOfFirstRow, indexOfLastRow);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredApplications.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          {currentRows.map((application) => (
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
                  onClick={() => confirmAction(application._id, "approve", "Approved")}
                >
                  Approve
                </button>
                <button
                  className="action-button reject"
                  onClick={() => confirmAction(application._id, "reject", "Rejected")}
                >
                  Reject
                </button>
                <button
                  className="action-button delete"
                  onClick={() => confirmAction(application._id, "delete")}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredApplications.length / rowsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(filteredApplications.length / rowsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPage;