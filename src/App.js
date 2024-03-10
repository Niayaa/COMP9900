import React from "react";
import Navbar from "./components/Navibar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import OrganizerSignUpPage from "./pages/OrganizerSignUpPage";
import CustomerSignUpPage from "./pages/CustomerSignUpPage";
import PasswordResetPage from "./pages/PasswordResetPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-organizer" element={<OrganizerSignUpPage />} />
        <Route path="/signup-customer" element={<CustomerSignUpPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />

        {/* 默认重定向到登录页 */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
