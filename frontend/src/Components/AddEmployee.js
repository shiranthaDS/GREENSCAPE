import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./Sidebar.css";
import "./AddEmployee.css";

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [nic, setNIC] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("+94");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.employee) {
      const emp = location.state.employee;
      console.log("Employee data:", emp);
      setName(emp.name);
      setNIC(emp.nic);
      setDob(emp.dob ? new Date(emp.dob).toISOString().split("T")[0] : "");
      setEmail(emp.email);
      setAddress(emp.address);
      setGender(emp.gender);
      setPhone(emp.phone);
      setStatus(emp.status || "");
      setRole(emp.role);
      setIsUpdate(true);
      setEmployeeId(emp._id);
    }
  }, [location.state]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z. ]*$/.test(value)) {
      setName(value);
      setErrors((prevErrors) => ({ ...prevErrors, name: validateField("name", value) }));
    }
  };

  const handleNICChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase for consistency
    const currentLength = value.length;
    
    // Allow only digits and V (uppercase)
    if (/^[0-9V]*$/.test(value)) {
      // Case 1: New NIC (12 digits)
      if (currentLength <= 12 && /^[0-9]*$/.test(value)) {
        setNIC(value);
        setErrors((prevErrors) => ({ ...prevErrors, nic: validateField("nic", value) }));
      }
      // Case 2: Old NIC (9 digits + V)
      else if (
        (currentLength <= 9 && /^[0-9]*$/.test(value)) || // First 9 digits
        (currentLength === 10 && /^[0-9]{9}V$/.test(value)) // Complete old NIC format
      ) {
        setNIC(value);
        setErrors((prevErrors) => ({ ...prevErrors, nic: validateField("nic", value) }));
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith("+94")) {
      setPhone("+94");
      return;
    }
    if (/^\+94[0-9]*$/.test(value) && value.length <= 12) {
      setPhone(value);
      setErrors((prevErrors) => ({ ...prevErrors, phone: validateField("phone", value) }));
    }
  };

  const validateField = (field, value) => {
    const namePattern = /^[A-Za-z. ]+$/;
    const nicPattern = /^(\d{12}|\d{9}[Vv])$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+94\d{9}$/;

    switch (field) {
      case "name":
        if (!value) return "Name is required";
        return namePattern.test(value) ? "" : "Name can only contain letters, spaces, and periods.";
      case "nic":
        if (!value) return "NIC is required";
        return nicPattern.test(value) ? "" : "NIC must be 12 digits or 9 digits followed by 'V'";
      case "email":
        if (!value) return "Email is required";
        return emailPattern.test(value) ? "" : "Email must have @ and a valid domain";
      case "phone":
        if (!value) return "Phone is required";
        return phonePattern.test(value) ? "" : "Phone must be +94 followed by 9 digits";
      case "dob":
        if (!value) return "Date of Birth is required";
        return "";
      case "gender":
        if (!value) return "Gender is required";
        return "";
      case "role":
        if (!value) return "Role is required";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "email":
        setEmail(value);
        setErrors((prevErrors) => ({ ...prevErrors, email: validateField("email", value) }));
        break;
      case "dob":
        setDob(value);
        setErrors((prevErrors) => ({ ...prevErrors, dob: validateField("dob", value) }));
        break;
      case "gender":
        setGender(value);
        setErrors((prevErrors) => ({ ...prevErrors, gender: validateField("gender", value) }));
        break;
      case "role":
        setRole(value);
        setErrors((prevErrors) => ({ ...prevErrors, role: validateField("role", value) }));
        break;
      default:
        break;
    }
  };

  const validate = () => {
    const newErrors = {
      name: validateField("name", name),
      nic: validateField("nic", nic),
      email: validateField("email", email),
      phone: validateField("phone", phone),
      dob: validateField("dob", dob),
      gender: validateField("gender", gender),
      role: validateField("role", role),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const sendData = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const newEmployee = {
      name,
      nic,
      dob,
      email,
      address,
      gender,
      phone,
      status,
      role,
    };

    try {
      if (isUpdate) {
        await axios.put(`http://localhost:5000/api/employee/update/${employeeId}`, newEmployee);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Employee updated successfully",
        }).then(() => {
          navigate("/all");
        });
      } else {
        await axios.post("http://localhost:5000/api/employee/add", newEmployee);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Employee registered successfully",
        }).then(() => {
          navigate("/all");
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: isUpdate ? "Error updating employee" : "Error registering employee",
      });
    }
  };

  const handleCancel = () => {
    navigate("/all");
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate());
    return minDate.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split("T")[0];
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
            onChange={handleNameChange}
            required
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="nic">NIC</label>
          <input
            type="text"
            className="form-control"
            id="nic"
            placeholder="NIC"
            value={nic}
            onChange={handleNICChange}
            maxLength={12}
            required
          />
          {errors.nic && <div className="text-danger">{errors.nic}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="dob"
            value={dob}
            onChange={(e) => handleInputChange("dob", e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            required
          />
          {errors.dob && <div className="text-danger">{errors.dob}</div>}
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
            required
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
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                required
              />{" "}
              Male
            </label>
            <label className="ml-3">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => handleInputChange("gender", e.target.value)}
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
            onChange={handlePhoneChange}
            maxLength={12}
            required
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
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Landscape Architect">Landscape Architect</option>
            <option value="Garden Designer">Garden Designer</option>
            <option value="Project Estimator">Project Estimator</option>
            <option value="Gardener">Gardener</option>
            <option value="Project Manager">Project Manager</option>
          </select>
          {errors.role && <div className="text-danger">{errors.role}</div>}
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