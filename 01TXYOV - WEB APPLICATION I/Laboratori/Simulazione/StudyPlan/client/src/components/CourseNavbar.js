import {Container, Navbar, Form, Button, FormControl} from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import React from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../API';
import './Navbar.css'

function CourseNavbar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [parameter,setParameter] = useState("");

  const notify = () => {
    toast.warning('Empty search field');
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      if(parameter.length===0){
        notify();
      }else{
      
      navigate(`/search/${parameter}`);
      }
}
  const goHome = async () => {
    if(location.pathname==='/editStudyPlan'){
      try{
        const studyPlan = await API.getStudyPlan(props.loggedUser.id);
        props.setStudyPlan(studyPlan.type);
        props.setCredits(studyPlan.credits);
      }catch(error){
        toast.error(error,{ position: "top-center" })
      }
        props.setDirty(true);
      
    }
    navigate("/Home")
  }


	return(
		<Navbar className='navbar navbar-expand-sm bg-success navbar-success' id="navbar"  variant='dark' expand="lg">
      <Container fluid id="container-navbar">
        <Navbar.Brand>
            <i className="bi bi-journal-check"/> Study Plan 
        </Navbar.Brand>
        <Navbar id="navbarScroll">
        <Button id="HomeButton" variant="success" onClick={goHome}>Home</Button>
        <Form id="Search" onSubmit={handleSubmit} noValidate className="d-flex">
          <FormControl 
            type="search"
            placeholder="Search"
            className="me-2 d-none d-md-block"
            aria-label="Search"
            onChange={(e) => {setParameter(e.target.value)} }
            pattern='^.*\S.*$'
          />
        </Form>
        { props.loggedUser &&
          <Button id="logOutButton" variant="success"  onClick={() => {props.handleLogout(); navigate('/Home');}}>{props.loggedUser.id}<br/>Logout</Button>
        }
        { !props.loggedUser && <a href="/Login" className='userIcon' >
              <svg xmlns="http://www.w3.org/2000/svg" color ="white" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
            </a>
        }
        {
          props.loggedUser && <div className="btn d-lg-none" id="UserInfo" style={{backgroundColor: 'green', color: 'white'}}
                  onClick={()=> {props.toggleSidebar()}}>
            <div className="bi bi-person-lines-fill"></div>	
          </div>
        }  
        </Navbar>
      </Container>
    </Navbar>
	);
}

export{CourseNavbar};