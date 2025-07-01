import React from "react";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Home/Dashboard";
import LandingPage from "./pages/LandingPage";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import UserProvider from "./Context/userContext";


const App=()=>{
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Job-ready/:sessionId" element={<InterviewPrep />} />
        </Routes>
      </Router>

      <Toaster
      toastOptions={{
      className:"",
      style:{
        fontSize:"13px",
      },
    }}
    />

    </div>
    </UserProvider>
  )
}

export default App;