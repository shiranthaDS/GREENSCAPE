import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import StarRating from './StarRating';
import Header from "../pages/Header";

import './FeedbackForm.css';

function FeedbackForm() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[a-zA-Z\s]+$/.test(employeeName)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Employee Name must contain only letters and spaces.',
      });
      return;
    }

    if (!employeeName || !employeeEmail || !department || !feedback) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(employeeEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Rating',
        text: 'Rating must be between 1 and 5.',
      });
      return;
    }

    try {
      // ✅ Fixed API endpoint
      await axios.post('http://localhost:5000/api/feedback/create', {
        employeeName,
        employeeEmail,
        department,
        rating,
        feedback,
      });

      Swal.fire({
        icon: 'success',
        title: 'Feedback Submitted!',
        text: 'Your feedback has been successfully submitted.',
      });

      // Clear form
      setEmployeeName('');
      setEmployeeEmail('');
      setDepartment('');
      setRating(1);
      setFeedback('');
    } catch (error) {
      console.error("Error submitting feedback:", error.response?.data || error.message || error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'There was an error submitting your feedback. Please try again.',
      });
    }
  };

  const handleClear = () => {
    setEmployeeName('');
    setEmployeeEmail('');
    setDepartment('');
    setRating(1);
    setFeedback('');
  };

  return (
    
    <div className="feedback-form-container">
      
      <Header />  
      <br></br>
      <br></br>
      <br></br>
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <input
            id="employeeName"
            type="text"
            placeholder="Enter your Username"
            value={employeeName}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setEmployeeName(value);
              }
            }}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <input
            id="employeeEmail"
            type="email"
            placeholder="Enter your Email"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            aria-required="true"
          >
            <option value="">Select </option>
            <option value="LawnCare">LawnCare</option>
            <option value="Garden Design">Garden Design</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="form-group">
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        <div className="form-group">
          <textarea
            id="feedback"
            placeholder="Add your Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Submit Feedback</button>
          <button type="button" className="clear-button" onClick={handleClear}>Cancel</button>
        </div>
      </form>
    </div>
   
  );
}

export default FeedbackForm;
