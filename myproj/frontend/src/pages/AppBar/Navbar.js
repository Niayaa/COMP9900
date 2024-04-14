import React from 'react';
import { AppBar, Toolbar, Button, Box, MenuItem, Menu } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); // 假设useAuth()返回的user对象包含一个role属性
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 根据用户角色显示不同的菜单项
  const renderMenuItems = () => {
    // 如果用户是组织者
    console.log(user.role);
    if (user && user.role === 'customer') {
      return (
        <>
          <MenuItem onClick={handleClose} component={Link} to="/Cus_Order">My Tickets</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/Cus_Event">Manage Events</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/Cus_Account">Account Information</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/password-reset">Reset Password</MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            logout();
          }}>Logout</MenuItem>
        </>
      );
    } else if (user) { // 如果用户是普通用户
      return (
        <>


          <MenuItem onClick={handleClose} component={Link} to="/Org_Event">Manage events</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/CreateNew">Create New Event</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/Org_Report">Event Report</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/Org_Account">Account Information</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/password-reset">Reset Password</MenuItem>

          <MenuItem onClick={() => {
            handleClose();
            logout();
          }}>Logout</MenuItem>    
        </>
      );
    }

    // 如果没有用户登录，不显示任何菜单项
    return null;
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#16A085' }}>  
      <Toolbar>
        {/* Logo图像和链接 */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/MainPage">Home</Button>
          <Button color="inherit" component={Link} to="/events">Events</Button>
          <Button color="inherit" component={Link} to="/Contact">Contact Us</Button>
        </Box>

        {user ? (
          <div>
            <Button color="inherit" onClick={handleMenu}>{user.name || 'Account'}</Button>
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
              {renderMenuItems()}
            </Menu>
          </div>  
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/SignUpPage">Signup</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
