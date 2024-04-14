import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function EventOverview({ year, eventType }) {
  // 这里应该从API获取数据
  const data = {
    totalEvents: year === '2022' && eventType === 'music' ? 150 : 120,
    fluctuation: year === '2022' && eventType === 'music' ? '15%' : '10%'
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Yearly Event Amount</Typography>
        <Typography>{data.totalEvents} Individual</Typography>
        <Typography color="textSecondary">
          Year's change: {data.fluctuation}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default EventOverview;
