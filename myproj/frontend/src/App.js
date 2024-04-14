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
import ContactPage from "./pages/ContactPage";
import { AuthProvider } from './pages/AuthContext';
//Customer Page Part
import CustomerEventPage from "./pages/Customer/CustomerEventPage";
import CustomerAccountPage from "./pages/Customer/CustomerAccountPage";
import CustomerOrderPage from "./pages/Customer/CustomerOrder";
//Organizer Page Part
import OrganzierAccountPage from "./pages/Organizer/OrganizerAccountPage";
import OrganizerEventPage from "./pages/Organizer/OrganizerEventPage";
import CreateNewEventPage from "./pages/Organizer/CreateNewEventPage";
import OrganizerEventReport from "./pages/Organizer/OrganizerEventReport";

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
         {/*Customer Page*/}
        <Route path="/Cus_Event" element={<CustomerEventPage/>}/>
        <Route path="/Cus_Order" element={<CustomerOrderPage/>}/>
        <Route path="/Cus_Account" element={<CustomerAccountPage/>}/>
        {/*Organizer Page*/}
        <Route path="/Org_Event" element={<OrganizerEventPage/>}/>
        <Route path="/Org_Account" element={<OrganzierAccountPage/>}/>
        <Route path="/CreateNew" element={<CreateNewEventPage/>}/>
        <Route path="/Org_Report" element={<OrganizerEventReport/>}/>

        <Route path="/Contact" element={<ContactPage/>}/>
        {/* 默认重定向到登录页 */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
