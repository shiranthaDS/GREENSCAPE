import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you might want to clear authentication state here
    navigate('/'); // Redirect to home/login page
  };

  const cards = [
    { title: 'Service', icon: '⚙️', path: '/admin/analysis' },
    { title: 'HR', icon: '👥', path: '/dashboard' },
    { title: 'Inventory', icon: '📦', path: '/InventoryDetails' },
    { title: 'Feedback', icon: '💬', path: '/admin-feedback' },
    { title: 'Finance', icon: '💰', path: '/Dashboardf' },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, ADMIN</span>
          <button className="logout-button"   onClick={handleLogout} >Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="cards-container">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="dashboard-card"
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>Manage {card.title.toLowerCase()} operations</p>
            </div>
          ))}
        </div>
      </div>
        <style jsx>{`      
        .dashboard-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #bebfc0;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: #46cc48ad;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .dashboard-header h1 {
    color: #333;
    font-size: 24px;
    margin: 0;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-info span {
    color: #555;
    font-size: 14px;
  }
  
  .logout-button {
    padding: 8px 16px;
    background: #f5f7fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #555;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .logout-button:hover {
    background: #e74c3c;
    color: white;
    border-color: #e74c3c;
  }
  
  .dashboard-content {
    flex: 1;
    padding: 40px;
  }
  
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .dashboard-card {
    background: white;
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .dashboard-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-icon {
    font-size: 40px;
    margin-bottom: 15px;
  }
  
  .dashboard-card h3 {
    color: #333;
    margin: 0 0 10px;
    font-size: 18px;
  }
  
  .dashboard-card p {
    color: #777;
    font-size: 14px;
    margin: 0;
  }
        
        `}</style> 




    </div>
  );
};

export default Dashboard;