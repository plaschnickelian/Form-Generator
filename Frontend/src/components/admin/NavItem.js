import { Link } from "react-router-dom";
import * as Icons from "react-icons/fa";
import { Nav } from "react-bootstrap";
import React from 'react';
import { useLocation } from "react-router-dom";

const NavItem = () => {

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
      <Nav defaultActiveKey="home" activeKey={activeKey} className="mr-auto">

        <Nav.Item id="nav-item-1">
          <Nav.Link as={Link} to="/admin" eventKey="/admin"><Icons.FaHome size={28} />{' '}<span>Home</span></Nav.Link>
        </Nav.Item>
        <Nav.Item id="nav-item-2">
          <Nav.Link as={Link} to="/admin/users" eventKey="/admin/users"><Icons.FaUsers size={28} />{' '}<span>Benutzer</span></Nav.Link>
        </Nav.Item>
        {/* <Nav.Item id="nav-item-3" className="sub-item">
            <Nav.Link className="sub-item" as={Link} to="/admin/users/create" eventKey="users"><span>Neuanlage</span></Nav.Link>
        </Nav.Item> */}
        <Nav.Item id="nav-item-4">
          <Nav.Link as={Link} to="/admin/projects" eventKey="/admin/projects"><Icons.FaProjectDiagram size={28} />{' '}<span>Projekte</span></Nav.Link>
        </Nav.Item>
        <Nav.Item id="nav-item-5">
          <Nav.Link as={Link} to="/admin/offer-types" eventKey="/admin/offer-types"><Icons.FaHandsHelping size={28} />{' '}<span>Angebotstypen</span></Nav.Link>
        </Nav.Item>
        <Nav.Item id="nav-item-6">
          <Nav.Link as={Link} to="/admin/export" eventKey="/admin/export"><Icons.FaDatabase size={28} />{' '}<span>Datenexport</span></Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  )
}; export default NavItem;
