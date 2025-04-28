import React, { useState } from "react";
import { Link } from "react-router-dom";


const FinanceSidebar = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  return (
    <aside className="finance-sidebar">
      <h2>Finance Admin Dashboard</h2>
      <ul className="finance-menu">
        <li className={selectedSection === "dashboard" ? "active" : ""}>
          <Link to="/dashboardf" onClick={() => setSelectedSection("dashboard")}>
            <span role="img" aria-label="dashboard">📊</span> Dashboard
          </Link>
        </li>
        <li className={selectedSection === "minor-transactions" ? "active" : ""}>
          <Link to="/MinorTransactionList" onClick={() => setSelectedSection("minor-transactions")}>
            <span role="img" aria-label="petty cash">💰</span> Petty Cash
          </Link>
        </li>
        <li className={selectedSection === "add-transaction" ? "active" : ""}>
          <Link to="/AddMinorTransaction" onClick={() => setSelectedSection("add-transaction")}>
            <span role="img" aria-label="add transaction">➕</span> Add Transaction
          </Link>
        </li>
        <li className={selectedSection === "financial-transactions" ? "active" : ""}>
          <Link to="/FinancialTransactions" onClick={() => setSelectedSection("financial-transactions")}>
            <span role="img" aria-label="transactions">📑</span> Transactions
          </Link>
        </li>
        <li className={selectedSection === "financial-analysis" ? "active" : ""}>
          <Link to="/FinanceAnalysis" onClick={() => setSelectedSection("financial-analysis")}>
            <span role="img" aria-label="analysis">📈</span> Analysis
          </Link>
        </li>
        <li className={selectedSection === "invoices" ? "active" : ""}>
          <Link to="/FinanceInvoice" onClick={() => setSelectedSection("invoices")}>
            <span role="img" aria-label="invoices">🧾</span> Invoices
          </Link>
        </li>
        <li className={selectedSection === "invoices" ? "active" : ""}>
          <Link to="/admin-dashboard" onClick={() => setSelectedSection("invoices")}>
            <span role="img" aria-label="invoices">🚪 </span> Sign out
          </Link>
        </li>
      </ul>


     <style jsx>{` .finance-sidebar {
  width: 250px;
  background-color:rgb(33, 145, 38);
  color: white;
  height: 100vh;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
}

.finance-sidebar h2 {
  color: #ecf0f1;
  font-size: 1.3rem;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #34495e;
}

.finance-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.finance-menu li {
  margin: 15px 0;
}

.finance-menu li a {
  color:rgb(255, 255, 255);
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.finance-menu li a:hover {
  background-color: #34495e;
  color: #ecf0f1;
}

.finance-menu li a span {
  margin-right: 10px;
  font-size: 1.1rem;
}

.finance-menu .active a {
  background-color: #3498db;
  color: white;
}

.finance-menu .active a:hover {
  background-color: #2980b9;
}`}</style>
    </aside>
  );
};

export default FinanceSidebar;