import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Sidebar from "./Sidebar";
import "./Emdash.css"; // Make sure this file includes the styles

const Dashboard = () => {
  const [roleData, setRoleData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetchEmployeeData();
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      const employees = response.data;

      // Count roles
      const roleCount = employees.reduce((acc, emp) => {
        acc[emp.role] = (acc[emp.role] || 0) + 1;
        return acc;
      }, {});

      // Count employee types (status)
      const typeCount = employees.reduce((acc, emp) => {
        acc[emp.status] = (acc[emp.status] || 0) + 1;
        return acc;
      }, {});

      // Convert to chart format
      setRoleData(Object.entries(roleCount).map(([role, count]) => ({ name: role, value: count })));
      setTypeData(Object.entries(typeCount).map(([status, count]) => ({ name: status, value: count })));
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <div className="header-box">
          <h1 className="dashboard-title">Welcome to the Employee Management System</h1>
          <p className="dashboard-date">Today's Date: {currentDate}</p>
        </div>

        <div className="chart-section">
          <h2>Employee Statistics</h2>
          <div className="charts-container">
            {/* Employee Role Pie Chart (Left) */}
            <div className="chart-box">
              <h3>Employee Job Role Distribution</h3>
              <PieChart width={400} height={300}>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {/* Employee Type Pie Chart (Right) */}
            <div className="chart-box">
              <h3>Employee Type Distribution</h3>
              <PieChart width={400} height={300}>
                <Pie data={typeData} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" dataKey="value" label>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
