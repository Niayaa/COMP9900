import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  IconButton
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function formatDateForInput(dateString) {
    const date = new Date(dateString);
    // Remove the 'Z' to convert UTC to local time and format to 'YYYY-MM-DDTHH:mm'
    const formatted = date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
    return formatted;
}

const EditEventModal = ({ open, onClose, event, onSave, handleTicketChange }) => {
    const [formData, setFormData] = useState({
        event_name: event.event_name || '',
        event_date: formatDateForInput(event.event_date) || '',
        event_description: event.event_description || '',
        event_address: event.event_address || '',
        event_type: event.event_type || '',
    });

  useEffect(() => {
    setFormData(event); // Set the initial form data when the event prop changes
  }, [event]);

  useEffect(() => {
    setFormData({
        event_name: event.event_name || '',
        event_date: formatDateForInput(event.event_date) || '',
        event_description: event.event_description || '',
        event_address: event.event_address || '',
        event_type: event.event_type || '',
    });
}, [event]);
    const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });   
    };

    const handleSave = () => {
        const updatedEventDate = convertLocalDateTimeToUTC(formData.event_date);
        const updatedFormData = {
            ...formData,
            event_date: updatedEventDate
        };
        console.log('Edited',updatedFormData);
    
        fetch(`http://127.0.0.1:8000/edit_event/?event_id=${event.event_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFormData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update the event');
            }
            return response.json();
        })
        .then(data => {
            alert('Event updated successfully!');
            onClose(); // Close the modal after successful update
        })
        .catch(error => {
            console.error('Failed to update event:', error);
            alert(`Failed to update the event: ${error.message}`);
        });
    };
    
  const addTicketType = () => {
    const updatedTickets = [...formData.tickets, { ticket_type: '', ticket_amount: '', ticket_price: '', ticket_remain: '' }];
    setFormData({ ...formData, tickets: updatedTickets });
  };

  const removeTicketType = (index) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets.splice(index, 1);
    setFormData({ ...formData, tickets: updatedTickets });
  };

  function convertLocalDateTimeToUTC(dateTimeLocal) {
    // 创建一个新的日期对象，它在本地时区中解析 dateTimeLocal
    const localDate = new Date(dateTimeLocal);
    // 获取从 UTC 到本地时间的偏移量，并调整到 UTC
    const timeOffset = localDate.getTimezoneOffset() * 60000; // 转换为毫秒
    const utcDate = new Date(localDate.getTime() - timeOffset);
    return utcDate.toISOString(); // 转换回 ISO 格式
    }


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Event Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.event_name}
          onChange={handleChange('event_name')}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Event Date"
          variant="outlined" 
          type="datetime-local" 
          fullWidth
          value={formData.event_date}
          onChange={handleChange('event_date')}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Event Description"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={formData.event_description}
          onChange={handleChange('event_description')}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Event Address"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.event_address}
          onChange={handleChange('event_address')}
          sx={{ mb: 2 }}
        />
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Event Type</FormLabel>
          <RadioGroup row value={formData.event_type} onChange={handleChange('event_type')}>
            <FormControlLabel value="concert" control={<Radio />} label="Concert" />
            <FormControlLabel value="live" control={<Radio />} label="Live" />
            <FormControlLabel value="comedy" control={<Radio />} label="Comedy" />
            <FormControlLabel value="opera" control={<Radio />} label="Opera" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
