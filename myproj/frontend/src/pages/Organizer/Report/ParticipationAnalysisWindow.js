import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';

const ParticipationAnalysis = ({ userId }) => {
    const [averageParticipation, setAverageParticipation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchParticipationData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/get_participation_analysis/?user_id=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAverageParticipation(data.average_participation['sold_tickets__avg']);
            } catch (error) {
                setError('Failed to fetch data: ' + error.message);
                console.error('Error loading the participation data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipationData();
    }, [userId]);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Participation Analysis
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Typography>
                    Average Tickets Sold per Event: {averageParticipation ? averageParticipation.toFixed(2) : 'No data available'}
                </Typography>
            )}
        </Box>
    );
};

export default ParticipationAnalysis;
