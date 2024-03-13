import React,{useState}from 'react';
import './CurrentEvent.css'; 

const CurrentEvent = () =>{
    const [selectedFile, setSelectedFile] = useState(null);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventAddress, setAddress] = useState('');
    const [eventLink, setLink] = useState('');
    const [eventType, setType] = useState('');
    const [ticketAmount, setTicketAmount] = useState(0);
    const [eventSeat, setSeatType] = useState('');
    const [eventEndDate, setEndEventDate] = useState('');

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const submitDocument = () => {
      // 处理文件提交逻辑
      if (selectedFile) {
        console.log(`Submitting file: ${selectedFile.name}`);
        // 实际的提交逻辑会涉及到API调用
      }
      console.log('Form submitted', { eventName, eventDate,eventLink,eventType,eventSeat,eventEndDate});
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // 处理整个表单的提交逻辑
      console.log('Form submitted');
      // 实际的提交逻辑会涉及到API调用
    };
  
    return (
      <form id="new-event-form" onSubmit={handleSubmit}>
        <h1>Current Event Information</h1>
 
        <label htmlFor="event-name">Event name</label>
        <input 
            type="text" 
            id="event-name" 
            name="event-name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)} 
        />

        <label htmlFor="event-date">Event date</label>
        <input 
            type="date" 
            id="event-date" 
            name="event-date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
        />

       <label htmlFor="event-description">Event Description</label>
       <input
            type="text"
            id="event-description"
            name="event-description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
        />
        <label htmlFor="event-address">Event Address</label>
        <input
            text="text"
            id="event-address"
            name="event-address"
            value={eventAddress}
            onChange={(e) => setAddress(e.target.value)}
        />
        <label for="avatar">Choose a Event Required Document:</label>
        <input type="file" id="eventDocument" name="evebtDocument" accept="image/png, image/jpeg" />

        <p>Event type
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Concert
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Live
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Opera
        </label>
        </p>
        <label htmlFor="ticket-amount">Ticket amount</label>
        <input
            text="number"
            id="ticket-amount"
            name="tickect-amount"
            value={ticketAmount}
            onChange={(e) => setTicketAmount(e.target.value)}
        />
        <label htmlFor="ticket-EndDate">Ticket selling last date</label>
        <input 
            type="date" 
            id="event-enddate" 
            name="event-enddate"
            value={eventDate}
            onChange={(e) => setEndEventDate(e.target.value)}
        />
  
        {/* ...其他输入字段... */}

        <button type="submit">Edit it</button>
        </form>
  );
}
 
export default CurrentEvent;