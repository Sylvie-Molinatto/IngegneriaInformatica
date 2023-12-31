/*
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 10
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

  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
  const [loading, setLoading] = useState(false);

  // This state contains the list of films (it is initialized from a predefined array).
  const [films, setFilms] = useState([]);

  const getFilms = async () => {
    const films = await API.getFilms();
    setFilms(films);
  }

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
  

  // This state contains the last film ID (the ID is continuously incremented and never decresead).
  // NOTE: will be removed when films wille be saved on the server
  const [lastFilmId, setLastFilmId] = useState(1);

  // This function add the new film into the FilmLibrary array
  const saveNewFilm = (newFilm) => {
    setFilms( (films) => [...films, {"id": lastFilmId, ...newFilm}] );
    setLastFilmId( (id) => id + 1 );

    API.createFilm(newFilm)
    .then(() => getFilms())
    .catch(err => console.log(err));

  }

  // This function updates a film already stored into the FilmLibrary array
  const updateFilm = (film) => {
    setFilms(oldFilms => {
      return oldFilms.map(f => {
        if(film.id === f.id)
          return { "id": film.id, "title": film.title, "favorite": film.favorite, "watchDate": film.watchDate, "rating": film.rating };
        else
          return f;
      });
    });

    API.updateFilm(film)
    .then(() => getFilms())
    .catch(err => console.log(err));
  }

  const deleteFilm = (filmId) => {
    setFilms((oldFilms) => oldFilms.filter((f) => f.id !== filmId));

    API.deleteFilm(filmId)
    .then(() => getFilms())
    .catch(err => console.log(err));
  };

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className='App'>
          <Navigation/>
          <Routes>
            <Route path="/" element={ loading ? <LoadingLayout /> : <DefaultLayout films={films} filters={filters}  /> } >
              <Route index element={ 
                <MainLayout films={films} filters={filters}
                  setFilms={(films) => { setFilms(films); setLastFilmId(Math.max(...films.map(f => f.id)) + 1); }}  
                  deleteFilm={deleteFilm} updateFilm={updateFilm}
                 /> 
              } />
              <Route path="filter/:filterLabel" element={ 
                <MainLayout films={films} filters={filters} 
                  setFilms={(films) => { setFilms(films); setLastFilmId(Math.max(...films.map(f => f.id)) + 1); }}  
                  deleteFilm={deleteFilm} 
                  updateFilm={updateFilm} 
                />
              } />
              <Route path="add" element={ <AddLayout filters={filters}   addFilm={(film) => saveNewFilm(film)} /> } />
              <Route path="edit/:filmId" element={ <EditLayout films={films} filters={filters}  editFilm={updateFilm} /> } />
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
