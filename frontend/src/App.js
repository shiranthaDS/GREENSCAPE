import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Garden Services Pages
import AppointmentForm from "./pages/AppointmentForm";
import AdminAppointments from "./pages/AdminAppointments";
import CostEstimator from "./pages/cost";
import AppointmentList from "./pages/AppointmentList";
import CustomerProfile from "./pages/CustomerProfile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ServiceList from "./pages/ServiceList";
import AdminServiceForm from "./pages/AdminServiceForm";
import AdminLayout from "./pages/AdminLayout";
import AdminAppointmentsCalendar from "./pages/AdminAppointmentsCalendar";
import ServicesDemandAnalysis from "./pages/ServicesDemandAnalysis";
import AdminLogin from "./pages/AdminLogin";  
import AdminDashboard from "./pages/Dashboard";
import Header from "./pages/Header"; // Import Header component

// HR/Employee/Job Pages
import Sidebar from './Components/Sidebar';
import AllEmployee from './Components/AllEmployee';
import AddEmployee from "./Components/AddEmployee";
import TaskAssign from "./Components/TaskAssign";
import TaskAssignForm from "./Components/TaskAssignForm";
import UpdateTask from "./Components/UpdateTask";
import WorkAssign from "./Components/WorkAssign";
import WorkAssignForm from "./Components/WorkAssignForm";
import UpdateWork from "./Components/UpdateWork";
import Dashboard from "./Components/Dashboard";
import AddJobForm from "./Components/AddJobForm";
import CareerPage from "./Components/CareerPage";
import ApplicationForm from "./Components/ApplicationForm";
import AdminPage from "./Components/Adminpage";


// Feedback Pages
import FeedbackForm from "./feedback/FeedbackForm";
import FeedbackList from "./feedback/FeedbackList";
import FeedbackTable from "./feedback/FeedbackTable";
import AdminFeedbackView from "./feedback/AdminFeedbackView";
import Chatbot from "./feedback/Chatbot"; // ✅ Corrected import

//inventory
import Inventory from "./Inventory/AddInventory";
import InventoryNav from "./Inventory/InventoryNav";  
import InventoryDetails from "./Inventory/InventoryDetails";
import LowStock from "./Inventory/LowStockAlerts";  
import Maintenance from "./Inventory/MaintenanceLogs";
import UpdateInventory from "./Inventory/UpdateInventory";
import Usagereports from "./Inventory/UsageReports";

//finance 

import AddMinorTransaction from "./finance/AddMinorTransaction";
import MinorTransactionList from "./finance/MinorTransactionList";
import FinancialTransactions from "./finance/FinancialTransactions";
import FinanceInvoice from "./finance/FinanceInvoice";
import FinanceAnalysis from "./finance/FinanceAnalysis";
import Dashboardf from "./finance/Dashboardf";
import FinanceLayout from "./finance/FinanceLayout"; // Import the new FinanceLayout


// CSS
import './Components/Sidebar.css';
import './Components/AllEmployee.css';

// Layout wrapper with Sidebar
const WithSidebar = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="main-content" style={{ flex: 1, padding: "1rem" }}>
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌿 Garden Services Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/cost-estimator" element={<CostEstimator />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment-form" element={<AppointmentForm />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/apply/:jobId" element={<ApplicationForm />} />
        <Route path="/fd" element={<FeedbackForm />} />
        <Route path="/feedback-list" element={<FeedbackList />} />
        <Route path="/feedback-table" element={<FeedbackTable />} />
        <Route path="/admin-feedback" element={<AdminFeedbackView />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/header" element={<Header />} /> 
        
        
        <Route path="/inventory-nav" element={<InventoryNav />} />
        <Route path="/InventoryDetails" element={<InventoryDetails />} />
        <Route path="/LowStockAlerts" element={<LowStock />} />
        <Route path="/MaintenanceLogs" element={<Maintenance />} /> 
        
        
        <Route path="/UsageReports" element={<Usagereports />} />
        <Route path="/AddInventory" element={<Inventory />} />
        // Make sure you have this route
        <Route path="/AddInventory/:itemId" element={<UpdateInventory />} />
        

        // In your App.js, update these finance routes:
<Route path="/dashboardf" element={<FinanceLayout><Dashboardf /></FinanceLayout>} />
<Route path="/AddMinorTransaction" element={<FinanceLayout><AddMinorTransaction /></FinanceLayout>} />
<Route path="/MinorTransactionList" element={<FinanceLayout><MinorTransactionList /></FinanceLayout>} /> 
<Route path="/FinancialTransactions" element={<FinanceLayout><FinancialTransactions /></FinanceLayout>} /> 
<Route path="/FinanceInvoice" element={<FinanceLayout><FinanceInvoice /></FinanceLayout>} />
<Route path="/FinanceAnalysis" element={<FinanceLayout><FinanceAnalysis /></FinanceLayout>} />

       


        {/* 🛠 Garden Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="table" element={<AdminAppointments />} />
          <Route path="manage-services" element={<AdminServiceForm />} />
          <Route path="project" element={<AppointmentList />} />
          <Route path="calendar" element={<AdminAppointmentsCalendar />} />
          <Route path="analysis" element={<ServicesDemandAnalysis />} />
        </Route>

       

        {/* 👥 HR/Employee/Job Dashboard Public Routes with Sidebar */}
        <Route path="/dashboard" element={<WithSidebar><Dashboard /></WithSidebar>} />
        <Route path="/all" element={<WithSidebar><AllEmployee /></WithSidebar>} />
        <Route path="/add" element={<WithSidebar><AddEmployee /></WithSidebar>} />
        <Route path="/task" element={<WithSidebar><TaskAssign /></WithSidebar>} />
        <Route path="/assign-task" element={<WithSidebar><TaskAssignForm /></WithSidebar>} />
        <Route path="/update-task/:id" element={<WithSidebar><UpdateTask /></WithSidebar>} />
        <Route path="/work" element={<WithSidebar><WorkAssign /></WithSidebar>} />
        <Route path="/assign-work" element={<WithSidebar><WorkAssignForm /></WithSidebar>} />
        <Route path="/update-work/:id" element={<WithSidebar><UpdateWork /></WithSidebar>} />
        <Route path="/add-job" element={<WithSidebar><AddJobForm /></WithSidebar>} />
        <Route path="/adminpage" element={<WithSidebar><AdminPage /></WithSidebar>} />
      </Routes>

      {/* ✅ Chatbot rendered globally */}
      <Chatbot />
    </Router>
  );
}

export default App;
