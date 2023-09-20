import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import {Button,Form} from 'react-bootstrap';
import {useState} from 'react';

function NavHeader() {
  return (
      <Navbar className="navbar navbar-dark bg-primary" sticky='top'>
        
        <Button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#left-sidebar" aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar">
          <span className="navbar-toggler-icon"></span>
        </Button>

        <Container fluid>
          <Navbar.Brand href="index.html" className="navbar-brand">
            <Button>
              <i className="bi bi-collection-play" bg="light"></i>
            </Button>
            Film Library
          </Navbar.Brand>
          
          <Form.Group className="form-inline my-2 my-lg-0 mx-auto d-none d-md-block" action="#" role="search" aria-label="Quick search">
            <Form.Control className="form-control me-md-2" type="search" placeholder="Search" aria-label="Search query"></Form.Control>
          </Form.Group>

          <Nav.Link href="#" className="nav-item nav-link">
            <Button>
              <i className="bi bi-person-circle"></i>
            </Button>
          </Nav.Link>
        </Container>
      </Navbar>
  );
}

export {NavHeader};