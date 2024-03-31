// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Button, Box, MenuItem, Menu } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // ... 其他代码

  return (
    <AppBar position="static" sx={{ backgroundColor: '#226b80' }}>  
      <Toolbar>
        {/* ... Logo图像和链接 ... */}
         <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/MainPage">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/events">
            Events
          </Button>
          <Button color="inherit" component={Link} to="/Contact">
            Contact Us
          </Button>
            </Box>

          <div>
            <Button color="inherit" onClick={handleMenu}>
              {user.name}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to="/Cus_Order">My Tickets</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/Cus_Event">Manage Events</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/Cus_Account">Account Information</MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                logout();
              }}>Logout</MenuItem>
            </Menu>
          </div>

          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/SignUpPage">
              Signup
            </Button>
          </>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
