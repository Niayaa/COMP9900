import React from "react";
import Navbar from "./components/Navibar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import OrganizerSignUpPage from "./pages/OrganizerSignUpPage";
import CustomerSignUpPage from "./pages/CustomerSignUpPage";
import PasswordResetPage from "./pages/PasswordResetPage";
<<<<<<< HEAD
=======
import MainPage from "./pages/mainpage";
import EventPage from "./pages/EventPage";
import UseEventPage from "./pages/FakeCallEventPage";
import MyAccount from "./pages/LoginPage";
import Organizer_Acc from "./pages/account/Organizer";
import Customer_Acc from "./pages/account/Customer";
import EventSearchPage from "./pages/mainpage";
>>>>>>> Zzx-New

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-organizer" element={<OrganizerSignUpPage />} />
        <Route path="/signup-customer" element={<CustomerSignUpPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
<<<<<<< HEAD
=======
        <Route path="/MainPage" element={<MainPage />} />
        {/*<Route path="/EventsPage" element={<EventsPage />} />*/}
        <Route path="/MyAccount" element={<MyAccount />} />
        <Route path="/events" element={<UseEventPage></UseEventPage>} />
        <Route path="/eventpage" element={<EventPage></EventPage>} />
        <Route path="/Org_Acc" element={<Organizer_Acc />} />
        <Route path="/Cus_Acc" element={<Customer_Acc />} />
>>>>>>> Zzx-New

        {/* 默认重定向到登录页 */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
