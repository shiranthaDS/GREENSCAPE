import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./AddJobForm.css";

const AddJobForm = () => {
  const [job, setJob] = useState({
    title: "",
    location: "",
    type: "",
    skills: "",
  });

  const [jobs, setJobs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null); // To track if a job is being updated

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if ((name === "title" || name === "type") && !/^[A-Za-z\s]*$/.test(value)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Only letters and spaces are allowed for Job Title and Job Type.",
      });
      return;
    }
  
    setJob({ ...job, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update job
        await axios.put(`http://localhost:5000/api/jobs/update/${editingId}`, job);
        Swal.fire({
          icon: "success",
          title: "Job Updated",
          text: "The job has been updated successfully!",
        });
        setEditingId(null);
      } else {
        // Add job
        await axios.post("http://localhost:5000/api/jobs/add", job);
        Swal.fire({
          icon: "success",
          title: "Job Added",
          text: "The job has been added successfully!",
        });
      }
      setJob({
        title: "",
        location: "",
        type: "",
        skills: "",
      });
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save the job. Please try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/jobs/delete/${id}`);
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The job has been deleted successfully.",
          });
          fetchJobs();
        } catch (error) {
          console.error("Error deleting job:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete the job. Please try again.",
          });
        }
      }
    });
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setJob({
      title: job.title,
      location: job.location,
      type: job.type,
      skills: job.skills,
    });
  };

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="admin-page1">
      <h1>Admin Job Portal </h1>
      {/* Add Job Form Section */}
      <div className="form-section">
        <form className="add-job-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Update Job" : "Add Job"}</h2>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={job.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Job Type"
            value={job.type}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="skills"
            placeholder=" Discription "
            value={job.skills}
            onChange={handleChange}
            required
          />
          <button type="submit">{editingId ? "Update Job" : "Add Job"}</button>
        </form>
      </div>
      <br></br>
      {/* Job List Section */}
      <div className="jobs-section">
        <h2>Job List</h2>
        <div className="job-list">
          {jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-summary">
                <h4>{job.title}</h4>
                <button className="toggle-btn" onClick={() => toggleDetails(job._id)}>
                  {expandedId === job._id ? "▲" : "▼"}
                </button>
                <div className="job-actions">
                  <button onClick={() => handleEdit(job)} className="update-btn">
                    Edit 
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
              {expandedId === job._id && (
                <div className="job-details">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                  <p><strong>Discription:</strong> {job.skills}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddJobForm;