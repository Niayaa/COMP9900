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
import BookInfoPopUp from '../PopUpPages/BookInfo.jsx';

export const EventItem = ({ event, userId, showCancelIcon = true }) => {
  const [tickets, setTickets] = useState([]);
  const [openI, setOpenI] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();



  const handleOpenPopup = () => {
    setOpenI(true);
  };


  const handleClosePopup = () => {
    setOpenI(false);
    fetchTickets();
  };

  const fetchTickets = () => {
    const url = `http://127.0.0.1:8000/org/event/ticket/?event_id=${event.event_id}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming data.token is an array of tickets for the event
        const validTickets = data.token.filter(ticket => ticket.ticket_amount !== undefined);
        setTickets(validTickets);
        

        if (validTickets.length === 0) {
          setEvents(prevEvents => prevEvents.filter(e => e.event_id !== event.event_id));
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };
  
  useEffect(() => {
    fetchTickets();
  }, [event.event_id, userId]); 


// Usage in a component or elsewhere
const handleEventClick = (eventid) => {
  navigate("/eventpage", {
    state: {
      ID: eventid.event_id,
      user_id: userId,
    },
  });
};
  useEffect(() => {
    // Construct the URL with the user ID and event ID
    const url = `http://127.0.0.1:8000/cus/event/ticket/?user_id=${userId}&event_id=${event.event_id}`;

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
  return (
    <Box>
    <ListItem>
      <ListItemText
        primary={event.event_name}
        secondary={`${new Date(event.event_date).toLocaleDateString()}`}
      />
     
      <ListItemSecondaryAction>
        {showCancelIcon && (
            <IconButton edge="end" aria-label="cancel" onClick={handleOpenPopup}>
              <CancelIcon />
            </IconButton>
          )}
         {<BookInfoPopUp cus_id={userId} open={openI} eventID={event.event_id} handleClose={handleClosePopup}></BookInfoPopUp>}
        <IconButton edge="end" aria-label="info" onClick={() => handleEventClick(event)}>
          <InfoIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <ul>
        {tickets.map(ticket => (
            <li key={ticket.reservation_id}>
              Ticket Type: {ticket.reserve_seat} 
              - Order time: {ticket.reserving_time}
              - Amount: {ticket.amount}
              - Price: {ticket.ticket_price} 
            </li>
          ))}
        </ul>
    </Box>
  );
};
