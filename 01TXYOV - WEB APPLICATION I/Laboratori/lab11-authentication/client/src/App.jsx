/*
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 11
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { React, useState, useEffect, useContext } from 'react';
import { Container, Toast } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import { MainLayout, AddLayout, EditLayout, DefaultLayout, NotFoundLayout, LoginLayout, LoadingLayout } from './components/PageLayout';

import MessageContext from './messageCtx';
import API from './API';

function App() {

  const [dirty, setDirty] = useState(true);

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);

  // This state contains the list of films (it is initialized from a predefined array).
  const [films, setFilms] = useState([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

   /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - An URL of the corresponding route (it MUST match /filter/<filter-key>)
   * - A filter function applied before passing the films to the FilmTable component
   */
   const filters = {
    'filter-all':       { label: 'All', url: '', filterFunction: () => true},
    'filter-favorite':  { label: 'Favorites', url: '/filter/filter-favorite', filterFunction: film => film.favorite},
    'filter-best':      { label: 'Best Rated', url: '/filter/filter-best', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': { label: 'Seen Last Month', url: '/filter/filter-lastmonth', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen':    { label: 'Unseen', url: '/filter/filter-unseen', filterFunction: film => film.watchDate ? false : true}
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await API.getUserInfo();  // here you have the user info, if already logged in
        setUser(user);
        setLoggedIn(true); setLoading(false);
      } catch (err) {
        handleErrors(err); // mostly unauthenticated user, thus set not logged in
        setUser(null);
        setLoggedIn(false); setLoading(false);
      }
    };
    init();
  }, []);  // This useEffect is called only the first time the component is mounted.

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
    setFilms([]);
  };

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className="App">

          <Navigation logout={handleLogout} user={user} loggedIn={loggedIn} />

          <Routes>
            <Route path="/" element={
            loading ? <LoadingLayout /> : <DefaultLayout films={films} filters={filters} />
            } >
              <Route index element={loggedIn ? <MainLayout films={films} setFilms={setFilms} filters={filters} dirty={dirty} setDirty={setDirty} /> : <Navigate replace to='/login' />} />
              <Route path="filter/:filterLabel" element={loggedIn ? <MainLayout films={films} setFilms={setFilms} filters={filters} dirty={dirty} setDirty={setDirty} /> : <Navigate replace to='/login' />} />
              <Route path="add" element={loggedIn ? <AddLayout setDirty={setDirty} /> : <Navigate replace to='/login' />} />
              <Route path="edit/:filmId" element={loggedIn ? <EditLayout films={films} filters={filters} setDirty={setDirty} /> : <Navigate replace to='/login' />} />
              <Route path="*" element={<NotFoundLayout />} />
            </Route>
            <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
          </Routes>

          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide bg="danger">
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  );

}

export default App;
