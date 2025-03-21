import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; // Ensure this path is correct

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white">
      <h3 className="text-center text-teal">Employee MS</h3>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white active">
            <i className="bi bi-speedometer2"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/all" className="nav-link text-white">
            <i className="bi bi-people"></i> Employee
          </NavLink>
        </li>
        <li>
          <NavLink to="/task" className="nav-link text-white">
            <i className="bi bi-calendar"></i> Task Assign
          </NavLink>
        </li>
        <li>
          <NavLink to="/work" className="nav-link text-white">
            <i className="bi bi-calendar"></i> Working Hours
          </NavLink>
        </li>
        <li>
          <NavLink to="/career" className="nav-link text-white">
            <i className="bi bi-gear"></i> Job Opportunities
          </NavLink>
        </li>
        <li>
          <NavLink to="/Registration" className="nav-link text-white">
            <i className="bi bi-gear"></i> signout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
