import React,{useState}from 'react';
import './EventList.css'; 

const ComponentPosted = () =>{
  const Postevents = [
    { id: 1, title: 'PostEvent 1' },
    { id: 2, title: 'PostEvent 2' },
    { id: 3, title: 'PostEvent 3' },
    { id: 4, title: 'PostEvent 4' },
    { id: 5, title: 'PostEvent 5' },
    { id: 6, title: 'PostEvent 6' },
    ];
    return(<div className="events-grid">
        {Postevents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image"> {"./image/concertimage"}</div>
            <h3>{event.title}</h3>
            <div className="event-actions">
              <button className="cancel">Edit it</button>
              <button className="book">Customer analyze</button>
            </div>
          </div>
        ))}
    </div>)
  
} 
const ComponentCompeleted = () => {
  const Componentevents = [
    { id: 1, title: 'Componentevent 1' },
    { id: 2, title: 'Componentevent 2' },
    { id: 3, title: 'Componentevent 3' },
    { id: 4, title: 'Componentevent 4' },
    { id: 5, title: 'Componentevent 5' },
    { id: 6, title: 'Componentevent 6' },
    ];
    return(<div className="events-grid">
        {Componentevents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image"> {"./image/concertimage"}</div>
            <h3>{event.title}</h3>
            <div className="event-actions">
              <button className="cancel">Check reply</button>
              <button className="book">Customer analyze</button>
            </div>
          </div>
        ))}
    </div>)
}

const EventList = () => {
  const [activeComponent, setActiveComponent] = useState('ComponentBooked');
  // 根据activeComponent的值来决定渲染哪个组件
  const renderComponent = () => {
    switch (activeComponent) {
      case 'ComponentPosted':
        return <ComponentPosted />;
      case 'ComponentCompeleted':
        return <ComponentCompeleted />;
      default:
        return null;
    }
  };
  return (
    <div className="event-listing">
      <h1>Management Events</h1>
      <div className="container">
        <div className="button-group">
          <button onClick={() => setActiveComponent('ComponentPosted')}>Posted</button>
          <button onClick={() => setActiveComponent('ComponentCompeleted')}>Compeleted</button>
        </div>
        <div className="event-listing">
          {renderComponent()}
        </div>
      </div>
     
    </div>
  );
};

export default EventList;