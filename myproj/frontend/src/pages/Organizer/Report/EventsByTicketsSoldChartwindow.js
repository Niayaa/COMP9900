import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Typography,MenuItem,Paper,ListItem,ListItemText,List } from '@mui/material';

const EventsTicketSalesList = ({ userId }) => {
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/events_by_total_tickets_sold/?user_id=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEventsData(data);
            } catch (error) {
                setError('Failed to load data: ' + error.message);
                console.error('Error loading the events data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6" gutterBottom>
                Event Ticket Sales
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <List>
                    {eventsData.map(event => (
                        <ListItem key={event.event_id}>
                            <ListItemText primary={`Event Name: ${event.event_name}`} secondary={`Tickets Sold: ${event.sold_tickets}`} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default EventsTicketSalesList;

