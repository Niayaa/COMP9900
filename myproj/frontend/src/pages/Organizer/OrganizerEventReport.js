import React, { useState } from 'react';
import { CssBaseline, Container, Grid, Typography, Select, MenuItem } from '@mui/material';
import EventOverview from './Report/EventOverview';
import TicketAnalysis from './Report/TicketAnalysis';
import EventTypePieChart from './Report/EventTypePieChart';
import TicketSalesLineChart from './Report/TicketSalesLineChart';

function Reports() {
  const [year, setYear] = useState('');
  const [eventType, setEventType] = useState('');

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };

  // 静态示例数据
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
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
                <EventTypePieChart events={[{ name: 'Concert', value: 400 }, { name: 'Opera', value: 300 }]} />
            </Grid>
            <Grid item xs={12} md={6}>
                <TicketSalesLineChart salesData={[
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
                ]} />
            </Grid>
    </Grid>
      <Select value={year} onChange={handleYearChange} displayEmpty>
        <MenuItem value="">
          <em>Year</em>
        </MenuItem>
        <MenuItem value={2021}>2021</MenuItem>
        <MenuItem value={2022}>2022</MenuItem>
      </Select>
      <Select value={eventType} onChange={handleEventTypeChange} displayEmpty>
        <MenuItem value="">
          <em>Event Type</em>
        </MenuItem>
        <MenuItem value="music">Concert</MenuItem>
        <MenuItem value="sport">Opera</MenuItem>
      </Select>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EventOverview year={year} eventType={eventType} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TicketAnalysis year={year} eventType={eventType} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Reports;
