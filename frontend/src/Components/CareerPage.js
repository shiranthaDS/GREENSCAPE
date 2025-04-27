import React, { useState, useEffect, Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CareerPage.css";
import Header from "../pages/Header";
import { FaLocationArrow, FaChevronDown, FaChevronUp } from "react-icons/fa"; 
const bannerImage = "/image/1.jpg"; // Directly reference the public folder

  


const CareerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track which job's details are expanded

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id); // Toggle expanded state
  };

  return (
    <div className="career-page">
      <Header />
      <br/>
      <br/>
      <br/>
      {/* Banner Section */}
      <div className="banner">
  <img src={bannerImage} alt="Career Banner" />
</div>

      {/* Job Openings Section */}
      
        <div className="section-bar">
          <h2>Job Openings</h2>
        </div>
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs available at the moment.</p>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-summary">
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <p className="job-location">
                      <FaLocationArrow className="location-icon" /> {job.location}
                    </p>
                  </div>
                  
                  <div className="actions">
                  
                    <button
                      className="toggle-btn"
                      onClick={() => toggleDetails(job._id)}
                    >
                      {expandedId === job._id ? (
                        <>
                          Hide Details <FaChevronUp />
                        </>
                      ) : (
                        <>
                          Show Details <FaChevronDown />
                        </>
                      )}
                    </button>
                    <Link to={`/apply/${job.title}`} className="apply-now">
                      Apply Now
                    </Link>
                  </div>
                </div>
                {expandedId === job._id && (
                  <div className="job-details">
                    <p>
                      <strong>Type:</strong> {job.type}
                    </p>
                    <p>
                      <strong>Discription :</strong> {job.skills}
                    </p>
                    
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
};

export default CareerPage;
