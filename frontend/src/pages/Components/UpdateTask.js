import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [employeeId, setEmployeeId] = useState("");
  const [ename, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [startDate, setDate] = useState("");
  const [progress, setProgress] = useState("");

  useEffect(() => {
    if (location.state?.task) {
      const { employeeId, ename, email, role, projectId, projectLocation, startDate, progress } = location.state.task;
      setEmployeeId(employeeId);
      setName(ename);
      setEmail(email);
      setRole(role);
      setProjectId(projectId);
      setProjectLocation(projectLocation);
      setDate(startDate.split('T')[0]);
      setProgress(progress);
    } else {
      axios.get(`http://localhost:5000/task/get/${id}`)
        .then(response => {
          const task = response.data.task;
          setEmployeeId(task.employeeId);
          setName(task.ename);
          setEmail(task.email);
          setRole(task.role);
          setProjectId(task.projectId);
          setProjectLocation(task.projectLocation);
          setDate(task.startDate.split('T')[0]);
          setProgress(task.progress);
        })
        .catch(err => console.error("Error fetching task data:", err));
    }
  }, [id, location.state]);
  

  const updateData = (e) => {
    e.preventDefault();

    const updatedTask = { employeeId, ename, email, role, projectId, projectLocation, startDate, progress };

    // Show confirmation popup
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the update
        axios
          .put(`http://localhost:5000/task/update/${id}`, updatedTask)
          .then(() => {
            Swal.fire('Updated!', 'The task has been updated successfully.', 'success').then(() => {
              navigate("/task"); // Redirect to the task list page
            });
          })
          .catch((err) => {
            Swal.fire('Error!', 'Failed to update the task.', 'error');
            console.error(err);
          });
      }
    });
  };

  return (
    <div className="container">
      <form onSubmit={updateData}>
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            className="form-control"
            value={employeeId}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            className="form-control"
            value={ename}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            readOnly
          />
          </div>
          <div className="form-group">
          <label>Employee Role</label>
          <input
            type="text"
            className="form-control"
            value={role}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Project ID</label>
          <input
            type="text"
            className="form-control"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Project Location</label>
          <input
            type="text"
            className="form-control"
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
            value={startDate}
            onChange={(e) => setDate(e.target.value)}
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
        <button type="submit" className="btn btn-primary mt-3">
          Update Task
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-3 ml-3"
          onClick={() => navigate("/task")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;