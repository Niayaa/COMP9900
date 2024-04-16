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
  IconButton,
  Chip,
  Snackbar
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
    event_tags: [],
    tickets: [{ ticket_type: '', ticket_amount: '', ticket_price: '', ticket_remain: '' }]
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (prop) => (event) => {
    setEventDetails({ ...eventDetails, [prop]: event.target.value });
  };

  const handleTicketChange = (index, prop) => (event) => {
    const updatedTickets = [...eventDetails.tickets];
    updatedTickets[index][prop] = event.target.value;
    setEventDetails({ ...eventDetails, tickets: updatedTickets });
  };

  const addTicketType = () => {
    setEventDetails({
      ...eventDetails,
      tickets: [...eventDetails.tickets, { ticket_type: '', ticket_amount: '', ticket_price: '', ticket_remain: '' }]
    });
  };

  const removeTicketType = (index) => {
    const updatedTickets = [...eventDetails.tickets];
    updatedTickets.splice(index, 1);
    setEventDetails({ ...eventDetails, tickets: updatedTickets });
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      const newTags = [...eventDetails.event_tags, event.target.value.trim()];
      setEventDetails({ ...eventDetails, event_tags: newTags });
      event.target.value = ''; // Clear input after adding
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = eventDetails.event_tags.filter(tag => tag !== tagToRemove);
    setEventDetails({ ...eventDetails, event_tags: newTags });
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  const handleSubmit = async () => {
      // Basic validation
  if (!eventDetails.event_name.trim()) {
    alert('Please enter an event name.');
    return;
  }
  if (!eventDetails.event_date) {
    alert('Please enter an event date.');
    return;
  }
  if (!eventDetails.event_description.trim()) {
    alert('Please enter an event description.');
    return;
  }
  if (!eventDetails.event_address.trim()) {
    alert('Please enter an event address.');
    return;
  }
  if (!eventDetails.event_type) {
    alert('Please select an event type.');
    return;
  }
  if (eventDetails.tickets.some(ticket => !ticket.ticket_type.trim() || !ticket.ticket_amount || !ticket.ticket_price || !ticket.ticket_remain)) {
    alert('Please complete all ticket information fields.');
    return;
  }

  // Assuming the event_image_url should be the actual URL after image upload
  const formData = new FormData();
  formData.append('event_name', eventDetails.event_name);
  formData.append('event_date', eventDetails.event_date);
  formData.append('event_description', eventDetails.event_description);
  formData.append('event_address', eventDetails.event_address);
  formData.append('event_image_url', eventDetails.event_image_url);
  formData.append('event_type', eventDetails.event_type);
  formData.append('event_last_selling_date', eventDetails.event_last_selling_date);
  formData.append('event_tags', JSON.stringify(eventDetails.event_tags)); // Sending tags as JSON string
  formData.append('tickets', JSON.stringify(eventDetails.tickets)); 
  console.log(eventDetails);
    // Form submission logic
    try {
      const response = await fetch(`http://127.0.0.1:8000/event_create/?user_id=${user.id}`, {
        method: 'POST',
        body: JSON.stringify(eventDetails), // Assuming JSON content type
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/Org_Event'); // Redirect to events page on success
      } else {
        setError('Failed to submit form.');
      }
    } catch (error) {
      setError(`Error submitting form: ${error.message}`);
    }
  };

  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, mb: 2 }}>
      <Typography variant="h6">New Event Information</Typography>
      <TextField label="Event Name" variant="outlined" onChange={handleChange('event_name')} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Event Date" variant="outlined" type="date" value={eventDetails.event_date} onChange={handleChange('event_date')} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Event Description" variant="outlined" multiline rows={4} value={eventDetails.event_description} onChange={handleChange('event_description')} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Event Address" variant="outlined" value={eventDetails.event_address} onChange={handleChange('event_address')} sx={{ mb: 2, width: "300px" }} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Event Type</FormLabel>
        <RadioGroup row name="eventType" value={eventDetails.event_type} onChange={handleChange('event_type')}>
          <FormControlLabel value="Concert" control={<Radio />} label="Concert" />
          <FormControlLabel value="Live" control={<Radio />} label="Live" />
          <FormControlLabel value="Comedy" control={<Radio />} label="Comedy" />
          <FormControlLabel value="Opera" control={<Radio />} label="Opera" />
        </RadioGroup>
      </FormControl>
      <TextField label="Event Tags" placeholder="Press Enter to add tags" variant="outlined" onKeyUp={handleAddTag} sx={{ mb: 2, width: "300px" }} />
      {eventDetails.event_tags.map((tag, index) => (
        <Chip key={index} label={tag} onDelete={() => removeTag(tag)} color="primary" />
      ))}
      <TextField label="Ticket Selling Last Date" variant="outlined" type="datetime-local" value={eventDetails.event_last_selling_date} onChange={handleChange('event_last_selling_date')} sx={{ mb: 2, width: "300px" }} />
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
