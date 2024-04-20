import React, { useState } from 'react';
import { CssBaseline, Container, Grid, Typography, Select} from '@mui/material';
import ParticipationAnalysis from './Report/ParticipationAnalysisWindow';
import EventTypePieChart from './Report/EventTypePieChart';
import TicketSalesLineChart from './Report/TicketSalesLineChart';
import TicketPricePerformance from './Report/TicketPricePerformanceWindow';
import EventsTicketSalesList from './Report/EventsByTicketsSoldChartwindow';
import { useAuth } from '../AuthContext';

function Reports() {
  const [year, setYear] = useState('');
  const [eventType, setEventType] = useState('');
  const {user} = useAuth();
  const userId = user.id;
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };


  const eventsData = [
    { name: 'Concert', value: 400 },
    { name: 'Opera', value: 300 },
    { name: 'Sports', value: 300 },
    { name: 'Theater', value: 200 }
  ];
  const monthlySalesData = [
    { month: 'Jan', tickets: 400 },
    { month: 'Feb', tickets: 300 },
    { month: 'Mar', tickets: 500 },
    { month: 'Apr', tickets: 200 },
    { month: 'May', tickets: 600 },
    { month: 'Jun', tickets: 700 },
    { month: 'Jul', tickets: 500 },
    { month: 'Aug', tickets: 600 },
    { month: 'Sep', tickets: 800 },
    { month: 'Oct', tickets: 700 },
    { month: 'Nov', tickets: 500 },
    { month: 'Dec', tickets: 650 },
  ];


  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Event Analysis
      </Typography>
      <Grid item xs={12} md={6}>
        <ParticipationAnalysis userId={userId} />
      </Grid>
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <EventTypePieChart userId={userId} />
        <TicketSalesLineChart userId={userId} />
        <TicketPricePerformance userId={userId} />
      </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
      <EventsTicketSalesList userId={userId} />
      </Grid>
    
    </Container>
  );
}

export default Reports;
