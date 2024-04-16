import React, {useEffect} from 'react';
import { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import {useAuth} from "../../AuthContext";

function EventTypePieChart({ userId }) {
  const [eventTypeData, setEventTypeData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  useEffect(() => {
    const fetchEventTypeData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/get_event_types_summary/?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('report',data);
        setEventTypeData(data.event_types_summary); // 更新状态变量
      } catch (error) {
        console.error('Failed to fetch event type data:', error);
      }
    };

    fetchEventTypeData();
  }, [userId]); // Fetch the data when userId changes


  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={eventTypeData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="total"
          label={({ event_type, total }) => `${event_type} ${(total ).toFixed(0)}%`}
        >
          {eventTypeData.map((entry, index) =>(
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default EventTypePieChart;
