import React from "react";
import Navbar from './pages/AppBar/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import MainPage from "./pages/mainpage";
import EventPage from "./pages/EventPage";
import UseEventPage from "./pages/FakeCallEventPage";
import MyAccount from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CustomerEventPage from "./pages/CustomerEventPage";
import CustomerAccountPage from "./pages/CustomerAccountPage";
import CustomerOrderPage from "./pages/CustomerOrder";
import ContactPage from "./pages/ContactPage";
import { AuthProvider } from './pages/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/MainPage" element={<MainPage />} />
        {/*<Route path="/EventsPage" element={<EventsPage />} />*/}
        <Route path="/MyAccount" element={<MyAccount />} />
        <Route path="/events" element={<UseEventPage></UseEventPage>} />
        <Route path="/eventpage" element={<EventPage></EventPage>} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/Cus_Event" element={<CustomerEventPage/>}/>
        <Route path="/Cus_Order" element={<CustomerOrderPage/>}/>
        <Route path="/Cus_Account" element={<CustomerAccountPage/>}/>
        <Route path="/Contact" element={<ContactPage/>}/>
        {/* 默认重定向到登录页 */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
