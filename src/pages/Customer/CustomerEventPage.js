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

const fetchInterests = () => {
  return [
    { id: 1, title: "Interest 1", description: "Description for Interest 1" },
    { id: 2, title: "Interest 2", description: "Description for Interest 2" },
  ];
};

const fetchCollections = () => {
  return [
    {
      id: 1,
      interestType: "Music",
      events: [
        { eventId: 1, title: "Concert A", description: "A great concert" },
        { eventId: 2, title: "Concert B", description: "Another great concert" },
      ],
    },
    {
      id: 2,
      interestType: "Art",
      events: [
        { eventId: 3, title: "Exhibition A", description: "A great exhibition" },
      ],
    },
  ];
};

const fetchAllEvents = () => {
  return [
    { eventId: 1, title: "Concert A", description: "A great concert" },
    { eventId: 2, title: "Concert B", description: "Another great concert" },
    { eventId: 3, title: "Exhibition A", description: "A great exhibition" },
  ];
};


const CustomerEventPage = () => {
  const [currentView, setCurrentView] = useState("interests");
  const [interests, setInterests] = useState([]);
  const [collections, setCollections] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(true);

  useEffect(() => {
    setInterests(fetchInterests());
    setCollections(fetchCollections());
    setAllEvents(fetchAllEvents());
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleEventSelection = (eventType) => {
    setCurrentView(eventType);
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
    <Divider />
        <List>
          {['interests', 'collections', 'all Events'].map((text) => (
            <ListItemButton key={text} onClick={() => handleEventSelection(text)}>
              <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
          <Box sx={{
          backgroundImage: 'linear-gradient(45deg, #16A085 30%, #D4EFDF 90%)',
          borderRadius: 1,
          p: 1,
        }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
            Events
          </Typography>
        </Box>
        <main style={{ flexGrow: 1, padding: '20px'}}>
          
          <Grid container spacing={2}>
            {currentView === 'interests' && interests.map((interest) => (
              <Grid item xs={12} key={interest.id}>
                <Paper>{interest.title}: {interest.description}</Paper>
              </Grid>
            ))}
            {currentView === 'collections' && collections.map((collection) => (
              <Grid item xs={12} key={collection.id}>
                <Paper>{collection.interestType}: {collection.events.map(event => `${event.title}: ${event.description}`).join(', ')}</Paper>
              </Grid>
            ))}
            {currentView === 'all Events' && allEvents.map((event) => (
              <Grid item xs={12} key={event.eventId}>
                <Paper>{event.title}: {event.description}</Paper>
              </Grid>
            ))}
          </Grid>
        </main>
      </Box>
    </Box>
  );
}

export default CustomerEventPage;

