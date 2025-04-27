import React from 'react';
import { NavLink, useLocation } from "react-router-dom";

function InventoryNav() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navStyle = {
    backgroundColor: 'var(--primary-green)', // Dark Green
    padding: '15px',
    width: '200px', // Keep original width
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    zIndex: '1000' // Ensure navbar stays on top
  };

  const ulStyle = {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  };

  const liStyle = {
    margin: '20px 0'
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white', // Force white text
    fontSize: '18px',
    padding: '10px',
    borderRadius: '5px',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: isActive ? '#FDD835' : 'transparent', // Hard-coded yellow for active
    fontWeight: isActive ? 'bold' : 'normal',
    boxShadow: isActive ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
  });

  const iconStyle = {
    marginRight: '10px',
    transition: 'transform 0.3s ease-in-out',
    color: 'inherit' // Inherits text color
  };

  const warningStyle = {
    color: 'var(--error-red)' // Alert Red
  };

  return (
    <div>
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <NavLink 
              to="/InventoryDetails" 
              style={linkStyle(isActive('/InventoryDetails'))}
            >
              <span style={iconStyle}>📦</span> Dashboard
            </NavLink>
          </li>

          <li style={liStyle}>
            <NavLink 
              to="/LowStockAlerts" 
              style={linkStyle(isActive('/LowStockAlerts'))}
            >
              <span style={{ ...iconStyle, ...warningStyle }}>⚠️</span> Low-Stock Alerts
            </NavLink>
          </li>

          <li style={liStyle}>
            <NavLink 
              to="/MaintenanceLogs" 
              style={linkStyle(isActive('/MaintenanceLogs'))}
            >
              <span style={iconStyle}>🛠️</span> Maintenance Logs
            </NavLink>
          </li>

          <li style={liStyle}>
            <NavLink 
              to="/UsageReports" 
              style={linkStyle(isActive('/UsageReports'))}
            >
              <span style={iconStyle}>📊</span> Usage Reports
            </NavLink>
          </li>

          <li style={liStyle}>
            <NavLink 
              to="/AddInventory" 
              style={linkStyle(isActive('/AddInventory'))}
            >
              <span style={iconStyle}>➕</span> Add Inventory
            </NavLink>
          </li>
          <li style={liStyle}>
            <NavLink 
              to="/Admin-dashboard" 
              style={linkStyle(isActive('/Admin-dashboard'))}
            >
              <span style={iconStyle}> 🚪 </span> Sign-Out
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default InventoryNav;
