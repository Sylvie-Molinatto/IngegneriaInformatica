/*
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 5
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap/'

import FILMS from './films'

import {Navigation} from './components/Navigation';
import Filters from './components/Filters';
import FilmTable from './components/FilmLibrary';

function App() {

  // This state contains the active filter
  const [activeFilter, setActiveFilter] = useState('filter-all');

  /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - An ID (equal to the unique name), used as key during the table generation
   * - A filter function applied before passing the films to the FilmTable component
   */
  const filters = {
    'filter-all':       { label: 'All', id: 'filter-all', filterFunction: () => true},
    'filter-favorite':  { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite},
    'filter-best':      { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen':    { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.watchDate ? false : true}
  };

  const isSeenLastMonth = (film) => {
    if('watchDate' in film) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(),'month')
      const isLastMonth = diff <= 0 && diff > -1 ;      // last month
      return isLastMonth;
    }
}

  return (
    <Container fluid className='App'>

      <Navigation/>

      <Row className="vh-100">
        <Col md={4} xl={3} bg="light" className="below-nav" id="left-sidebar">
          <Filters items={filters} selected={activeFilter} onSelect={setActiveFilter}/>
        </Col>

        { /* </Collapse> */}
        <Col md={8} xl={9} className="below-nav">
          <h1 className="pb-3">Filter: <span className="notbold">{filters[activeFilter].label}</span></h1>
          <FilmTable activeFilter={filters[activeFilter].label}
                     films={FILMS.filter(filters[activeFilter].filterFunction)}/>
          <Button variant="primary" size="lg" className="fixed-right-bottom"> &#43; </Button>
        </Col>
      </Row>

    </Container>
  );
}

export default App;
