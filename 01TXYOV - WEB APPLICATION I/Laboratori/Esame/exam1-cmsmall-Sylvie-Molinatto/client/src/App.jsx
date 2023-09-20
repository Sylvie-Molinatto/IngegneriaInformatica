import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

import { Navigation } from './components/Navigation';
import MessageContext from './messageCtx';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Container, Toast } from 'react-bootstrap';
import { React, useState, useEffect, useContext } from 'react';
import { FrontOfficeLayout, PageDetailsLayout, BackOfficeLayout, NewPageLayout, NotFoundLayout, NotLoggedLayout, ForbiddenLayout, LoginLayout, LoadingLayout, EditPageLayout} from './components/PageLayout'
import API from './API';

function App() {

  const [message, setMessage] = useState('');

   // If an error occurs, the error message will be shown in a toast.
   const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = err.message;
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  return (
    <>
    <BrowserRouter>
      <MessageContext.Provider value={{handleErrors}}>
        <Container fluid className="App over-footer">
          <Routes>
            <Route path="/*" element={<Main/>}></Route>
          </Routes>
          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide className='below-nav position-fixed bottom-0 start-50 translate-middle-x'>
            <Toast.Body>{ message }</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
    </>
  )
}

function Main() {

   // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
   const [loading, setLoading] = useState(true);
   // This state keeps track if the user is currently logged-in.
   const [loggedIn, setLoggedIn] = useState(false);
   // This state contains the user's info.
   const [user, setUser] = useState(null);
   // Error messages are managed at context level (like global variables)
   const {handleErrors} = useContext(MessageContext);

   const [websiteName, setWebsiteName] = useState("");

   useEffect(() => {
    const init = async() => {
      try{
        setLoading(true);
        // Get the website name
        const websiteName = await API.getWebsiteName();
        setWebsiteName(websiteName);
        
        // Get the user info, if already logged in
        const user = await API.getUserInfo(); 
        setUser(user);
        setLoggedIn(true);
        setLoading(false);
      } catch(err) {
        handleErrors(err); // mostly unauthenticated user, thus set not logged in
        setUser(null);
        setLoggedIn(false);
        setLoading(false)
      }
    };
    init();
   },[]); // This useEffect is called only the first time the component is mounted.
  
   /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */ 
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
  };

  return (
    <>
      <Navigation logout={handleLogout} user={user} loggedIn={loggedIn} handleErrors={handleErrors} websiteName={websiteName}/>
      <Routes>
        <Route path="/" element={ loading? <LoadingLayout/> : <FrontOfficeLayout/>}>
        </Route>
        <Route path='/pages/:id' element={<PageDetailsLayout user={user}/>}/>
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/back-office' />} />
        <Route path="/back-office" element={!loggedIn ? <NotLoggedLayout/> : <BackOfficeLayout user={user}/>}/>
        <Route path="/back-office/pages/:id" element={!loggedIn ? <NotLoggedLayout/> : <PageDetailsLayout user={user}/>}/>
        <Route path="/back-office/create" element={!loggedIn ? <NotLoggedLayout/> : <NewPageLayout user={user}/>}/>
        <Route path="/back-office/edit/:pageid" element={!loggedIn ? <ForbiddenLayout/> : <EditPageLayout user={user}/>}/>
        <Route index element={<FrontOfficeLayout/>} />
        <Route path="*" element={<NotFoundLayout/>}/>
      </Routes>
    </>
  )
}

export default App
