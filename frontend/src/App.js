import React from "react";
import './App.css';

import AllEmployee from './Components/AllEmployee';
import AddEmployee from "./Components/AddEmployee";
import TaskAssign from "./Components/TaskAssign";
import TaskAssignForm from "./Components/TaskAssignForm";
import UpdateTask from "./Components/UpdateTask";
import WorkAssign from "./Components/WorkAssign";
import WorkAssignForm from "./Components/WorkAssignForm";
import UpdateWork from "./Components/UpdateWork";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import './Components/Sidebar.css'; 
import './Components/AllEmployee.css';
import Dashboard from "./Components/Dashboard";
import Adminpage from "./Components/Adminpage"; // Corrected import path
import AddJobForm from "./Components/AddJobForm"; // Corrected import path

function App() {
  return (
    <Router>
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
            <Route path="/admin" element={<Adminpage />} />
            <Route path="/add-job" element={<AddJobForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;