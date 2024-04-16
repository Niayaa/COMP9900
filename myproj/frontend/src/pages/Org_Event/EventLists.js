import React, { useState }  from 'react';
import List from '@mui/material/List';
import { EventItem } from './EventItem';
const deleteEvent= async (eventId) => {
  // if (window.confirm("Are you sure you want to cancel this ticket?")) {
      console.log('required deleted',eventId);
      await fetch(`http://127.0.0.1:8000/delete_event/?event_id=${eventId}`, {
          method: 'DELETE',
          headers: {
              'content-type':'application/json',
          },
          
      }).then(res => {
          if (res.ok) {
            alert("Event deleted sucessfully");
            return true;
          }
      }).then(task=> {
          console.log("Delete event",task);
          return true;
      })
      .catch(error => {
          alert(error);
      });
  // }
}
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