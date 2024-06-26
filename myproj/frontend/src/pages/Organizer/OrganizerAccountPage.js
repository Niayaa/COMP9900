import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';

const OrganizerAccountPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // Reminder: Handle passwords securely
        phoneNumber:'',
        billAddress:'',
    });
    const navigate = useNavigate();
    const { user,isAuthenticated} = useAuth();
    useEffect(() => {
      // Ensure there's a user and the user has an ID before attempting to fetch data
      if (user && user.id) {
        const fetchUserData = async () => {
          const url = `http://127.0.0.1:8000/org/info/?user_id=${user.id}`;
          
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const newData = data.token;
           // console.log('organizer',data);
            setFormData({
              name: newData.company_name || '',
              email: newData.org_email || '',
              phoneNumber: newData.org_phone || '',
              billAddress: newData.company_address || '',
              // Add other fields as necessary
            });
           // console.log('formdata',formData)
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        
        fetchUserData();
      }
    }, [user]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const toggleEdit = () => {
      setIsEditing(!isEditing);
      if (isEditing) {
        console.log(formData);
        saveUpdatedData();
      }
    };
  
    // Function to send updated data to the Django backend (same as before)
    const saveUpdatedData = async () => {
        const url = `http://127.0.0.1:8000/edit/org/?user_id=${user.id}`;
        try {
          const response = await fetch(url, {
            method: 'PUT', //
            headers: {
              'Content-Type': 'application/json',

            },
            body: JSON.stringify(formData),
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          

          alert('Data saved successfully');
          setIsEditing(false);
        } catch (error) {
          console.error('Failed to save data:', error);

        }
      };
      
  
    return (
        <Box sx={{ display: 'flex' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Welcome Back, {formData.name}</Typography>
          <Grid container spacing={3} marginTop={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Account Information</Typography>
                <TextField
                    label="Organizer Name*"
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={!isEditing}
                />
                <TextField
                    label="Email Address"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={!isEditing}
                />
                <TextField 
                    label="Phone Number" 
                    variant="outlined"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={!isEditing}
                />
                <TextField
                    label="Organizer Address"
                    variant="outlined"
                    type="text"
                    name="billAddress"
                    value={formData.billAddress}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={!isEditing}
                />
                

                <Button variant="contained" color="primary" onClick={toggleEdit}>
                    {isEditing ? 'SAVE' : 'EDIT'}
                </Button>
            </Grid>
          </Grid>
        </Container>
        </Box>
    );
};
  
export default OrganizerAccountPage; 
