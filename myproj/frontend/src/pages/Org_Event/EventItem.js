// EventItem.js
import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { Container, 
  Grid, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  Stack, 
  InputLabel, 
  Select, 
  MenuItem,
  FormControl,
  Toolbar,
  Drawer,
  Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export const EventItem = ({ event, userId, showCancelIcon = true }) => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Construct the URL with the user ID and event ID
    const url = `http://127.0.0.1:8000/org/event/ticket/?event_id=${event.event_id}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming the data is the array of tickets
        setTickets(data.token);
        console.log("ticket",data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [event.id, userId]);

  const handleEventClick = (eventid) => {
    navigate("/eventpage", {
      state: {
        ID: eventid.event_id,
        user_id: userId,
      },
    });
  };

 // deleteEvent function that handles the deletion logic
async function deleteEvent(eventId, onSuccess, onError) {
  const url = `http://127.0.0.1:8000/delete_event/?event_id=${eventId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE', // Assuming DELETE is the correct method
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers, such as Authorization headers
      },
    });

    if (response.ok) {
      // Call onSuccess callback if the deletion was successful
      onSuccess(eventId);
    } else {
      // If the server responds with an error, handle it here
      const errorData = await response.json();
      console.error('Failed to delete the event:', errorData);
      onError('Error deleting event. Please try again.');
    }
  } catch (error) {
    // Handle errors in the fetch operation
    console.error('Fetch error:', error);
    onError('Error communicating with the server. Please try again.');
  }
}

// Usage in a component or elsewhere
const handleCancelClick = (eventid) => {
  deleteEvent(
    eventid.event_id, 
    (eventId) => {
      // Success callback: update the state and navigate
      setEvents(prevEvents => prevEvents.filter(event => event.event_id !== eventId));
    },
    (errorMessage) => {
      // Error callback: display an error message
      alert(errorMessage);
    }
  );
};


  return (
    <Box>
    <ListItem>
      <ListItemText
        primary={event.event_name}
        secondary={`${new Date(event.event_date).toLocaleDateString()}`}
      />
     
      <ListItemSecondaryAction>
      {showCancelIcon && (
            <IconButton edge="end" aria-label="cancel" onClick={() => handleCancelClick(event)}>
              <CancelIcon />
            </IconButton>
          )}
        <IconButton edge="end" aria-label="info" onClick={() => handleEventClick(event)}>
          <InfoIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <ul>
         
           {tickets.map(ticket => (
            <li key={ticket.ticket_id}>
              Ticket id: {ticket.ticket_id} 
              - Name: {ticket.ticket_name}
              - Price: {ticket.ticket_price}
              - Remain: {ticket.ticket_remain}
              - Sold: {ticket.sold_amount} 
            </li>
          ))}
        </ul>
    </Box>
  );
};
