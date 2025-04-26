import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import "./Workassign.css";

const WorkAssignTable = () => {
  const [workAssignments, setWorkAssignments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Calculate the minimum allowed month (5 months back from current)
  const calculateMinAllowedMonth = () => {
    const today = new Date();
    const minAllowedDate = new Date();
    minAllowedDate.setMonth(today.getMonth() - 5);
    return {
      month: minAllowedDate.getMonth() + 1,
      year: minAllowedDate.getFullYear()
    };
  };

  const minAllowed = calculateMinAllowedMonth();

  const fetchWorkAssignments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/work");
      setWorkAssignments(response.data);
    } catch (err) {
      console.error("Error fetching work assignments:", err);
    }
  };

  useEffect(() => {
    fetchWorkAssignments();
  }, []);

  const filteredWork = workAssignments.filter((work) => {
    const workDate = new Date(work.estimateDate);
    return workDate.getMonth() + 1 === currentMonth && workDate.getFullYear() === currentYear;
  });

  const workByRole = filteredWork.reduce((acc, work) => {
    if (!acc[work.role]) {
      acc[work.role] = [];
    }
    acc[work.role].push(work);
    return acc;
  }, {});

  const roles = Object.keys(workByRole);

  //search filter
  const filteredBySearch = (work) => {
    if (!searchQuery) return true;
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      work.employeeId.toLowerCase().includes(lowercasedQuery) ||
      work.ename.toLowerCase().includes(lowercasedQuery)
    );
  };

  const handlePreviousMonth = () => {
    // Check if we've reached the minimum allowed month
    if (currentMonth === minAllowed.month && currentYear === minAllowed.year) {
      return;
    }
    
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const today = new Date();
    // Check if we're already at current month
    if (currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear()) {
      return;
    }
    
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Check if previous month button should be disabled
  const isPreviousDisabled = () => {
    return currentMonth === minAllowed.month && currentYear === minAllowed.year;
  };

  // Check if next month button should be disabled
  const isNextDisabled = () => {
    const today = new Date();
    return currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();
  };

  const startEditing = (work) => {
    navigate(`/update-work/${work._id}`, { state: { work } });
  };

  const deleteWorkAssign = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this work assignment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/work/delete/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Work assignment has been deleted.", "success");
            fetchWorkAssignments();
          })
          .catch((err) => {
            Swal.fire("Error!", "Error deleting work assignment.", "error");
          });
      }
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add Company Logo
    const logoUrl = "./image/logo.jpeg"; // Replace with the actual path to your logo
    doc.addImage(logoUrl, "PNG", 15, 10, 40, 20); // Adjust position and size as needed
  
    // Add Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Greenscape (Pvt)Ltd", 60, 15); // Company name
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("No 10 ,New plaza road, Mababe, Sri Lanka", 60, 22); // Address
    doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 28); // Contact details
  
    // Add Report Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Employee Working Hours Report", 15, 50); // Report title
  
    // Add Month and Year
    const monthYear = `${new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} ${currentYear}`;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Month: ${monthYear}`, 15, 60); // Month and year
  
    // Table Headers
    const tableColumn = ["Employee ID", "Name", "NIC", "Type", "Number of days worked", "Weekdays OT Hours", "Weekend OT Hours", "Estimated Date"];
  
    // Filtered Work Data
    const tableRows = workAssignments
      .filter((work) => {
        const workDate = new Date(work.estimateDate);
        return workDate.getMonth() + 1 === currentMonth && workDate.getFullYear() === currentYear;
      })
      .map((work) => [
        work.employeeId,
        work.ename,
        work.nic,
        work.status,
        work.workingDate,
        work.otHours,
        work.leaveHours,
        work.estimateDate ? new Date(work.estimateDate).toLocaleDateString() : "N/A",
      ]);
  
    // Create Table
    autoTable(doc, {
      startY: 70, // Adjusts table position to start below the header and month/year
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { halign: "center", fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }, // Green header
    });
  
    // Calculate total OT and Leave Hours
    const totalOtHours = tableRows.reduce((sum, row) => sum + Number(row[5] || 0), 0);
    const totalLeaveHours = tableRows.reduce((sum, row) => sum + Number(row[6] || 0), 0);
  
    // Summary Section
    doc.setFontSize(12);
    doc.text(`Total Weekdays OT Hours: ${totalOtHours}`, 15, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Weekend OT Hours: ${totalLeaveHours}`, 15, doc.lastAutoTable.finalY + 20);
  
    // Signature Section
    doc.text("__________________________", 140, doc.lastAutoTable.finalY + 40);
    doc.text("Authorized Signature", 155, doc.lastAutoTable.finalY + 50);
  
    // Report Generated Date
    const date = new Date().toLocaleDateString();
    doc.text(`Report Generated: ${date}`, 15, doc.lastAutoTable.finalY + 50);
  
    // Save PDF
    doc.save(`Work_Assignments_${monthYear}.pdf`);
  };


  return (
    <div className="mt-5 table-container">
      <h2 className="page-header">Working Hours Details</h2>
      <button className="btn btn-success mb-4" onClick={() => navigate("/assign-work")}>
       Add Employees Hours
      </button>

      <div className="d-flex justify-content-between mb-3">
        <button 
          className="btn btn-secondary" 
          onClick={handlePreviousMonth}
          disabled={isPreviousDisabled()}
        >
          Previous Month
        </button>
        <h4>
          {new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} {currentYear}
        </h4>
        <button 
          className="btn btn-secondary" 
          onClick={handleNextMonth}
          disabled={isNextDisabled()}
        >
          Next Month
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="search-work"
          placeholder="Search by Employee ID, Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap mb-3">
        {roles.map((role) => (
          <button
            key={role}
            className={`btn mx-2 ${selectedRole === role ? "btn-primary" : "btn-light-green"}`}
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Generate PDF Button */}
      <div className="generate-report-container">
        <button className="btn-generate-report" onClick={generatePDF}>
          <FontAwesomeIcon icon={faFilePdf} /> Generate PDF Report
        </button>
      </div>

      <div className="table-responsive">
  <h3 className="text-center">
    {selectedRole ? `${selectedRole} Working Hours` : "Working Hours"}
  </h3>
  <table className="table table-striped table-bordered mt-4">
    <thead>
      <tr>
        <th>Employee ID</th>
        <th>Employee Name</th>
        <th>NIC</th> {/* New Column for NIC */}
        <th>Employee Type</th> {/* New Column for Employee Type */}
        <th>Number of days worked</th>
        <th>Weekdays OT Hours</th>
        <th>Weekend OT Hours</th>
        <th>Estimated Completion Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {selectedRole
        ? workByRole[selectedRole]?.filter(filteredBySearch).map((work) => (
            <tr key={work._id}>
              <td>{work.employeeId}</td>
              <td>{work.ename}</td>
              <td>{work.nic}</td> {/* Display NIC */}
              <td>{work.status}</td> {/* Display Employee Type */}
              <td>{work.workingDate}</td>
              <td>{work.otHours}</td>
              <td>{work.leaveHours}</td>
              <td>{work.estimateDate ? new Date(work.estimateDate).toLocaleDateString() : "N/A"}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} className="icon icon-edit mx-2" onClick={() => startEditing(work)} />
                <FontAwesomeIcon icon={faTrash} className="icon icon-delete mx-2" onClick={() => deleteWorkAssign(work._id)} />
              </td>
            </tr>
          ))
        : filteredWork.filter(filteredBySearch).map((work) => (
            <tr key={work._id}>
              <td>{work.employeeId}</td>
              <td>{work.ename}</td>
              <td>{work.nic}</td> {/* Display NIC */}
              <td>{work.status}</td> {/* Display Employee Type */}
              <td>{work.workingDate}</td>
              <td>{work.otHours}</td>
              <td>{work.leaveHours}</td>
              <td>{work.estimateDate ? new Date(work.estimateDate).toLocaleDateString() : "N/A"}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} className="icon icon-edit mx-2" onClick={() => startEditing(work)} />
                <FontAwesomeIcon icon={faTrash} className="icon icon-delete mx-2" onClick={() => deleteWorkAssign(work._id)} />
              </td>
            </tr>
          ))}
    </tbody>
  </table>
</div>

      {!selectedRole && <p className="text-center highlight">Select a role to view work Hours.</p>}
    </div>
  );
};

export default WorkAssignTable;
