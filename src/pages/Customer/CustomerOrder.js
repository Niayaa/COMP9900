 
import React, { useState,useEffect  } from "react";
import { Container, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  IconButton, 
  CssBaseline, 
  Drawer, 
  List, 
  Divider  } from '@mui/material';
import { Link } from "react-router-dom";
import MuiAppBar from '@mui/material/AppBar';
import {useNavigate } from "react-router-dom";
import MuiDrawer from '@mui/material/Drawer';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {DrawerListItems} from "../listItems";
import { UpcomingEvents,PastEvents} from '../Cus_EventList/EventLists';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History'; 
import { useAuth } from "../AuthContext";

const DrawerWidth = 240;

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DrawerWidth,
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
}));


const CustomerOrderPage = () => {
  const { user } = useAuth();
  const [ticketsWithEvents, setTicketsWithEvents] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState('upcoming');

  // Replace with your actual API endpoint
  const fetchUserTicketsAndEvents = async (userId) => {
    const ticketsResponse = await fetch(`/api/user-tickets/${userId}`);
    if (!ticketsResponse.ok) throw new Error('Failed to fetch tickets');
    const tickets = await ticketsResponse.json();

    const eventsPromises = tickets.map(async (ticket) => {
      const eventResponse = await fetch(`/api/event-details/${ticket.eventId}`);
      if (!eventResponse.ok) throw new Error('Failed to fetch event details');
      const event = await eventResponse.json();
      return { ...ticket, event };
    });

    return Promise.all(eventsPromises);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserTicketsAndEvents(user.id)
        .then(setTicketsWithEvents)
        .catch(error => console.error("Error fetching tickets or event details:", error));
    }
  }, [user]);
      
  const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
      };
    
  const handleEventSelection = (eventType) => {
        setSelectedEventType(eventType);
      };  

    return (
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <StyledDrawer variant="permanent" open={drawerOpen}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <DrawerListItems onItemSelected={handleEventSelection} />
        </List>
      </StyledDrawer>

     
      <main style={{ flexGrow: 1, padding: '20px' }}>
      <Box sx={{
      backgroundImage: 'linear-gradient(45deg, #16A085 30%, #D4EFDF 90%)',
      borderRadius: 1,
      p: 1,
    }}>
      <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
        Tickets
      </Typography>
      </Box>
      <Grid container spacing={3}>
          {ticketsWithEvents.map(({ id, event, type, amount, price }) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>{event.name}</Typography>
                <Typography variant="body1">{event.description}</Typography>
                <Typography variant="body2" color="textSecondary">Date: {new Date(event.date).toLocaleDateString()}</Typography>
                <Typography variant="body2" color="textSecondary">Location: {event.address}</Typography>
                <Typography variant="body2">Ticket Type: {type}</Typography>
                <Typography variant="body2">Amount: {amount}</Typography>
                <Typography variant="body2">Price: ${price}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </main>
    </Box>
    );
};
 
export default CustomerOrderPage;