import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import {React, useState} from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap';

import { Film } from './FilmModel';

import Filters from './components/Filters';
import {NavHeader} from './components/NavBarComponent';
import Films from './components/FilmComponents';
import FilmForm from './components/FilmForm';

import FILMS from './Films';

function App() {

  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('filter-all');
  const [films, setFilms] = useState(FILMS)

  const filters = {
    'filter-all':       { label: 'All', id: 'filter-all', filterFunction: () => true},
    'filter-favorite':  { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorites},
    'filter-best':      { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen':    { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.date ? false : true}
  };
  
  const isSeenLastMonth = (film) => {
    if('date' in film && film.date!=='') {  // Accessing date only if defined
      const diff = film.date.diff(dayjs(),'month')
      const isLastMonth = diff <= 0 && diff > -1 ;      // last month
      return isLastMonth;
    }
  }
  
  const addFilm = (film) => {
    setFilms((oldFilms) => [...oldFilms, film]);
  }

  const updateFilm = (film) => {
    setFilms(oldFilm => {
      return oldFilm.map((f) => {
        if(f.id === film.id) {
          return new Film(film.id, film.title, film.favorites, film.date, film.rating);
        }
        else
          return f;
      });
    });
  }

  return (
    <>
      <Container fluid style={{padding:0}} className='App'>
      <Row>
        <Col>
          <NavHeader/>
        </Col>
      </Row>
      <Row style={{padding:0}}> 
        <Col md={4} xl={3} bg="light" className="below-nav" id="left-sidebar">
          <Filters items={filters} selected={activeFilter} onSelect={setActiveFilter}/>
        </Col>
        <Col md={8} xl={9} className="below-nav">
          <h1 className="pb-3">Filter: <span className="notbold">{filters[activeFilter].label}</span></h1>
          <Films activeFilter={filters[activeFilter].label}
                     films={films.filter(filters[activeFilter].filterFunction)}
                     allFilms={films}
                     addFilm={addFilm} updateFilm={updateFilm}/>
        </Col>
      </Row>
      </Container>
    </>
  )
}

export default App;
