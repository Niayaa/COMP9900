 
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
import { UpcomingEvents,PastEvents} from '../Cus_EventList/EventLists';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History'; 
import OrganizerAccountPage from "./OrganizerAccountPage";

const allEvents = [
    { id: 1, name: 'Event 1', address: '123 Main St', date: '2024-07-21' },
    { id: 2, name: 'Event 2', address: '456 Broadway', date: '2023-12-15' },
    { id: 3, name: 'Event 3', address: '789 Elm St', date: '2024-03-10' },

  ];

const OrganizerEventPage = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const concertInfoArray=[];
    const navigate = useNavigate();
  
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

    useEffect(() => {
        const today = new Date();
        const upcoming = allEvents.filter(event => new Date(event.date) >= today);
        const past = allEvents.filter(event => new Date(event.date) < today);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      }, []);   

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
        {selectedEventType === 'upcoming' && <UpcomingEvents events={upcomingEvents} />}
        {selectedEventType === 'past' && <PastEvents events={pastEvents} />}
      </main>
    </Box>
    );
};
 
export default OrganizerEventPage;