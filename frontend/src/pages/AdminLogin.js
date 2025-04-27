import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.module.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'ADMIN' && password === 'ADMIN123') {
      navigate('/admin-dashboard'); // Redirect to the admin dashboard
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Admin Portal</h2>
          <p>Sign in to access the dashboard</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        
        <div className="login-footer">
          <p>Forgot password? <a href="#">Reset here</a></p>
        </div>
      </div>
<style jsx>{` 




.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #22790091 0%, #43ca4a 100%);
    padding: 20px;
  }
  
  .login-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    padding: 40px;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .login-header h2 {
    color: #333;
    margin-bottom: 8px;
    font-size: 24px;
  }
  
  .login-header p {
    color: #666;
    font-size: 14px;
  }
  
  .error-message {
    color: #e74c3c;
    background: #fde8e8;
    padding: 10px 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 14px;
    text-align: center;
  }
  
  .login-form .form-group {
    margin-bottom: 20px;
  }
  
  .login-form label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-size: 14px;
    font-weight: 500;
  }
  
  .login-form input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  .login-form input:focus {
    border-color: #667eea;
    outline: none;
  }
  
  .login-button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(to right, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  .login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #777;
  }
  
  .login-footer a {
    color: #667eea;
    text-decoration: none;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }


      `}</style>
    </div>
  );
};

export default AdminLogin;