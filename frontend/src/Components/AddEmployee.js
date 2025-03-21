import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./Sidebar.css"; // Ensure this path is correct
import "./AddEmployee.css"; // Ensure this path is correct

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [nic, setNIC] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(""); // Gender state
  const [phone, setPhone] = useState("+94"); // Default prefix for Sri Lankan phone numbers
  const [status, setStatus] = useState(""); // Status state
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.employee) {
      const emp = location.state.employee;
      console.log("Employee data:", emp); // Debugging: Log the employee data
      setName(emp.name);
      setNIC(emp.nic);
      setEmail(emp.email);
      setAddress(emp.address);
      setGender(emp.gender);
      setPhone(emp.phone);
      setStatus(emp.status || ""); // Ensure status is set, or default to an empty string
      setRole(emp.role);
      setIsUpdate(true);
      setEmployeeId(emp._id);
    }
  }, [location.state]);

  const validateField = (field, value) => {
    const nicPattern = /^(\d{12}|\d{9}[Vv])$/; // 12 digits or 9 digits followed by 'V'
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    const phonePattern = /^\+94\d{9}$/; // Sri Lankan phone number format

    switch (field) {
      case "nic":
        return nicPattern.test(value) ? "" : "NIC must be 12 digits or 9 digits followed by 'V'";
      case "email":
        return emailPattern.test(value) ? "" : "Email must have @ and a valid domain";
      case "phone":
        return phonePattern.test(value) ? "" : "Phone number must start with +94 and have 9 digits";
      default:
        return "";
    }
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "nic":
        setNIC(value);
        setErrors((prevErrors) => ({ ...prevErrors, nic: validateField("nic", value) }));
        break;
      case "email":
        setEmail(value);
        setErrors((prevErrors) => ({ ...prevErrors, email: validateField("email", value) }));
        break;
      case "phone":
        setPhone(value);
        setErrors((prevErrors) => ({ ...prevErrors, phone: validateField("phone", value) }));
        break;
      default:
        break;
    }
  };

  const validate = () => {
    const errors = {};
    errors.nic = validateField("nic", nic);
    errors.email = validateField("email", email);
    errors.phone = validateField("phone", phone);

    setErrors(errors);
    return Object.keys(errors).every((key) => !errors[key]);
  };

  const sendData = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const newEmployee = {
      name,
      nic,
      email,
      address,
      gender,
      phone,
      status,
      role,
    };

    if (isUpdate) {
      axios
        .put(`http://localhost:5000/employee/update/${employeeId}`, newEmployee)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee updated successfully",
          }).then(() => {
            navigate("/all"); // Navigate back to the all employees page
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error updating employee",
          });
        });
    } else {
      axios
        .post("http://localhost:5000/employee/add", newEmployee)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee registered successfully",
          }).then(() => {
            navigate("/all"); // Navigate back to the all employees page
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error registering employee",
          });
        });
    }
  };

  const handleCancel = () => {
    navigate("/all"); // Navigate back to the all employees page
  };

  return (
    <div className="container form-container">
      <h2 className="page-header">{isUpdate ? "UPDATE EMPLOYEE DETAILS" : "REGISTER NEW EMPLOYEE"}</h2>
      <form onSubmit={sendData} className="form-content">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nic">NIC</label>
          <input
            type="text"
            className="form-control"
            id="nic"
            placeholder="NIC"
            value={nic}
            onChange={(e) => handleInputChange("nic", e.target.value)}
          />
          {errors.nic && <div className="text-danger">{errors.nic}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            className="form-control"
            id="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              Male
            </label>
            <label className="ml-3">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              Female
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
        </div>

        <div className="form-group">
  <label htmlFor="status">Type</label>
  <select
    className="form-control"
    id="status"
    value={status}
    onChange={(e) => setStatus(e.target.value)}
  >
    <option value="">Select Type</option>
    <option value="Permanent">Permanent</option>
    <option value="Temporary">Temporary</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="role">Role</label>
  <select
    className="form-control"
    id="role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="">Select Type</option>
    <option value="Landscape Architect">Landscape Architect</option>
    <option value="Landscaper">Landscaper</option>
    <option value="Garden Designer">Garden Designer </option>
    <option value="Project Estimator ">Project Estimator</option>
    <option value="Gardener">Gardener</option>
    <option value="Project Manager">Project Manager </option>
  </select>
</div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" className="btn btn-secondary ml-3" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}