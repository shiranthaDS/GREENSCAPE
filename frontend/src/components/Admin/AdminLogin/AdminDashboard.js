import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUsersCog, faHeartbeat, faCity, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css'; // Import your CSS file

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Logged out successfully!');
    navigate('/'); // Redirect to login or homepage
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      </header>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/administration')}>
          <div className="card-icon">
            <FontAwesomeIcon icon={faUsersCog} />
          </div>
          <h2>Test</h2>
          <p>dsdsdadasdasda.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/')}>
          <div className="card-icon">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <h2>Test</h2>
          <p>sasasasasasasasasas.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/')}>
          <div className="card-icon">
            <FontAwesomeIcon icon={faCity} />
          </div>
          <h2>Test</h2>
          <p>zzxzxzxzxzxzx.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/AdminFeedbackView')}>
          <div className="card-icon">
            <FontAwesomeIcon icon={faCommentDots} />
          </div>
          <h2>Feedbacks</h2>
          <p>View and analyze feedback from users.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
