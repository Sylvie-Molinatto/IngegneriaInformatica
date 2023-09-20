import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate, Link, useParams, useLocation, Outlet } from 'react-router-dom';

import FilmForm from './FilmForm';
import FilmTable from './FilmLibrary';
import { RouteFilters } from './Filters';


function DefaultLayout(props) {
  const location = useLocation();

  const { filterLabel } = useParams();
  const filterId = filterLabel || (location.pathname === "/" && 'filter-all');
  
  return (
    <Row className="vh-100">
      <Col md={4} xl={3} bg="light" className="below-nav" id="left-sidebar">
        <RouteFilters items={props.filters} selected={filterId} />
      </Col>
      <Col md={8} xl={9} className="below-nav">
        <Outlet/>
      </Col>
    </Row>
  );
}

function MainLayout(props) {

  const { filterLabel } = useParams();
  const filterName = props.filters[filterLabel] ?  props.filters[filterLabel].label : 'All';

  // When an unpredicted filter is written, all the films are displayed.
  const filteredFilms = (filterLabel in props.filters) ? props.films.filter(props.filters[filterLabel].filterFunction) : props.films;
  
  const location = useLocation();
  
  return (
    <>
      <h1 className="pb-3">Filter: <span className="notbold">{filterName}</span></h1>
      <FilmTable films={filteredFilms}
        deleteFilm={props.deleteFilm} updateFilm={props.updateFilm} />
      <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/add" state={{nextpage: location.pathname}}> &#43; </Link>
    </>
  )
}

function AddLayout(props) {
  return(
    <FilmForm addFilm={props.addFilm}/>
  );
}

function EditLayout(props) {
  const navigate = useNavigate();
  const { filmId } = useParams();
  const thisFilm = props.films && props.films.find( f => f.id === Number(filmId) );
  
  if(thisFilm == null)
    navigate("/add");

  return(
    <FilmForm film={thisFilm} editFilm={props.editFilm}/>
  );
}

function NotFoundLayout() {
    return(
        <>
          <h2>This is not the route you are looking for!</h2>
          <Link to="/">
            <Button variant="primary">Go Home!</Button>
          </Link>
        </>
    );
  }


export { DefaultLayout, AddLayout, EditLayout, NotFoundLayout, MainLayout }; 
