 
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


const allEvents = [
    { id: 1, name: 'Event 1', address: '123 Main St', date: '2024-07-21' },
    { id: 2, name: 'Event 2', address: '456 Broadway', date: '2023-12-15' },
    { id: 3, name: 'Event 3', address: '789 Elm St', date: '2024-03-10' },

  ];

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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { user } = useAuth(); // 使用useAuth获取当前用户信息
  const [tickets, setTickets] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('upcoming');

  const fetchUserTicketsAndEvents = async () => {
    // 假设 "/api/user-tickets" 返回当前用户的所有票据及其对应的事件信息
    const response = await fetch(`/api/user-tickets?userId=${user.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user tickets and event details');
    }
    return await response.json();
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserTicketsAndEvents()
        .then(setTickets)
        .catch(error => console.error("Error fetching tickets or event details:", error));
    }
  }, [user]);

  const filterEventsByType = (type) => {
    const today = new Date();
    return tickets.filter(({ event }) => {
      const eventDate = new Date(event.date);
      return type === 'upcoming' ? eventDate >= today : eventDate < today;
    });
  };
      
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
      <Grid container spacing={2}>
          {filterEventsByType(selectedEventType).map(({ event, id, type, amount, price }) => (
            <Grid item xs={12} md={6} key={id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">{event.name}</Typography>
                <Typography color="textSecondary">{event.date} at {event.address}</Typography>
                <Typography>Ticket ID: {id}, Type: {type}, Amount: {amount}, Price: ${price}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </main>
    </Box>
    );
};
 
export default CustomerOrderPage;