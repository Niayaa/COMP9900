import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";


const CreateNewEventPage = () => {
  const [eventDetails, setEventDetails] = useState({
    event_name: '',
    event_date: '',
    event_description: '',
    event_address: '',
    event_image_url: '',
    event_type: '',
    event_last_selling_date: '',
    event_tags: '',
    tickets: [{ ticket_type: '', ticket_amount: '', ticket_price: '', ticket_remain: '' }]
  });
  const navigate = useNavigate();
  const {user} = useAuth();
  const userId = user.id;  // Replace with actual user ID

  // Handler for general event details
  const handleChange = (prop) => (event) => {
    setEventDetails({ ...eventDetails, [prop]: event.target.value });
  };
  
  // Handler for ticket information
  const handleTicketChange = (index, prop) => (event) => {
    const updatedTickets = [...eventDetails.tickets];
    updatedTickets[index][prop] = event.target.value;
    setEventDetails({ ...eventDetails, tickets: updatedTickets });
  };
  
  // Add a new ticket type
  const addTicketType = () => {
    setEventDetails({
      ...eventDetails,
      tickets: [...eventDetails.tickets, { ticket_type: '', ticket_amount: '', ticket_price: '', ticket_remain: '' }]
    });
  };
  
  // Remove a ticket type
  const removeTicketType = (index) => {
    const updatedTickets = [...eventDetails.tickets];
    updatedTickets.splice(index, 1);
    setEventDetails({ ...eventDetails, tickets: updatedTickets });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validation here...
    
    // Assuming the event_image_url should be the actual URL after image upload
    const formData = new FormData();
    formData.append('event_name', eventDetails.event_name);
    formData.append('event_date', eventDetails.event_date);
    formData.append('event_description', eventDetails.event_description);
    formData.append('event_address', eventDetails.event_address);
    formData.append('event_image_url', eventDetails.event_image_url);
    formData.append('event_type', eventDetails.event_type);
    formData.append('event_last_selling_date', eventDetails.event_last_selling_date);
    formData.append('event_tags', eventDetails.event_tags);
    formData.append('tickets', JSON.stringify(eventDetails.tickets));  // Assuming backend expects a JSON string
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/event_create/?user_id=${user.id}`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        // Handle success
        const data = await response.json();
        console.log(data);
        navigate('/events'); // Redirect to events page
      } else {
        // Handle errors
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, mb: 2 }}>
      <Typography variant="h6">New Event Information</Typography>
      <TextField label="Event Name" variant="outlined" onChange={handleChange('event_name')} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Event Date" variant="outlined" type="date" value={eventDetails.eventDate} onChange={handleChange('eventDate')} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Event Description" variant="outlined" multiline rows={4} value={eventDetails.eventDescription} onChange={handleChange('eventDescription')} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Event Address" variant="outlined" value={eventDetails.eventAddress} onChange={handleChange('eventAddress')} sx={{ mb: 2, width: "300px" }} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Event Type</FormLabel>
        <RadioGroup row name="eventType" value={eventDetails.eventType} onChange={handleChange('eventType')}>
          <FormControlLabel value="Concert" control={<Radio />} label="Concert" />
          <FormControlLabel value="Live" control={<Radio />} label="Live" />
          <FormControlLabel value="Comedy" control={<Radio />} label="Comedy" />
          <FormControlLabel value="Opera" control={<Radio />} label="Opera" />
        </RadioGroup>
      </FormControl>
      <TextField label="Ticket Selling Last Date" variant="outlined" type="datetime-local" value={eventDetails.eventLastSellingDate} onChange={handleChange('eventLastSellingDate')} sx={{ mb: 2, width: "300px" }} />
      {eventDetails.tickets.map((ticket, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField label="Seat Type" value={ticket.ticket_type} onChange={handleTicketChange(index, 'ticket_type')} />
          <TextField label="Amount" type="number" value={ticket.ticket_amount} onChange={handleTicketChange(index, 'ticket_amount')} />
          <TextField label="Price" type="number" value={ticket.ticket_price} onChange={handleTicketChange(index, 'ticket_price')} />
          <TextField label="Remaining" type="number" value={ticket.ticket_remain} onChange={handleTicketChange(index, 'ticket_remain')} />
          <IconButton onClick={() => removeTicketType(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addTicketType}>
        <AddCircleOutlineIcon />
      </IconButton>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Event
      </Button>
    </Box>
  );
};

export default CreateNewEventPage;
