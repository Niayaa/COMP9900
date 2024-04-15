 
import React, { useState,useEffect  } from "react";
import { Container, 
    Grid, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    Box, 
    Card, 
    CardContent, 
    Stack, 
    InputLabel, 
    Select, 
    MenuItem,
    FormControl,
    Toolbar,
    IconButton,
    Chip } from '@mui/material';
import { Link } from "react-router-dom";
import MuiAppBar from '@mui/material/AppBar';
import {useNavigate } from "react-router-dom";
import MuiDrawer from '@mui/material/Drawer';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {DrawerOrganzierLists} from "../listItems";
import { UpcomingEvents,PastEvents} from '../Org_Event/EventLists';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History'; 
import OrganizerAccountPage from "./OrganizerAccountPage";
import { useAuth } from "../AuthContext";

const OrganizerEventPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

    
    const drawerWidth = 240;
    
    //for drawer
    const AppBar = styled(MuiAppBar, {
      shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    }));

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
    
    const handleDrawerToggle = () => {
      setDrawerOpen(!drawerOpen);
    };
  
    const handleEventSelection = (eventType) => {
      setSelectedEventType(eventType);
    };

  const [selectedEventType, setSelectedEventType] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const {user} = useAuth();
  useEffect(() => {
    if (user && user.id) {
      const fetchUserData = async () => {
        const url = `http://127.0.0.1:8000/created_events/?user_id=${user.id}`;
        
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
          const responseData = await response.json();
  
          if (responseData.code === '1') {
            const events = responseData.token; // Access the actual events array
            console.log('Order',responseData);
            const today = new Date();
            const upcoming = events.filter(event => new Date(event.event_date) >= today);
            const past = events.filter(event => new Date(event.event_date) < today);
            setUpcomingEvents(upcoming);
            setPastEvents(past);
          } else {
            console.error('Failed to fetch events:', responseData.message);
          }
        } catch (error) {
          console.error("Failed to fetch events:", error.message);
        }
      };
      
      fetchUserData();
    }
  }, [user]);
    
      /*
      Organizer Created Event:
      all of created event: send to back-end: user.id
      response:
      event.name,event.date,event.address
      ticket.id, ticket.seat, ticket.price, ticket.amount, ticket.remain

      Event: TS Era 
      date: 2024/03
      address: olypimic park

      ticket.id:001
      ticket.seat:Reserve A
      ticket.price:278
      ticket.amount:200
      ticket.remain:70

      ticket.id:002
      ticket.seat:Reserve B
      ticket.price:128
      ticket.amount:300
      ticket.remain:120
      
      ticket.id:003
      ...
      */
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
        <List component="nav">
          <DrawerOrganzierLists onItemSelected={handleEventSelection} />
        </List>
      </Drawer>

     
      <main style={{ flexGrow: 1, padding: '20px' }}>
      <Box sx={{
      backgroundImage: 'linear-gradient(45deg, #16A085 30%, #D4EFDF 90%)',
      borderRadius: 1,
      p: 1,
    }}>
      <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
        Events
      </Typography>
      </Box>
        {selectedEventType === 'upcoming' && <UpcomingEvents events={upcomingEvents} userId={user.id}/>}
        {selectedEventType === 'past' && <PastEvents events={pastEvents} userId={user.id}/>}
      </main>
    </Box>
    );
};
 
export default OrganizerEventPage;