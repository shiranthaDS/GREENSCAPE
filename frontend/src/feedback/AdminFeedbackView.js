import { Box } from "@mui/material";
import FeedbackTable from "./FeedbackTable";
import Axios from "axios";
import { useEffect, useState } from "react";

const AdminFeedbackView = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = () => {
    Axios.get('http://localhost:5000/api/feedback/all') // Correct backend route
      .then(response => {
        setFeedback(response.data.feedbacks || []); // Safe fallback if no data
      })
      .catch(error => {
        console.error("Axios Error (Fetching Feedback):", error);
      });
  };

  const deleteFeedback = (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      Axios.delete(`http://localhost:5000/api/feedback/delete/${id}`) // Using DELETE method correctly
        .then(() => {
          getFeedback(); // Refresh list after deletion
        })
        .catch(error => {
          console.error("Axios Error (Deleting Feedback):", error);
        });
    }
  };

  return (
    <Box p={3}>
      <FeedbackTable
        rows={feedback}
        deleteFeedback={deleteFeedback}
      />
    </Box>
  );
};

export default AdminFeedbackView;
