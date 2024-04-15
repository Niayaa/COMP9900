import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  Divider,
  IconButton,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Grid,
  Typography
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MuiDrawer from '@mui/material/Drawer';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom';


const CustomerEventPage = () => {
  const [currentView, setCurrentView] = useState("interests");
  const [interests, setInterests] = useState([]);
  const [collections, setCollections] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPreferredEvents = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/cus/event_recommend/?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // 假设返回的是数组
    } catch (error) {
      console.error("Failed to fetch preferred events:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchPreferredEvents().then(data => {
      const newdata = data.token;
      setInterests(newdata); // 设置感兴趣的事件
      console.log(newdata);
     // 根据事件类型动态创建 collections
     const eventsByType = newdata.reduce((acc, event) => {
      const type = event.event_type; // 'event_type' is a string
      acc[type] = acc[type] ? [...acc[type], event] : [event];
      return acc;
    }, {});

    // Create collections from the grouped events
    const newCollections = Object.entries(eventsByType).map(([type, events]) => ({
      interestType: type,
      events,
    }));

    setCollections(newCollections); 
      
    });
  }, [user]); 
   
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEventSelection = (eventType) => {
    setCurrentView(eventType);
  };

  const goToEventPage = (eventId) => {
    navigate("/eventpage", {
      state: {
        ID: eventId,
        user_id: user.id,
      },
    });
  };



  const drawerWidth = 150;
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={drawerOpen}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
       
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
          {['interests', 'collections'].map((text) => (
            <ListItemButton key={text} onClick={() => handleEventSelection(text.toLowerCase())}>
              <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Box sx={{
        backgroundImage: 'linear-gradient(45deg, #16A085 30%, #D4EFDF 90%)',
        borderRadius: 1,
        p: 1,
      }}>
        <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
          Recommendation
        </Typography>
        </Box>
        <Grid container spacing={2}>
          {currentView === 'interests' && interests.map((interest) => (
            <Grid item xs={12} md={6} lg={4} key={interest.event_id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{interest.event_name}</Typography>
                <Typography>{interest.address}</Typography>
                <Typography>{interest.event_description}</Typography>
                <Button variant="outlined" onClick={() => goToEventPage(interest.event_id)}>View Event</Button>
              </Paper>
            </Grid>
          ))}
          {currentView === 'collections' && collections.map((collection) => (
            <Grid item xs={12} key={collection.interestType}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{collection.interestType} Events</Typography>
              {collection.events.map(event => (
                <Paper key={event.event_id} sx={{ p: 2, mt: 1 }}>
                  <Typography>{event.event_name}: {event.event_description}</Typography>
                  <Button variant="outlined" onClick={() => goToEventPage(event.event_id)}>View Event</Button>
                </Paper>
              ))}
            </Grid>
          ))}
        </Grid>
        </main>
    </Box>
  );
}  

export default CustomerEventPage;

