// EventItem.js
import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

export const EventItem = ({ event }) => {
  return (
    <ListItem>
      <ListItemText
        primary={event.event_name}
        secondary={`${new Date(event.event_date).toLocaleDateString()}`}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="cancel">
          <CancelIcon />
        </IconButton>
        <IconButton edge="end" aria-label="info">
          <InfoIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
