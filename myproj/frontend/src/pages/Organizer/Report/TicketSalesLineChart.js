import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useAuth} from "../../AuthContext";

function TicketSalesLineChart({userId}) {
  const [salesData, setSalesData] = useState([]);

  // Assume the user_id is retrieved from somewhere in your app, e.g., user context, local storage, etc.
  useEffect(() => {
    const fetchSalesData = async () => {
      console.log(userId);
      try {
        const response = await fetch(`http://127.0.0.1:8000/get_annual_ticket_sales/?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSalesData(data.map(item => ({
          month: item.month.split('T')[0], // Simplifying the date format for display
          total_tickets: item.total_tickets,
          total_income: item.total_income
        })));
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      }
    };

    fetchSalesData();
  }, [userId]); // Fetch the data when userId changes

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={salesData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_tickets" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TicketSalesLineChart;
