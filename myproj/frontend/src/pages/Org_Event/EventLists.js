import React from 'react';
import List from '@mui/material/List';
import { EventItem } from './EventItem';

export const UpcomingEvents = ({ events,userId }) => {
    return (
      <List>
        {events.map(event => (
          <EventItem key={event.id} event={event} userId={userId}/>
        ))}
      </List>
    );
  };

export const PastEvents = ({ events,userId}) => {
    return (
      <List>
        {events.map(event => (
          <EventItem key={event.id} event={event} userId={userId} showCancelIcon={false}/>
        ))}
      </List>
    );
  };