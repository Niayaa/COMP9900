import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavLogo,
} from "./NavbarElements";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
<<<<<<< HEAD
        <NavLogo to="/">
=======
        <NavLogo to="/MainPage">
>>>>>>> Zzx-New
          <h1>Event Management</h1> {/* 你可以用图片或SVG代替 */}
        </NavLogo>
        <NavMenu>
          <NavLink to="/events" activeStyle>
            Events
          </NavLink>
<<<<<<< HEAD
          <NavLink to="/account" activeStyle>
=======
          <NavLink to="/MyAccount" activeStyle>
>>>>>>> Zzx-New
            My account
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/login">Log In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
