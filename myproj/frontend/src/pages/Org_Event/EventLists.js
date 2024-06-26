import React, { useState }  from 'react';
import List from '@mui/material/List';
import { EventItem } from './EventItem';
const deleteEvent = async (eventId) => {
  console.log('required deleted', eventId);
  try {
    const res = await fetch(`http://127.0.0.1:8000/delete_event/?event_id=${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      alert("Event deleted successfully");
      // Refresh list or other actions to reflect the deletion
    } else {
      // Try to read the JSON first, but handle cases where the response is not JSON
      try {
        const errorData = await res.json();
        throw new Error(errorData.message);
      } catch (jsonError) {
        // If there is an error parsing JSON, it's likely an HTML error response
      }
    }
  } catch (error) {
    alert("Failed to delete the event: " + error.message);
  }
};



export const UpcomingEvents = ({ events,userId }) => {
  const [eventList, setEventList] = useState(events);

  const handleDeleteEvent = async (eventId) => {
    const success = await deleteEvent(eventId);
    if (success) {
      const updatedEvents = eventList.filter(event => event.id !== eventId);
      setEventList(updatedEvents);
    }
  };
    return (
      <List>
        {events.map(event => (
          <EventItem key={event.id} event={event} userId={userId} onDeleteEvent={handleDeleteEvent}/>
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