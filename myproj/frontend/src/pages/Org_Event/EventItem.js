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
import { deleteEvent } from './DeletedEvent';
export const EventItem = ({ event, userId, onDeleteEvent,showCancelIcon = true }) => {
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
  return (
    <Box>
    <ListItem>
      <ListItemText
        primary={event.event_name}
        secondary={`${new Date(event.event_date).toLocaleDateString()}`}
      />
     
      <ListItemSecondaryAction>
      {showCancelIcon && (
            <IconButton edge="end" aria-label="cancel" onClick={() => onDeleteEvent(event.event_id)}>
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
