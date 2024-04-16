import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,Label} from 'recharts';
import { Typography } from '@mui/material';

const TicketPricePerformance = ({ userId }) => {
    const [ticketData, setTicketData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/get_ticket_price_analysis/?user_id=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedData = Object.entries(data.event_type_performance).map(([type, details]) => ({
                    eventType: type,
                    mostPopular: details.most_popular_ticket_type,
                    mostTicketsSold: details.most_tickets_sold,
                    highestGrossing: details.highest_grossing_ticket_type,
                    highestGrossIncome: details.highest_gross_income
                }));
                setTicketData(formattedData);
            } catch (error) {
                console.error('Error loading the ticket price data:', error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <Typography variant="h6" gutterBottom>
                Ticket Price Performance Analysis
            </Typography>
            <ResponsiveContainer>
                <BarChart
                    data={ticketData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="eventType" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8">
                        <Label value="Tickets Sold" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d">
                        <Label value="Gross Income" angle={90} position="insideRight" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="mostTicketsSold" fill="#8884d8" name="Most Tickets Sold">
                        <LabelList dataKey="mostPopular" position="top" />
                    </Bar>
                    <Bar yAxisId="right" dataKey="highestGrossIncome" fill="#82ca9d" name="Highest Gross Income">
                        <LabelList dataKey="highestGrossing" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TicketPricePerformance;

