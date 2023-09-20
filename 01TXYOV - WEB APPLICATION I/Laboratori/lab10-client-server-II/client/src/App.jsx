/*
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 9
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { React, useState, useEffect } from 'react';
import { Container, Toast } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import { MainLayout, AddLayout, EditLayout, DefaultLayout, NotFoundLayout, LoadingLayout } from './components/PageLayout';

import MessageContext from './messageCtx';
import API from './API';

function App() {

  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);

  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
  const [loading, setLoading] = useState(false);

  // This state contains the list of films (it is initialized from a predefined array).
  const [films, setFilms] = useState([]);

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

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className='App'>
          <Navigation/>
          <Routes>
            <Route path="/" element={ loading ? <LoadingLayout /> : <DefaultLayout films={films} filters={filters}  /> } >
              <Route index element={ <MainLayout films={films} setFilms={setFilms} filters={filters} dirty={dirty} setDirty={setDirty} /> } />
              <Route path="filter/:filterLabel" element={ <MainLayout films={films} setFilms={setFilms} filters={filters} dirty={dirty} setDirty={setDirty} /> } />
              <Route path="add" element={ <AddLayout /> } />
              <Route path="edit/:filmId" element={ <EditLayout films={films} filters={filters} setDirty={setDirty} /> } />
              <Route path="*" element={<NotFoundLayout />} />
            </Route>
          </Routes>
          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide>
            <Toast.Body>{ message }</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  );

}

export default App;
