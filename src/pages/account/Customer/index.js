// pages/about.js
 
import React from "react";
import AccountForm from "./Accountform";
import EventList from "./EventList";
import "./customer.css";
 
const Customer = () => {
    return (
        <div className="container">
            <div className="left-column">
                <div className="form-section">
                <AccountForm />
                </div>
            </div>
            
            <div className="events">
                <EventList />
            </div>
        </div>
    );
};
 
export default Customer;