import { useState } from 'react';
import {Form, Button, Alert, Col, Row} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // if user has been redirected here from another page, go back to that urls
  const oldPath = location?.state?.pathname || "";

  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      
      props.login(credentials)
        .then( () => navigate(oldPath))
        .catch((err) => {
          setErrorMessage(err); setShow(true);
        })
  };

  return (
    <Row className="vh-100 justify-content-md-center">
    <Col md={4} >
    <h1 className="pb-3">Login</h1>

      <Form  onSubmit={handleSubmit}>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={username} placeholder="Example: John.Red@gmail.com"
              onChange={(ev) => setUsername(ev.target.value)}
              required={true}
              className='form-control'
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter the password."
              onChange={(ev) => setPassword(ev.target.value)}
              required={true} minLength={6}
              className='form-control'
            />
          </Form.Group>
          <Button className="mt-3" type="submit" variant="success">Login</Button>
      </Form>
      </Col>
      </Row>
  )
};

function LogoutButton(props) {

  const oldPath = location?.state?.pathname || "";

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic
    props.logout();

    // Redirect to the previous page
    navigate(oldPath);
  };

  return(
    <Button variant='outline-light' onClick={handleLogout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };