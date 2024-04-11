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
  const { user } = useAuth(); // 使用useAuth获取当前用户信息

  const fetchPreferredEvents = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${userId}/preferred-events/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const preferredEvents = await response.json();
      console.log(preferredEvents);
      return preferredEvents;
    } catch (error) {
      console.error("Failed to fetch preferred events:", error);
      return [];
    }
  };  

  const fetchAllEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/events_grouped)'); // 你的后端API端点
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      return data; // 返回解析后的JSON数据
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      throw error; // 将错误向上抛，以便可以在调用时捕获
    }
  };
  

  useEffect(() => {
  // 假设 fetchInterests 返回用户偏好的事件
  if (user && user.id) { 
    fetchPreferredEvents(user.id).then(data => {
      setInterests(data);
    });
  }

  // 假设 fetchAllEvents 返回所有事件
  fetchAllEvents().then(data => {
    setAllEvents(data); // 设置所有事件的状态

    // 动态创建 collections
    const eventsByType = data.reduce((acc, event) => {
      const { type } = event;
      acc[type] = acc[type] ? [...acc[type], event] : [event];
      return acc;
    }, {});

    const newCollections = Object.entries(eventsByType).map(([type, events]) => ({
      interestType: type,
      events,
    }));

    setCollections(newCollections); // 设置根据类型分类的事件集状态
  }).catch(error => {
    console.error('Failed to fetch events:', error);
    // 在这里处理错误，例如设置一个错误状态来在UI中显示
  });
}, [user]); // 依赖于 user 状态，确保在用户信息变化时重新获取数据
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
              <Grid item xs={12} md={6} lg={4} key={interest.id}>
                <Paper elevation={3} sx={{ padding: 2, margin: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="h2" sx={{ marginBottom: 1 }}>
                    {interest.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    {interest.description}
                  </Typography>
                  {/* 假设interest对象包含date和location属性 */}
                  <Typography variant="body2" color="text.secondary">
                    Date: {interest.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {interest.location}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            {currentView === 'collections' && collections.map((collection) => (
                <Grid item xs={12} key={collection.interestType}>
                  <Paper>
                    <Typography variant="h6">{collection.interestType} Events</Typography>
                    {collection.events.map(event => (
                      <div key={event.eventId}>{event.title}: {event.description}</div>
                    ))}
                </Paper>
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

