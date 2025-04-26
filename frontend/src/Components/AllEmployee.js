import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import "./Sidebar.css";
import "./AllEmployee.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:5000/api/employee")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((err) => {
        console.error("Error fetching employees: ", err);
      });
  };

  const startEditing = (emp) => {
    navigate("/add", { state: { employee: emp } });
  };

  const deleteEmployee = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Why do you want to delete this employee?",
      icon: "warning",
      input: "select",
      inputOptions: {
        "Employee Resigning": "Employee Resigning",
        Other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("You need to select a reason");
        }
        return reason;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/employee/delete/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Employee has been deleted.", "success");
            fetchEmployees();
          })
          .catch((err) => {
            Swal.fire("Error!", "Error deleting employee.", "error");
          });
      }
    });
  };

  //search filter
  const filteredEmployees = employees.filter((emp) =>
    Object.values(emp).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ✅ Generate Employee Report PDF with Company Logo, Header, and Footer
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // For wider tables
      unit: "mm",
      format: "a4", // Larger size
    });
  
    // Add Company Logo (Change "logo.jpeg" to your actual logo)
    const logoUrl = "./image/logo.jpeg";
    doc.addImage(logoUrl, "PNG", 15, 10, 40, 20); // Adjust position and size as needed
  
    // Add Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Greenscape (Pvt)Ltd", 60, 15); // Adjust position as needed
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("No 10 ,New plaza road, Mababe, Sri Lanka", 60, 22);
    doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 28);
  
    // Report Title
    doc.setFontSize(20);
    doc.text("All Employee Details", 110, 40); // Adjust position for the title
  
    // Employee Table
    autoTable(doc, {
      startY: 50, // Adjusts table position to start below the header
      head: [["Name", "NIC", "Date of birth", "Email", "Address", "Gender", "Phone", "Type", "Role", "Employee ID"]],
      headStyles: { fillColor: [0, 128, 0], textColor: 255, fontSize: 12 }, // Green Header
      body: employees.map((emp) => [
        emp.name,
        emp.nic,
        emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A", // Format DOB to exclude time
        emp.email,
        emp.address,
        emp.gender,
        emp.phone,
        emp.status,
        emp.role,
        emp.emid,
      ]),
      styles: { fontSize: 10 }, // Increase text size
    });
  
    // Report Generated Date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Report Generated: ${date}`, 15, doc.lastAutoTable.finalY + 15);
  
    // Signature Line
    doc.line(240, doc.lastAutoTable.finalY + 20, 340, doc.lastAutoTable.finalY + 20); // Signature Line
  doc.text("Authorized Signature", 250, doc.lastAutoTable.finalY + 30);

    // Save PDF
    doc.save("Employee_Report.pdf");
  };

  return (
    <div className="mt-5 table-container">
      <h2 className="page-header">Employee Details</h2>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search employees..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      {/* 📂 Buttons: Register & Download PDF */}
      <div className="button-container">
        <button className="btn-register" onClick={() => navigate("/add")}>
          Register New Employee
        </button>
        <button className="btn-pdf" onClick={generatePDF}>
          <FontAwesomeIcon icon={faFilePdf} /> Download Report
        </button>
      </div>

      {/* 📊 Table */}
      <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
        <table className="table table-striped table-bordered mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Role</th>
              <th>Employee ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.nic}</td>
                <td>{new Date(emp.dob).toLocaleDateString()}</td> 
                <td>{emp.email}</td>
                <td>{emp.address}</td>
                <td>{emp.gender}</td>
                <td>{emp.phone}</td>
                <td>{emp.status}</td>
                <td>{emp.role}</td>
                <td>{emp.emid}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon icon-edit"
                    onClick={() => startEditing(emp)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon icon-delete"
                    onClick={() => deleteEmployee(emp._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📌 Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AllEmployee;
