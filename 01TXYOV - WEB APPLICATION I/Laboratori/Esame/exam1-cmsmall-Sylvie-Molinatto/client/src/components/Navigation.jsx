import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button, FormControl} from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LogoutButton } from './AuthComponents';
import API from '../API';

const Navigation = (props) => {
  const navigate = useNavigate();
  const [shouldReload, setShouldReload] = useState(false);
  const [editableWebsiteName, setEditableWebsiteName] = useState('');
  const [editingWebsiteName, setEditingWebsiteName] = useState(false);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isAdmin = props.user ? props.user.role === 'Admin' : false;

  const handleWebsiteNameChange = (event) => {
    setEditableWebsiteName(event.target.value);
  };

  const saveWebsiteName = async () => {
    try {
      if(editableWebsiteName===""){
        setErrorMessage('Website name cannot be empty');
        setShow(true);
        return;
      }
      await API.updateWebsiteName(editableWebsiteName);
      // Update the website name in the parent component's state
      //setEditableWebsiteName(websiteName.name);
      setShouldReload(true);
    } catch (err) {
      // Handle the error if needed
      props.handleErrors(err);
    }
  };

  useEffect(() => {
    if (shouldReload) {
      window.location.reload();
    }
  }, [shouldReload]);

  return (
    <Navbar bg="dark" expand="sm" variant="dark" fixed="top" className="navbar-padding">
      <Link to="/" className='navbar-brand-link'>
        <Navbar.Brand>
          <i className="bi bi-body-text icon-size" /> {props.websiteName.name}
        </Navbar.Brand>
      </Link>
      {props.loggedIn && isAdmin && (
      <Button  variant="dark" onClick={() => setEditingWebsiteName(true)}>
        <i className="bi bi-pencil-square"></i>
      </Button>
      )}
      {props.loggedIn && isAdmin && editingWebsiteName && (
          <>
            <FormControl type="text" required={true} value={editableWebsiteName} onChange={handleWebsiteNameChange} className='form-nav'/>
            <Button variant="success" onClick={saveWebsiteName} className='button'>
              Save
            </Button>
            <Alert className='alert-small'
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
            </Alert>
          </>
        )}
      <Nav className='ms-auto'>
      {props.loggedIn ? 
      <>
            <NavLink to="/" className="nav-link">Front Office</NavLink> 
            <NavLink to="/back-office" className="nav-link">Back Office</NavLink> </>
             : <></>
      }
      </Nav>
      <Nav className="ms-auto">
        <Navbar.Text className="mx-2">
          {props.user && props.user.name && `Welcome, ${props.user.name}!`}
        </Navbar.Text>
        <Form className="mx-2">
          {props.loggedIn ? (
              <LogoutButton logout={props.logout} />
          ) : (
            <Button variant="success" className='button-nav' onClick={() => navigate('/login')}>Login</Button>
          )}
        </Form>
      </Nav>
    </Navbar>
  );
}

export { Navigation }; 