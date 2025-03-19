import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from './context/AuthContext'; // Adjust the path as needed
import Home from "./components/Home/home";
import AppHeader from "./components/header/header";


import FeedbackForm from "./components/feedback/FeedbackForm";
import FeedbackList from "./components/feedback/FeedbackList";
import AdminFeedbackView from "./components/Admin/Feedback/AdminFeedbackView";

import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './components/Admin/AdminLogin/AdminDashboard';
import Chatbot from "./components/Chatbot";


function App() {
  const { isAdminLoggedIn } = useAuth(); // Get the authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/app" element={<AppHeader />} />
          
         
          

          {/* Feedback routes */}
          <Route path='/feedbackform' element={<FeedbackForm />} />
          <Route path='/feedbacklist' element={<FeedbackList />} />
          <Route path='/AdminFeedbackView' element={<AdminFeedbackView />} />

      
          {/* Admin routes */}
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route
              path="/adminDashboard"
              element={isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/adminLogin" />}
          />
        </Routes>

        {/* Place the ChatBot component here */}
        <Chatbot/> 
    </div>
  );
}

export default App;
