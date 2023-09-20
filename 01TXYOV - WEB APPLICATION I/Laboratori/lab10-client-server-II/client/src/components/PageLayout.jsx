import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import FilmForm from './FilmForm';
import FilmTable from './FilmLibrary';
import { RouteFilters } from './Filters';
import MessageContext from '../messageCtx';
import API from '../API';


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

  const dirty = props.dirty;
  const setDirty = props.setDirty;
  const location = useLocation();

  const {handleErrors} = useContext(MessageContext);

  const { filterLabel } = useParams();
  const filterName = props.filters[filterLabel] ?  props.filters[filterLabel].label : 'All';
  const filterId = filterLabel || (location.pathname === "/" && 'filter-all');

  // Without this we do not pass the if(dirty) test in the [filterId, dirty] useEffect
  useEffect(() => {
    setDirty(true);
  }, [filterId])

  useEffect(() => {
    if (dirty) {
      API.getFilms(filterId)
        .then(films => {
          props.setFilms(films);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); } ); 
    }
  }, [filterId, dirty]);

  const deleteFilm = (filmId) => {
    API.deleteFilm(filmId)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

    // update a film into the list
  const updateFilm = (film) => {
    API.updateFilm(film)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  // When an unpredicted filter is written, all the films are displayed.
  const filteredFilms = props.films;

  return (
    <>
      <h1 className="pb-3">Filter: <span className="notbold">{filterName}</span></h1>
      <FilmTable films={filteredFilms} deleteFilm={deleteFilm} updateFilm={updateFilm} />
      <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/add" state={{nextpage: location.pathname}}> &#43; </Link>
    </>
  )
}

function AddLayout(props) {
  const {handleErrors} = useContext(MessageContext);

  // add a film into the list
  const addFilm = (film) => {
    API.addFilm(film)
      .catch(e => handleErrors(e)); 
  }
  return (
    <FilmForm addFilm={addFilm} />
  );
}

function EditLayout(props) {

  const setDirty = props.setDirty;
  const {handleErrors} = useContext(MessageContext);

  const { filmId } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    API.getFilm(filmId)
      .then(film => {
        setFilm(film);
      })
      .catch(e => {
        handleErrors(e); 
      }); 
  }, [filmId]);

  // update a film into the list
  const editFilm = (film) => {
    API.updateFilm(film)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  return (
    film ? <FilmForm film={film} editFilm={editFilm} /> : <></>
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

/**
 * This layout shuld be rendered while we are waiting a response from the server.
 */
function LoadingLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={4} bg="light" className="below-nav" id="left-sidebar">
      </Col>
      <Col md={8} className="below-nav">
        <h1>Film Library ...</h1>
      </Col>
    </Row>
  )
}

export { DefaultLayout, AddLayout, EditLayout, NotFoundLayout, MainLayout, LoadingLayout }; 
