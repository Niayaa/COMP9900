import React,{ useState } from 'react';
import { Container, 
    Grid, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    InputLabel, 
    Select, 
    MenuItem,
    FormControl,
    Chip } from '@mui/material';
import {useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const CustomerAccountPage = ({ existingData = {
    Name: 'John',
    email: 'john.doe@example.com',
    password: 'password123', // Reminder: Handle passwords securely
    age: '',
    gender: 'female',
    phoneNumber:'+61 0428742462',
    billAddress:'114 Andrew St.',
    userType: 'Customer'
  }}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({...existingData});
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const toggleEdit = () => {
      setIsEditing(!isEditing);
      if (isEditing) {
        // When toggling from editing to not editing, save the data
        saveUpdatedData();
      }
    };
  
    // Function to send updated data to the Django backend
    const saveUpdatedData = async () => {
      const url = '/api/customer/update/'; // Adjust this to your API endpoint
      // For CSRF token, you might need to adjust based on how your Django app is set up
      // This is just one common approach
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  
      try {
        const response = await fetch(url, {
          method: 'PUT', // Use PUT for updating existing resource
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Success:', data);
        // Optionally navigate to another page or show success message
      } catch (error) {
        console.error('Error:', error);
        // Optionally show error message to user
      }
    };
  
      const concertInfoArray=[];
  
  
      concertInfoArray[0] = {ConcertTitle: "TAYLOR SWIFT | THE ERAS TOUR", Date: "THUR, MAR 7, 2024"}
      
      async function handleEventPage() { 
          //对于每个event标签卡 button或者card 点击跳转 会传concert信息给eventpage
          //（应该是每个event标签卡的json数组里也会存着id和Info，然后读取对应的信息传递）
          
          console.log(concertInfoArray)
          navigate('/eventpage', {state:  concertInfoArray })
          
      }
      const handleDelete = () => {
          console.info('You clicked the delete icon.');
        };
  
      const [selectedCategory, setSelectedCategory] = React.useState('booked');
  
    // Function to handle category change
      const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      }; 
      
      
      const [open, setOpen] = React.useState(true);
      const toggleDrawer = () => {
        setOpen(!open);
      };
    
      const { user } = useAuth();
      return (
        <Box sx={{ display: 'flex' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Welcome Back {user.name}</Typography>
          <Grid container spacing={3} marginTop={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Account Information</Typography>
              <TextField
                    label="Name*"
                    variant="outlined"
                    name="firstName"
                    value={formData.firstName}
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
                <InputLabel>Age area</InputLabel>
                <Select
                name="age"
                value={formData.age}
                label="Age area"
                onChange={handleChange}
                margin="normal"
                disabled={!isEditing}
                >
                {/* Replace these with your actual age ranges */}
                <MenuItem value={10}>10-20</MenuItem>
                <MenuItem value={20}>21-30</MenuItem>
                <MenuItem value={30}>31-40</MenuItem>
                <MenuItem value={40}>41-50</MenuItem>
                </Select>
                <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                    <Select
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange}
                    disabled={!isEditing}
                    >
                    {/* Replace these with your actual gender options */}
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={toggleEdit}>
                    {isEditing ? 'SAVE' : 'EDIT'}
                </Button>
            </Grid>
  
            <Grid item xs={12} md={6}>
            <Typography variant="h6">Interest tags</Typography>
            <Grid container spacing={1}>
                {/* Loop through your event types and render chips */}
                {['Event type 1', 'Event type 2', 'Event type 3', 'Event type 4', 'Event type 5', 'Event type 6'].map((type, index) => (
                <Grid item key={index}>
                    <Chip label={type} onDelete={handleDelete} />
                </Grid>
                ))}
            </Grid>
            <TextField 
                label="Phone number" 
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
                fullWidth
                disabled={!isEditing}
            />
            <TextField
                label="Payment bill address"
                type="text"
                name="billAddress"
                value={formData.billAddress}
                onChange={handleChange}
                margin="normal"
                disabled={!isEditing}
                multiline
                fullWidth
                rows={4}
            />
            </Grid>
          </Grid>
        </Container>
        </Box>
    );
  };
  
  // Example of how to use the component with existing data
  
  export default CustomerAccountPage;