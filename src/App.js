// filename -App.js

import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import Home from "./pages";
import Events from "./pages/events";
import Login from "./pages/login";
import Account from "./pages/account/Customer";


function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
			</Routes>
		</Router>
	);
}

export default App;

