import 'dayjs';

import { Table, Form, Button } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';

function FilmTable(props) {
  
  const filteredFilms = props.films;

  return (
    <Table striped>
      <tbody>
        { 
          filteredFilms.map((film) =>
            <FilmRow key={film.id} filmData={film} deleteFilm={props.deleteFilm} updateFilm={props.updateFilm} />
          )
        }
      </tbody>
    </Table>
  );
}
  
function FilmRow(props) {

  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();

  return(
    <tr>
      <td>
        <Link className="btn btn-primary" to={"/edit/" + props.filmData.id} state={{nextpage: location.pathname}}>
          <i className="bi bi-pencil-square"/>
        </Link>
        &nbsp;
        <Button variant='danger' onClick={() => props.deleteFilm(props.filmData.id)}>
          <i className="bi bi-trash"/>
        </Button>
      </td>
      <td>
        <p className={props.filmData.favorite ? "favorite" : ""} >
          {props.filmData.title}
        </p>
      </td>
      <td>
        <Form.Check type="checkbox" label="Favorite" checked={props.filmData.favorite}
          onChange={(event) => props.updateFilm({ ...props.filmData, "favorite": event.target.checked })} />
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small>
      </td>
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} updateRating={(newRating) => {
          newRating !== props.filmData.rating ? props.updateFilm({ ...props.filmData, rating: newRating }) : false
        }}/>
      </td>
    </tr>
  );
}

function Rating(props) {
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} onClick={() => props.updateRating(index+1)}/>
  )
}

export default FilmTable;
