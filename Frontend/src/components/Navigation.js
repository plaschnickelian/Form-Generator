import { Navbar, Container } from "react-bootstrap";
import { Component } from "react";
import NavItem from './admin/NavItem'
import NavitemUser from './user/NavItemUser'

class Navigation extends Component {
  render() {

    const panel = this.props.panel

    return (
      <Navbar>
        <Container>
          {panel === "admin" ? <NavItem /> : <NavitemUser />}
        </Container>
      </Navbar>
    );
  }
}
export default Navigation