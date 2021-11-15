import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Nav,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { UserContext } from "../../Context/UserContext";
import Logo from "../../Static/Musicify.png";

function Header() {
  const Context = useContext(UserContext);
  const [isOpen, setIsopen] = useState(false);
  const toggler = () => setIsopen(!isOpen);

  const handleLogout = () => {
    Context.setUser(null);
    localStorage.setItem("user", null);
    toast("Logout Successfully", { type: "info", theme: "dark" });
  };

  return (
    <Navbar light expand="md px-4">
      <NavbarBrand tag={Link} to="/">
        <img src={Logo} className="navbarBrandLogo" alt="Musicify" />
      </NavbarBrand>
      <NavbarToggler onClick={toggler} className="mr-2" />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          {Context.user ? (
            <>
              <NavLink className="text-light fw-bold nav-item-discover alink">
                Discover
              </NavLink>
              <NavLink
                tag={Link}
                to="/library"
                className="text-light fw-bold nav-item-discover alink"
              >
                My Library
              </NavLink>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="text-white">
                  {Context.user?.email}
                </DropdownToggle>
                <DropdownMenu className="bg-secondary" right>
                  <DropdownItem>Profile</DropdownItem>

                  <DropdownItem divider />
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            <>
              <NavLink
                tag={Link}
                to="/register"
                className="text-white fw-bold mx-md-2 nav-toggler-md alink"
              >
                Join
              </NavLink>
              <NavLink
                tag={Link}
                to="/login"
                className="text-white fw-bold mx-md-5  alink"
              >
                Sign in
              </NavLink>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Header;