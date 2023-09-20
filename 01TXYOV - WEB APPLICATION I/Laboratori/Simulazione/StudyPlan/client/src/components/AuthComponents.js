import { useState } from 'react';
import {Form, Button, Row, Container, Col} from 'react-bootstrap';
import image from "./images/students.jpg"; 
import './style.css'

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      
      props.login(credentials);
  };

  return (

    <Container className="pt-3" style={{ backgroundImage:`url(${image})` }}>
     <Container id="container-wrapper" style={{backgroundColor: "white", margin:'auto'}}>
      <Form className='p-5' onSubmit={handleSubmit}>
        <h3 className="text-center">Login</h3>
        <Form.Group className="mb-3" controlId='username'>
          <Form.Label>Student Id</Form.Label>
          <Form.Control type='id' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
        </Form.Group>

        <Form.Group className="mb-3" controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
        </Form.Group>

        <Button variant="primary" className="w-100" type="submit">Login</Button>
      </Form>
      </Container>
    </Container>

  )
};

function LogoutButton(props) {
  return(
    <Row>
      <Col>
        <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
      </Col>
    </Row>
  )
}

export { LoginForm, LogoutButton };