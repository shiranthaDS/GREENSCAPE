import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home'; // Import your Home component
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
import './Components/Sidebar.css'; 
import './Components/AllEmployee.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route without sidebar */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/apply/:jobId" element={<ApplicationForm />} />
        {/* Dashboard routes with sidebar */}
        <Route path="/*" element={
          <div className="flex">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/all" element={<AllEmployee />} />
                <Route path="/add" element={<AddEmployee />} />
                <Route path="/task" element={<TaskAssign />} />
                <Route path="/assign-task" element={<TaskAssignForm />} />
                <Route path="/update-task/:id" element={<UpdateTask />} />
                <Route path="/work" element={<WorkAssign />} />
                <Route path="/assign-work" element={<WorkAssignForm />} />
                <Route path="/update-work/:id" element={<UpdateWork />} />
                <Route path="/add-job" element={<AddJobForm />} />
                <Route path="/admin" element={<AdminPage />} />
                

              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;