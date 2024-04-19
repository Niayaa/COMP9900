import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function TicketAnalysis({ year, eventType }) {
  const data = {
    totalTicketsSold: year === '2022' && eventType === 'music' ? 5000 : 3000,
    totalRevenue: year === '2022' && eventType === 'music' ? '1,000,000' : '600,000元'
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Ticket Overview</Typography>
        <Typography>Total tickect: {data.totalTicketsSold} tickets</Typography>
        <Typography>Total incoming: {data.totalRevenue}</Typography>
      </CardContent>
    </Card>
  );
}

export default TicketAnalysis;
