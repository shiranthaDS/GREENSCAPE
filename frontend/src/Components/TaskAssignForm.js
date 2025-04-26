import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Task.css";

let debounceTimeout;

export default function TaskAssignForm() {
  const [employeeId, setID] = useState("");
  const [ename, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [startDate, setDate] = useState("");
  const [progress, setProgress] = useState("");
  const navigate = useNavigate();

  // Validation states
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [projectIdError, setProjectIdError] = useState("");

  // Calculate date range (today to 5 months in future)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 5);
  
  // Format dates for input[type="date"]
  const todayFormatted = today.toISOString().split("T")[0];
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  // Fetch employee details from the backend
  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${id}`);
      const employee = response.data;
      setName(employee.name || "");
      setEmail(employee.email || "");
      setRole(employee.role || "");
    } catch (err) {
      console.error("Error fetching employee details:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Employee not found!",
      });
      setName("");
      setEmail("");
      setRole("");
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
  };

  // Handle changes in the Employee ID input field with validation
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

    // Clear any existing debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout
    debounceTimeout = setTimeout(() => {
      if (id.trim() !== "" && !employeeIdError) {
        fetchEmployeeDetails(id); // Fetch employee details only if the ID is valid
      } else {
        setName("");
        setEmail("");
        setRole("");
      }
    }, 3000); // Wait 3000ms before making the API call
  };

  // Handle changes in the Project ID input field with validation
  const handleProjectIdChange = (e) => {
    const id = e.target.value;
    setProjectId(id);

    // Validate Project ID
    const projectIdPattern = /^PRJ\d+$/; // Must start with "PRJ" followed by numeric digits
    if (!projectIdPattern.test(id)) {
      setProjectIdError("Project ID must start with 'PRJ' followed by numeric digits.");
    } else {
      setProjectIdError(""); // Clear error if valid
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (employeeIdError || projectIdError) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the validation errors before submitting.",
      });
      return;
    }

    const newTask = {
      employeeId,
      ename,
      email,
      role,
      projectId,
      projectLocation,
      startDate,
      progress,
    };

    try {
      await axios.post("http://localhost:5000/api/task/add", newTask);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task assigned successfully!",
      }).then(() => {
        navigate("/task");
      });
    } catch (err) {
      console.error("Error assigning task:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to assign task.",
      });
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/task"); // Navigate back to the task list or previous page
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="row w-100">
        <h2 className="text-center mb-4">Assign Task</h2>
        <form onSubmit={handleSubmit} className="row">
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
                required
              />
              {employeeIdError && <div className="invalid-feedback">{employeeIdError}</div>}
            </div>
            <div className="form-group">
              <label>Employee Name</label>
              <input type="text" className="form-control" name="ename" value={ename} readOnly />
            </div>
            <div className="form-group">
              <label>Employee Email</label>
              <input type="email" className="form-control" name="email" value={email} readOnly />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" className="form-control" name="role" value={role} readOnly />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="form-group">
              <label>Project ID</label>
              <input
                type="text"
                className={`form-control ${projectIdError ? "is-invalid" : ""}`}
                name="projectId"
                value={projectId}
                onChange={handleProjectIdChange}
                required
              />
              {projectIdError && <div className="invalid-feedback">{projectIdError}</div>}
            </div>
            <div className="form-group">
              <label>Project Location</label>
              <input
                type="text"
                className="form-control"
                name="projectLocation"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={startDate}
                onChange={handleDateChange}
                min={todayFormatted}
                max={maxDateFormatted}
                required
              />
            </div>

            <div className="form-group">
              <label>Progress</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="progress"
                    value="Completed"
                    checked={progress === "Completed"}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                  Completed
                </label>
                <label className="ml-3">
                  <input
                    type="radio"
                    name="progress"
                    value="In Progress"
                    checked={progress === "In Progress"}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                  In Progress
                </label>
                <label className="ml-3">
                  <input
                    type="radio"
                    name="progress"
                    value="On Hold"
                    checked={progress === "On Hold"}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                  On Hold
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-between">
            <button type="submit" className="btn btn-primary mt-3">Assign Task</button>
            <button type="button" className="btn btn-secondary mt-3" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}