import React, { useState, useEffect } from 'react';
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
  Checkbox,
  FormGroup,
  Snackbar
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";

const TagSelector = ({ category, tags, onChange }) => {
  return (
    <FormControl component="fieldset" sx={{ mt: 2 }}>
      <FormLabel component="legend">{category.charAt(0).toUpperCase() + category.slice(1)} Tags</FormLabel>
      <FormGroup>
        {tags.map((tag, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox checked={tag.checked} onChange={(e) => onChange(index, e.target.checked)} />}
            label={tag.name}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};


const CreateNewEventPage = () => {
  const categories = {
    live: ['rock', 'pop', 'electronic', 'jazz', 'acoustic', 'indie', 'folk', 'blues', 'country', 'reggae'],
    show: ['magic', 'dance', 'circus', 'drama', 'puppetry', 'illusion', 'mime', 'ballet', 'opera', 'theater'],
    comedy: ['standup', 'improv', 'satire', 'sketch', 'dark', 'parody', 'slapstick', 'absurdist', 'observational', 'situational'],
    opera: ['classic', 'modern', 'experimental', 'baroque', 'romantic', 'italian', 'german', 'french', 'russian', 'english']
  };

  const [selectedTags, setSelectedTags] = useState(() => {
    const initialTags = {};
    Object.keys(categories).forEach(category => {
      initialTags[category] = categories[category].map(tag => ({ name: tag, checked: false }));
    });
    return initialTags;
  });

  useEffect(() => {
    const selected = {};
    Object.keys(categories).forEach(category => {
      selected[category] = selectRandomTags(categories[category]).map(tag => ({ name: tag, checked: false }));
    });
    setSelectedTags(selected);
  }, []);

  const selectRandomTags = (tags) => {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

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

  const handleCheckboxChange = (category, index) => (event) => {
    const updatedCategoryTags = [...selectedTags[category]];
    updatedCategoryTags[index].checked = event.target.checked;
    setSelectedTags({ ...selectedTags, [category]: updatedCategoryTags });
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

  const handleTagChange = (category, index, checked) => {
    const updatedTags = [...selectedTags[category]];
    updatedTags[index].checked = checked;
    setSelectedTags({ ...selectedTags, [category]: updatedTags });
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

  const tags = [];
    Object.values(selectedTags).forEach(category =>
      category.forEach(tag => {
        if (tag.checked) tags.push(tag.name);
      })
    );
  eventDetails.event_tags = tags;
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
      <TextField label="Ticket Selling Last Date" variant="outlined" type="datetime-local" value={eventDetails.event_last_selling_date} onChange={handleChange('event_last_selling_date')} sx={{ mb: 2, width: "300px" }} />
      {Object.keys(selectedTags).map(category => (
        <TagSelector
          key={category}
          category={category}
          tags={selectedTags[category]}
          onChange={(index, checked) => handleTagChange(category, index, checked)}
        />
      ))}
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
