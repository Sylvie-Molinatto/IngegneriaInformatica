import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

import dayjs from 'dayjs';

import {Film} from './FilmModel';

import Filters from './components/Filters';
import {NavHeader} from './components/NavBarComponent';
import {Films} from './components/FilmComponents';

import {Container, Row, Col, Button} from 'react-bootstrap';
import {useState} from 'react'

import FILMS from './Films';

function App() {
 
  // This state contains the active filter
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
    if('date' in film) {  // Accessing watchDate only if defined
      const diff = film.date.diff(dayjs(),'month')
      const isLastMonth = diff <= 0 && diff > -1 ;      // last month
      return isLastMonth;
    }
  }

  return (
    <>
      <Container fluid as={'div'} style={{padding:0}}>
      <Row>
        <Col>
          <NavHeader/>
        </Col>
      </Row>
      <Row style={{padding:20}}> 
        <Col md={4} xl={3} bg="light" className="below-nav" id="left-sidebar">
          <Filters items={filters} selected={activeFilter} onSelect={setActiveFilter}/>
        </Col>
        <Col md={8} xl={9} className="below-nav">
          <h1 className="pb-3">Filter: <span className="notbold">{filters[activeFilter].label}</span></h1>
          <Films activeFilter={filters[activeFilter].label}
                     films={films.filter(filters[activeFilter].filterFunction)}
          />
          <Button variant="primary" size="lg" className="fixed-right-bottom"> &#43; </Button>
        </Col>
      </Row>
      </Container>
    </>
  )
}

export default App;
