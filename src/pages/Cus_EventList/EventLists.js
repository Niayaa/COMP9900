import React from 'react';
import List from '@mui/material/List';
import { EventItem } from './EventItem';

export const UpcomingEvents = ({ events }) => {
    return (
      <List>
        {events.map(event => (
          <EventItem key={event.id} event={event} />
        ))}
      </List>
    );
  };

export const PastEvents = ({ events }) => {
    return (
      <List>
        {events.map(event => (
          <EventItem key={event.id} event={event} />
        ))}
      </List>
    );
  };