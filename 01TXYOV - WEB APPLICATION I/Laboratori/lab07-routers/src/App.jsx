/*
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 7
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState } from 'react';
import { Container } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {Navigation} from './components/Navigation';
import { MainLayout, AddLayout, EditLayout, DefaultLayout, NotFoundLayout, } from './components/PageLayout';

import FILMS from './films'

function App() {
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

  const isSeenLastMonth = (film) => {
    if('watchDate' in film && film.watchDate) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(),'month')
      const isLastMonth = diff <= 0 && diff > -1 ;      // last month
      return isLastMonth;
    }
}

  // This state contains the list of films (it is initialized from a predefined array).
  const [films, setFilms] = useState(FILMS);

  // This state contains the last film ID (the ID is continuously incremented and never decresead).
  const [lastFilmId, setLastFilmId] = useState(FILMS[FILMS.length-1].id + 1);

  // This function add the new film into the FilmLibrary array
  const saveNewFilm = (newFilm) => {
    setFilms( (films) => [...films, {"id": lastFilmId, ...newFilm}] );
    setLastFilmId( (id) => id + 1 );
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
  }

  const deleteFilm = (filmId) => {
    setFilms((oldFilms) => oldFilms.filter((f) => f.id !== filmId));
  };

  return (
    <BrowserRouter>
      <Container fluid className='App'>
        <Navigation/>
        
        <Routes>
          <Route path="/" element={ <DefaultLayout films={films} filters={filters}  /> } >
            <Route index element={ <MainLayout films={films} filters={filters} deleteFilm={deleteFilm} updateFilm={updateFilm} /> } />
            <Route path="filter/:filterLabel" element={ <MainLayout films={films} filters={filters} deleteFilm={deleteFilm} updateFilm={updateFilm} /> } />
            <Route path="add" element={ <AddLayout filters={filters}   addFilm={(film) => saveNewFilm(film)} /> } />
            <Route path="edit/:filmId" element={ <EditLayout films={films} filters={filters}  editFilm={updateFilm} /> } />
            <Route path="*" element={<NotFoundLayout />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
