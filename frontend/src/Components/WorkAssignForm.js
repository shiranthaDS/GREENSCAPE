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
  const [nic, setNIC] = useState("");
  const [status, setStatus] = useState("");
  const [workingDate, setWorkingDate] = useState("");
  const [otHours, setOTHours] = useState("");
  const [leaveHours, setLeaveHours] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const navigate = useNavigate();

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${id}`);
      const employee = response.data;
      setName(employee.name);
      setRole(employee.role);
      setNIC(employee.nic);
      setStatus(employee.status);
    } catch (err) {
      console.error("Error fetching employee details:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Employee not found!",
      });
      setName("");
      setRole("");
      setNIC("");
      setStatus("");
    }
  };

  const handleEmployeeIdChange = (e) => {
    const id = e.target.value;
    setID(id);

    const employeeIdPattern = /^LE\d+$/;
    if (!employeeIdPattern.test(id)) {
      setEmployeeIdError("Employee ID must start with 'LE' followed by numeric digits.");
    } else {
      setEmployeeIdError("");
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
        setNIC("");
        setStatus("");
      }
    }, 2000);
  };

  const handleEmployeeIdKeyPress = (e) => {
    if (e.key === "Enter" && employeeId.trim() !== "" && !employeeIdError) {
      fetchEmployeeDetails(employeeId);
    }
  };

  const validateNumberRange = (value, min, max) => {
    if (!/^\d+$/.test(value)) return false; // Ensure only numbers
    const num = parseInt(value, 10);
    return num >= min && num <= max;
  };

  const handleWorkingDaysChange = (e) => {
    const value = e.target.value;
    if (validateNumberRange(value, 0, 31) || value === "") {
      setWorkingDate(value);
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Working days must be between 0 and 31.",
      });
    }
  };

  const handleOTHoursChange = (e) => {
    const value = e.target.value;
    if (validateNumberRange(value, 0, 20) || value === "") {
      setOTHours(value);
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "OT Hours must be between 0 and 20.",
      });
    }
  };

  const handleLeaveHoursChange = (e) => {
    const value = e.target.value;
    if (validateNumberRange(value, 0, 20) || value === "") {
      setLeaveHours(value);
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Leave Hours must be between 0 and 20.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      nic,
      status,
      workingDate,
      otHours,
      leaveHours,
      estimateDate,
    };

    try {
      await axios.post("http://localhost:5000/api/work/add", newWork);
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
      <div className="text-center mb-4">
        <h2 className="work-assign-header">Working Hours</h2>
      </div>

      <form className="work-assign-form row" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              className={`form-control ${employeeIdError ? "is-invalid" : ""}`}
              value={employeeId}
              onChange={handleEmployeeIdChange}
              onKeyPress={handleEmployeeIdKeyPress}
              required
            />
            {employeeIdError && <div className="invalid-feedback">{employeeIdError}</div>}
          </div>
          <div className="form-group">
            <label>Employee Name</label>
            <input type="text" className="form-control" value={ename} readOnly />
          </div>
          <div className="form-group">
            <label>Employee Role</label>
            <input type="text" className="form-control" value={role} readOnly />
          </div>
          <div className="form-group">
            <label>NIC</label>
            <input type="text" className="form-control" value={nic} readOnly />
          </div>
          <div className="form-group">
            <label>Employee Type</label>
            <input type="text" className="form-control" value={status} readOnly />
          </div>
          <div className="form-group">
            <label>Number of Days Worked</label>
            <input type="text" className="form-control" value={workingDate} onChange={handleWorkingDaysChange} required />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label>Weekdays OT Hours</label>
            <input type="text" className="form-control" value={otHours} onChange={handleOTHoursChange} required />
          </div>
          <div className="form-group">
            <label>Weekend Hours</label>
            <input type="text" className="form-control" value={leaveHours} onChange={handleLeaveHoursChange} required />
          </div>
          <div className="form-group">
            <label>Estimate Date</label>
            <input
               type="date"
               className="form-control"
               value={estimateDate}
               min={new Date(new Date().getFullYear(), new Date().getMonth(), 1)
               .toISOString()
               .split("T")[0]}
               max={new Date().toISOString().split("T")[0]}
               onChange={(e) => setEstimateDate(e.target.value)}
               required
              />

          </div>
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary mt-3">
            Add Working Hours
          </button>
          <button type="button" className="btn btn-secondary mt-3 ml-3" onClick={() => navigate("/work")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
