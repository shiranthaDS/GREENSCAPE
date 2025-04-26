import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UpdateWork.css'; // Import the CSS file

const UpdateWork = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [employeeId, setEmployeeId] = useState("");
  const [ename, setName] = useState("");
  const [role, setRole] = useState("");
  const [workingDate, setWorkingDate] = useState("");
  const [otHours, setOtHours] = useState("");
  const [leaveHours, setLeaveHours] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [nic, setNic] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("");

  useEffect(() => {
    if (location.state?.work) {
      const { employeeId, ename, role, workingDate, otHours, leaveHours, estimateDate, nic, status } = location.state.work;
      setEmployeeId(employeeId);
      setName(ename);
      setRole(role);
      setWorkingDate(workingDate);
      setOtHours(otHours);
      setLeaveHours(leaveHours);
      setEstimateDate(estimateDate.split('T')[0]);
      setNic(nic);
      setEmployeeStatus(status);
    } else {
      axios.get(`http://localhost:5000/api/work/get/${id}`)
        .then(response => {
          const work = response.data.work;
          setEmployeeId(work.employeeId);
          setName(work.ename);
          setRole(work.role);
          setWorkingDate(work.workingDate);
          setOtHours(work.otHours);
          setLeaveHours(work.leaveHours);
          setEstimateDate(work.estimateDate.split('T')[0]);
          setNic(work.nic);
          setEmployeeStatus(work.status);
        })
        .catch(err => console.error("Error fetching work data:", err));
    }
  }, [id, location.state]);

  const updateData = (e) => {
    e.preventDefault();
    const updatedWork = { employeeId, ename, role, workingDate, otHours, leaveHours, estimateDate };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this work record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/api/work/update/${id}`, updatedWork)
          .then(() => {
            Swal.fire('Updated!', 'The work record has been updated successfully.', 'success').then(() => {
              navigate("/work");
            });
          })
          .catch((err) => {
            Swal.fire('Error!', 'Failed to update the work record.', 'error');
            console.error(err);
          });
      }
    });
  };

  return (
    <div className="update-work-container">
      <h2 className="form-header">Update Work Record</h2>
      <form className="update-work-form" onSubmit={updateData}>
        <div className="form-group">
          <label>Employee ID</label>
          <input type="text" className="form-control" value={employeeId} readOnly />
        </div>
        <div className="form-group">
          <label>Employee Name</label>
          <input type="text" className="form-control" value={ename} readOnly />
        </div>
        <div className="form-group">
          <label>NIC</label>
          <input type="text" className="form-control" value={nic} readOnly />
        </div>
        <div className="form-group">
          <label>Employee Type</label>
          <input type="text" className="form-control" value={employeeStatus} readOnly />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input type="text" className="form-control" value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Working Date</label>
          <input type="number" className="form-control" value={workingDate} onChange={(e) => setWorkingDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Weekdays OT Hours</label>
          <input type="number" className="form-control" value={otHours} onChange={(e) => setOtHours(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Weekend OT Hours</label>
          <input type="number" className="form-control" value={leaveHours} onChange={(e) => setLeaveHours(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Estimate Date</label>
          <input
            type="date"
            className="form-control"
            value={estimateDate}
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setEstimateDate(e.target.value)}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">Update Work</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/work")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateWork;