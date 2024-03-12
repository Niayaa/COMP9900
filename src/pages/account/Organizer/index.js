// pages/about.js
import React, { useState } from 'react';
import MainPage from './MainPage';
import NewEvent from './NewEvent';
import CurrentEvent from './CurrentEvent';
import './organizer.css';

const Organizer = () => {
  const [currentPage, setCurrentPage] = useState('MainPage');

  const renderPage = () => {
    switch (currentPage) {
      case 'MainPage':
        return <MainPage />;
      case 'NewEvent':
        return <NewEvent />;
      case 'CurrentEvent':
        return <CurrentEvent />;
      default:
        return <MainPage />;
    }
  };

  return (
    <div>
      <button onClick={() => setCurrentPage('MainPage')}>MainPage</button>
      <button onClick={() => setCurrentPage('NewEvent')}>NewEvent</button>
      <button onClick={() => setCurrentPage('CurrentEvent')}>CurrentEvent</button>
      {renderPage()}
    </div>
  );
};

export default Organizer;
