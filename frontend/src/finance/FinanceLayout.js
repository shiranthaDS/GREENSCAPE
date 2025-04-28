import React from "react";
import FinanceSidebar from "./FinanceSidebar";

const FinanceLayout = ({ children }) => {
  return (
    <div className="finance-layout">
      <FinanceSidebar />
      <div className="finance-content">
        {children}
      </div>


       <style jsx>{`.finance-layout {
  display: flex;
  min-height: 100vh;
}

.finance-content {
  flex: 1;
  margin-left: 250px; /* Same as sidebar width */
  padding: 20px;
  background-color: #f5f7fa;
} `}</style>
    </div>
  );
};

export default FinanceLayout;