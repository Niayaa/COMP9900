// components/Navbar/index.js

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
                <NavLogo to="/">
                    <h1>Event Management</h1> {/* 你可以用图片或SVG代替 */}
                </NavLogo>
				<NavMenu>
					<NavLink to="/events" activeStyle>
						Events
					</NavLink>
                    <NavLink to="/account" activeStyle>
						My account
					</NavLink>
					{/* Second Nav */}
					{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
				</NavMenu>
				<NavBtn>
					<NavBtnLink to="/login">
						Log In
					</NavBtnLink>
				</NavBtn>
			</Nav>
		</>
	);
};

export default Navbar;
