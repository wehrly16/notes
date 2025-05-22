import { Link } from "react-router-dom";
//import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes.tsx";
import { useState, useEffect } from "react";
import { AppContext, AppContextType } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";



function App() {

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        onError(error);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
    nav("/login");
  }
  

  return (
    !isAuthenticating && (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
      <Navbar.Brand as={Link} to="/" className="fw-bold text-muted">Scratch</Navbar.Brand>           
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Nav activeKey={window.location.pathname}>   

{isAuthenticated ? (
    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
  ) : (
    <> 
             
        <Nav.Link as={Link} to="/Signup">Signup</Nav.Link>                 
        <Nav.Link as={Link} to="/Login">Login</Nav.Link>
         
        </>
  )} 
         
         </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated } as AppContextType} >
  <Routes />
</AppContext.Provider>

    </div>
    )
  );
}

export default App;
