import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./work.css";

let debounceTimeout;

export default function WorkAssignForm() {
  const [employeeId, setID] = useState("");
  const [ename, setName] = useState("");
  const [role, setRole] = useState("");
  const [workingDate, setWorkingDate] = useState("");
  const [otHours, setOTHours] = useState("");
  const [leaveHours, setLeaveHours] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState(""); // Validation error state for Employee ID
  const navigate = useNavigate();

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/employee/${id}`);
      const employee = response.data;
      setName(employee.name);
      setRole(employee.role);
    } catch (err) {
      console.error("Error fetching employee details:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Employee not found!",
      });
      setName("");
      setRole("");
    }
  };

  const handleEmployeeIdChange = (e) => {
    const id = e.target.value;
    setID(id);

    // Validate Employee ID
    const employeeIdPattern = /^LE\d+$/; // Must start with "LE" followed by numeric digits
    if (!employeeIdPattern.test(id)) {
      setEmployeeIdError("Employee ID must start with 'LE' followed by numeric digits.");
    } else {
      setEmployeeIdError(""); // Clear error if valid
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      if (id.trim() !== "" && !employeeIdError) {
        fetchEmployeeDetails(id);
      } else {
        setName("");
        setRole("");
      }
    }, 2000);
  };

  const handleEmployeeIdKeyPress = (e) => {
    if (e.key === "Enter" && employeeId.trim() !== "" && !employeeIdError) {
      fetchEmployeeDetails(employeeId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (employeeIdError) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the validation errors before submitting.",
      });
      return;
    }

    const newWork = {
      employeeId,
      ename,
      role,
      workingDate,
      otHours,
      leaveHours,
      estimateDate,
    };

    try {
      await axios.post("http://localhost:5000/work/add", newWork);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Work Hours assigned successfully!",
      }).then(() => {
        navigate("/work");
      });
    } catch (err) {
      console.error("Error assigning work hours:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to assign work Hours.",
      });
    }
  };

  return (
    <div className="work-assign-container mt-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="work-assign-header">Working Hours</h2>
      </div>

      {/* Form */}
      <form className="work-assign-form row" onSubmit={handleSubmit}>
        {/* Left Column */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              className={`form-control ${employeeIdError ? "is-invalid" : ""}`}
              name="employeeId"
              value={employeeId}
              onChange={handleEmployeeIdChange}
              onKeyPress={handleEmployeeIdKeyPress}
              required
            />
            {employeeIdError && <div className="invalid-feedback">{employeeIdError}</div>}
          </div>
          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              className="form-control"
              name="ename"
              value={ename}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Employee Role</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={role}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Number of days worked</label>
            <input
              type="text"
              className="form-control"
              name="workingDate"
              value={workingDate}
              onChange={(e) => setWorkingDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-6">
          <div className="form-group">
            <label>OT Hours</label>
            <input
              type="text"
              className="form-control"
              name="otHours"
              value={otHours}
              onChange={(e) => setOTHours(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Leave Hours</label>
            <input
              type="text"
              className="form-control"
              name="leaveHours"
              value={leaveHours}
              onChange={(e) => setLeaveHours(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Estimate Date</label>
            <input
              type="date"
              className="form-control"
              name="estimateDate"
              value={estimateDate}
              onChange={(e) => setEstimateDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary mt-3">
            Add Working Hours
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3 ml-3"
            onClick={() => navigate("/work")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}