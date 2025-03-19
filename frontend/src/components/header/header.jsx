import React, { useState } from "react";
import logo1 from "./images/greenscape.png";
import Green from "./images/Green.png";
import "./header.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <header className="hdr-wrapper-uniqueee">
      <div className="bar-green-uniqueee-header">
        <nav>
          <ul className="nav-uniqueee">
            <li>
            <Link to="/" className="nav-buttonhead-uniqueee">
                  HOME
                </Link>
            </li>

            <li className="nav-item-uniqueee">
              <button className="nav-buttonhead-uniqueee">
                Shirantha
              </button>
              <div className="button-menu-uniqueee">
                <Link to="/login" className="button-item-uniqueee">
                  test
                </Link>
                <Link to="/login" className="button-item-uniqueee">
                  test
                </Link>
                <button className="button-item-uniqueee">
                  test
                </button>
              </div>
            </li>

            <li className="nav-item-uniqueee">
              <button className="nav-buttonhead-uniqueee">
                Shalon
              </button>
              <div className="button-menu-uniqueee">
                <Link to="/login" className="button-item-uniqueee">
                  test
                </Link>
                <Link to="/login" className="button-item-uniqueee">
                  test
                </Link>
                <button className="button-item-uniqueee">
                  test
                </button>
              </div>
            </li>
            <li className="nav-item-uniqueee">
              <button className="nav-buttonhead-uniqueee">Nipuni</button>
              <div className="button-menu-uniqueee">
                <button className="button-item-uniqueee">
                  Test
                </button>
              </div>
            </li>
            <li className="nav-item-uniqueee">
              <button className="nav-buttonhead-uniqueee">
                Manuga
              </button>
              <div className="button-menu-uniqueee">
                <Link to="/login" className="button-item-uniqueee">
                  Test
                </Link>
                <Link to="/login" className="button-item-uniqueee">
                  Test
                </Link>
              </div>
            </li>
            <li className="nav-item-uniqueee">
              <button className="nav-buttonhead-uniqueee">Feedbacks</button>
              <div className="button-menu-uniqueee">
                <Link to="/FeedbackForm" className="button-item-uniqueee">
                  Add Feedback
                </Link>
                <Link to="/FeedbackList" className="button-item-uniqueee">
                  View Feedback
                </Link>
              </div>
            </li>
            {/* New Admin Section */}
            <li className="nav-item-uniqueee">
              <Link to="/AdminLogin" className="nav-link-uniqueee">
                <FontAwesomeIcon icon={faUserShield} size="lg" /> Admin
              </Link>
            </li>
          </ul>
        </nav>
        <div className="council-head-uniqueee">
        <img src={Green} alt="Green" className="logo-uniqueee" />
        </div>
      </div>
      <div className="logo-container-uniqueee">
        <img src={logo1} alt="Logo 1" className="logo-uniqueee" />
        
      </div>
      <hr className="divider-uniqueee" />
    </header>
  );
}

export default Header;
