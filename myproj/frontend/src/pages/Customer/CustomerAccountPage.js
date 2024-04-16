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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  Chip
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const TagSelector = ({ category, tags, onChange }) => {
  return (
    <FormControl component="fieldset" sx={{ mt: 2 }}>
      <FormLabel component="legend">{category.charAt(0).toUpperCase() + category.slice(1)} Tags</FormLabel>
      <FormGroup>
        {tags.map((tag, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox checked={tag.checked} onChange={(e) => onChange(index, e.target.checked)} />}
            label={tag.name}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

const CustomerAccountPage = () => {
  const categories = {
    interests: ['rock', 'pop', 'electronic', 'jazz', 'acoustic', 'indie', 'folk', 'blues', 'country', 'reggae','magic', 'dance', 'circus', 'drama', 'puppetry', 'illusion', 'mime', 'ballet', 'opera', 'theater','standup', 'improv', 'satire', 'sketch', 'dark', 'parody', 'slapstick', 'absurdist', 'observational', 'situational','classic', 'modern', 'experimental', 'baroque', 'romantic', 'italian', 'german', 'french', 'russian', 'english'],
  };
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phoneNumber: '',
      billAddress: '',
      preferType: '',
      age_area: '',
      gender: '',
      prefer_tags: [],
  });

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      const fetchUserData = async () => {
        const response = await fetch(`http://127.0.0.1:8000/cus/info/?user_id=${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('logcus',data);
        setFormData({
          name: data.cus_name || '',
          email: data.cus_email || '',
          phoneNumber: data.cus_phone || '',
          billAddress: data.bill_address || '',
          gender: data.gender || 'Prefer Not to Say',
          age_area: data.age_area || '0-18',
          prefer_tags: data.prefer_tags || [],
          preferType: data.prefer_type || '',
        });
      };

      fetchUserData().catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index, isChecked) => {
    const tag = categories.interests[index];
    setFormData(prev => ({
      ...prev,
      prefer_tags: isChecked
        ? [...prev.prefer_tags, tag]
        : prev.prefer_tags.filter(t => t !== tag)
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      saveUpdatedData();
      console.log('Edit account',formData);
    }
  };

  const saveUpdatedData = async () => {
    const url = `http://127.0.0.1:8000/edit/cus/?user_id=${user.id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cus_name: formData.name,
          cus_email: formData.email,
          cus_phone: formData.phoneNumber,
          bill_address: formData.billAddress,
          gender: formData.gender,
          age_area: formData.age_area,
          prefer_tags: formData.prefer_tags
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert('Data saved successfully');
      setIsEditing(false); // Close edit mode
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
                            name="age_area"
                            value={formData.age_area}
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
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Prefer Not to Say">Prefer not to say</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                    <TagSelector
                          category="Interests"
                          tags={categories.interests.map(tag => ({
                            name: tag,
                            checked: formData.prefer_tags.includes(tag)
                          }))}
                          onChange={handleTagChange}
                          disabled={!isEditing}
                        />
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={toggleEdit}>
                        {isEditing ? 'Save' : 'Edit'}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    </Box>
);

};
  
export default CustomerAccountPage; 
