import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes.tsx";



function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
      <Navbar.Brand as={Link} to="/" className="fw-bold text-muted">Scratch</Navbar.Brand>           
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Nav activeKey={window.location.pathname}>        
        <Nav.Link as={Link} to="/Signup">Signup</Nav.Link>                 
        <Nav.Link as={Link} to="/Login">Login</Nav.Link>
         </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
