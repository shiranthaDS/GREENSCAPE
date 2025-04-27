import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedbackList.css';
import Header from "../pages/Header"; 

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback/all');
        setFeedbacks(response.data.feedbacks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError('Failed to fetch feedbacks');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    const filledStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return filledStars + emptyStars;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    
     
   
    <div className="feedback-list-container">
    <Header />
      <br></br>
      <br></br>
      <br></br>
      <h2>Feedback List</h2>
      <ul>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <li key={index} className="feedback-card">
              <h3>{feedback.employeeName} ({feedback.department})</h3>
              <div className="stars">{renderStars(feedback.rating)}</div>
              <p>{feedback.feedback}</p>
              <p><em>{new Date(feedback.date).toLocaleString()}</em></p>
            </li>
          ))
        ) : (
          <p className="no-feedback">No feedback available.</p>
        )}
      </ul>
    </div>
   
  );
}

export default FeedbackList;
