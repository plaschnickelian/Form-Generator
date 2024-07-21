import { Link } from "react-router-dom";
import * as Icons from "react-icons/fa";
import { Nav } from "react-bootstrap";
import React from 'react';
import { useLocation } from "react-router-dom";


const NavItemUser = () => {

  //const [activeLink, setActiveLink] = useState();
  const location = useLocation();
  const locationParts = location.pathname.split("/");
  let activeKey = "";


  if (locationParts.length >= 3) {
    activeKey = "/" + locationParts[1] + "/" + locationParts[2];
  } else {
    activeKey = "/" + locationParts[1];
  }

  return (
    <>
      <Nav defaultActiveKey="user" activeKey={activeKey} className="mr-auto">

        <Nav.Item id="nav-item-1">
          <Nav.Link as={Link} to="/user" eventKey="/user"><Icons.FaHome size={28} />{' '}<span>Home</span></Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  )
}; export default NavItemUser;
