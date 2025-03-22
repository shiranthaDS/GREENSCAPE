import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert
import Header from "../../header/header"; // Import your header component
import './AdminLogin.css'; // Import your custom CSS file
import { useAuth } from '../../../context/AuthContext'; // Adjust the path as needed


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from auth context

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the credentials are correct
    if (username === 'ADMIN' && password === 'ADMINITP') {
      // Log the admin in
      login();
      // Redirect to admin dashboard
      navigate('/adminDashboard');
    } else {
      // Show SweetAlert for invalid login
      Swal.fire({
        icon: 'error',
        title: 'Invalid login credentials',
        text: 'Please check your username and password.',
      });
    }
  };

  return (
    <div className="admin-login-container">
      <Header /> {/* Include the Header */}
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? '👁️' : '🙈'} {/* Use emojis for show/hide icon */}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>

      <footer className="greenscape-home-footer">
                <p>&copy; 2025 GreenScape. All rights reserved.</p>
                
                
            </footer>


    </div>
  );
};


export default AdminLogin;
