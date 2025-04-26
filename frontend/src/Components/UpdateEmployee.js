import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const UpdateEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const navigate = useNavigate();
  const location = useLocation(); // Get the employee data passed from AllEmployee.js

  // State variables for employee fields
  const [name, setName] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [emid, setEmid] = useState("");

  // Fetch employee data on component mount
  useEffect(() => {
    if (location.state && location.state.employee) {
      const emp = location.state.employee;

      // Set state with employee data
      setName(emp.name);
      setNic(emp.nic);
      setDob(emp.dob ? new Date(emp.dob).toISOString().split("T")[0] : ""); // Format DOB to YYYY-MM-DD
      setEmail(emp.email);
      setAddress(emp.address);
      setGender(emp.gender);
      setPhone(emp.phone);
      setStatus(emp.status);
      setRole(emp.role);
      setEmid(emp.emid);
    } else {
      // If no data is passed, fetch it from the backend
      axios
        .get(`http://localhost:5000/api/employee/get/${id}`)
        .then((response) => {
          const emp = response.data.employee;

          // Set state with employee data
          setName(emp.name);
          setNic(emp.nic);
          setDob(emp.dob ? new Date(emp.dob).toISOString().split("T")[0] : ""); // Format DOB to YYYY-MM-DD
          setEmail(emp.email);
          setAddress(emp.address);
          setGender(emp.gender);
          setPhone(emp.phone);
          setStatus(emp.status);
          setRole(emp.role);
          setEmid(emp.emid);
        })
        .catch((err) => {
          console.error("Error fetching employee data: ", err);
        });
    }
  }, [id, location.state]);

  // Handle form submission
  const updateData = (e) => {
    e.preventDefault();

    // Create an updated employee object
    const updatedEmployee = {
      name,
      nic,
      dob,
      email,
      address,
      gender,
      phone,
      status,
      role,
      emid,
    };

    // Send PUT request to update the employee
    axios
      .put(`http://localhost:5000/api/employee/update/${id}`, updatedEmployee)
      .then(() => {
        alert("Employee updated successfully");
        navigate("/all-employees"); // Navigate back to the employee list
      })
      .catch((err) => {
        alert("Error updating employee");
        console.error(err);
      });
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Update Employee</h2>
      <form onSubmit={updateData}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>NIC</label>
          <input
            type="text"
            className="form-control"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <input
            type="text"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            className="form-control"
            value={emid}
            onChange={(e) => setEmid(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployee;