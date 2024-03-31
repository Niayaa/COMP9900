import React, { useState,useEffect } from 'react';
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

const CustomerAccountPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // Reminder: Handle passwords securely
        phoneNumber:'',
        billAddress:'',
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchOrganizerData = async () => {
        // 示例URL - 你需要将其替换为你的实际API端点
        const response = await fetch('/api/organizer/data');
        const data = await response.json();
        setFormData({
            name: data.company_name || '',
            email: data.org_email || '',
            password: '', // 密码通常不通过API传输
            phoneNumber: data.org_phone || '',
            billAddress: data.company_address || '',
        });
        };
        
        fetchOrganizerData().catch(console.error);
    }, []);
  
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const toggleEdit = () => {
      setIsEditing(!isEditing);
      if (isEditing) {
        saveUpdatedData();
      }
    };
  
    // Function to send updated data to the Django backend (same as before)
    const saveUpdatedData = async () => {
      // Your existing saveUpdatedData function logic
    };
  
    return (
        <Box sx={{ display: 'flex' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Welcome Back, {formData.name}</Typography>
          <Grid container spacing={3} marginTop={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Account Information</Typography>
                <TextField
                    label="Name*"
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
                    label="Password"
                    variant="outlined"
                    type="password"
                    name="password"
                    value={formData.password}
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
                    label="Billing Address"
                    variant="outlined"
                    type="text"
                    name="billAddress"
                    value={formData.billAddress}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={!isEditing}
                />
                <FormControl fullWidth margin="normal">
                <InputLabel>Preferred Event Type</InputLabel>
                    <Select
                    name="preferType"
                    value={formData.preferType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    >
                    <MenuItem value="live">Live</MenuItem>
                    <MenuItem value="concert">Concert</MenuItem>
                    <MenuItem value="opera">Opera</MenuItem>
                    <MenuItem value="show">Show</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                <InputLabel>Age Area</InputLabel>
                    <Select
                    name="ageArea"
                    value={formData.ageArea}
                    onChange={handleChange}
                    disabled={!isEditing}
                    >
                    <MenuItem value="0-18">0-18</MenuItem>
                    <MenuItem value="19-40">19-40</MenuItem>
                    <MenuItem value="40-60">40-60</MenuItem>
                    <MenuItem value="60+">60+</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                <InputLabel>Gendar</InputLabel>
                    <Select
                    name="gendar"
                    value={formData.gendar}
                    onChange={handleChange}
                    disabled={!isEditing}
                    >
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="PreferNotoSay">Prefer no to say</MenuItem>
                    </Select>
                </FormControl>
                

                <Button variant="contained" color="primary" onClick={toggleEdit}>
                    {isEditing ? 'SAVE' : 'EDIT'}
                </Button>
            </Grid>
          </Grid>
        </Container>
        </Box>
    );
};
  
export default CustomerAccountPage; 
