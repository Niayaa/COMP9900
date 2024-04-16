// CancelList.js
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import { EventItem } from './EventItem';

export const CancelList = ({ userId }) => {
  const [cancelEvents, setCancelEvents] = useState([]);
  console.log('cancelpage');
  useEffect(() => {
    const fetchCancelEvents = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/cus/all_canceled/?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('canceled',data);
        setCancelEvents(data); // Assuming the response is the array of canceled events
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchCancelEvents();
  }, [userId]);

  return (
    <List>
      {cancelEvents.map(event => (
        // Pass showCancelIcon as false since these are canceled events
        <EventItem key={event.id} event={event} userId={userId} showCancelIcon={false}/>
      ))}
    </List>
  );
};
