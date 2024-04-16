import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';

export const DrawerListItems = ({ onItemSelected }) => (
  <React.Fragment>
    <ListItemButton onClick={() => onItemSelected('upcoming')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Upcoming" />
    </ListItemButton>
    <ListItemButton onClick={() => onItemSelected('past')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Past" />
    </ListItemButton>
  </React.Fragment>
);


export const DrawerEventLists = ({ onItemSelected }) => (
  <React.Fragment>
    <ListItemButton onClick={() => onItemSelected('interest')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Interest" />
    </ListItemButton>
    <ListItemButton onClick={() => onItemSelected('popular')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Popular" />
    </ListItemButton>
    <ListItemButton onClick={() => onItemSelected('collection')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Collection" />
    </ListItemButton>
  </React.Fragment>
);

export const DrawerOrganzierLists = ({ onItemSelected }) => (
  <React.Fragment>
    <ListItemButton onClick={() => onItemSelected('upcoming')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Upcoming Event" />
    </ListItemButton>
    <ListItemButton onClick={() => onItemSelected('past')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Past Event" />
    </ListItemButton>
  </React.Fragment>
);

