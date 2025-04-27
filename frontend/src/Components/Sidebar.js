import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; // Ensure this path is correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUsers, faTasks, faClock, faBriefcase, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white">
      <h3 className="text-center text-teal">Employee MS</h3>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white">
            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/all" className="nav-link text-white">
            <FontAwesomeIcon icon={faUsers} /> Employee
          </NavLink>
        </li>
        <li>
          <NavLink to="/task" className="nav-link text-white">
            <FontAwesomeIcon icon={faTasks} /> Task Assign
          </NavLink>
        </li>
        <li>
          <NavLink to="/work" className="nav-link text-white">
            <FontAwesomeIcon icon={faClock} /> Working Hours
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-job" className="nav-link text-white">
            <FontAwesomeIcon icon={faBriefcase} /> Add Job Opportunity
          </NavLink>
        </li>
        <li>
          <NavLink to="/adminpage" className="nav-link text-white">
            <FontAwesomeIcon icon={faSignOutAlt} /> Job Applications
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin-dashboard" className="nav-link text-white">
            <FontAwesomeIcon icon={faSignOutAlt} /> Signout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;