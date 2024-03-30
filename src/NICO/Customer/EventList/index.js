import React,{useState}from 'react';
import './EventList.css'; 

const ComponentBooked = () =>{
  const Bookevents = [
    { id: 1, title: 'BookEvent 1' },
    { id: 2, title: 'BookEvent 2' },
    { id: 3, title: 'BookEvent 3' },
    { id: 4, title: 'BookEvent 4' },
    { id: 5, title: 'BookEvent 5' },
    { id: 6, title: 'BookEvent 6' },
    ];
    return(<div className="events-grid">
        {Bookevents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image"> {"./image/concertimage"}</div>
            <h3>{event.title}</h3>
            <div className="event-actions">
              <button className="cancel">Cancel it</button>
              <button className="book">Booked info</button>
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
              <button className="cancel">Rate it</button>
              <button className="book">Booked info</button>
            </div>
          </div>
        ))}
    </div>)
}
const ComponentRecommend = () => {
  const Recommendevents = [
    { id: 1, title: 'Recommendevent 1' },
    { id: 2, title: 'Recommendevent 2' },
    { id: 3, title: 'Recommendevent 3' },
    { id: 4, title: 'Recommendevent 4' },
    { id: 5, title: 'Recommendevent 5' },
    { id: 6, title: 'Recommendevent 6' },
    ];
    return(<div className="events-grid">
        {Recommendevents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image"> {"./image/concertimage"}</div>
            <h3>{event.title}</h3>
            <div className="event-actions">
              <button className="cancel">Book it</button>
              <button className="book">Not interest</button>
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
      case 'ComponentBooked':
        return <ComponentBooked />;
      case 'ComponentCompeleted':
        return <ComponentCompeleted />;
      case 'ComponentRecommend':
        return <ComponentRecommend />;
      default:
        return null;
    }
  };
  return (
    <div className="event-listing">
      <h1>Event Listing</h1>
      <div className="container">
        <div className="button-group">
          <button onClick={() => setActiveComponent('ComponentBooked')}>Booked</button>
          <button onClick={() => setActiveComponent('ComponentCompeleted')}>Compeleted</button>
          <button onClick={() => setActiveComponent('ComponentRecommend')}>Recommend</button>
        </div>
        <div className="event-listing">
          {renderComponent()}
        </div>
      </div>
     
    </div>
  );
};

export default EventList;
