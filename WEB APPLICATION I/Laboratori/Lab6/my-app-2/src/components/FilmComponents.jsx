import 'bootstrap-icons/font/bootstrap-icons.css';
import 'dayjs'
import { Table, Form, Container, Row, Col, Button } from "react-bootstrap";
import FilmForm from './FilmForm';
import { useState } from "react";



function Films(props) {
  return (
     <Container fluid style={{padding:10}}>
       <Row>
          <Col className="mx-auto">
            <FilmTable films={props.films} allFilms={props.allFilms} addFilm={props.addFilm} updateFilm={props.updateFilm}></FilmTable>
          </Col>
       </Row>
     </Container>
  );
}

function FilmTable(props){

  const {films, activeFilter} = props;
  const [showForm, setShowForm] = useState(false);
  const [editableFilm, setEditableFilm] = useState();

  return (
    <>
    <Table responsive>
      <tbody>
        {
          films.map((film) => <FilmRow film={film} key={film.id} setShowForm={setShowForm} setEditableFilm={setEditableFilm}/>)
        }
      </tbody>
    </Table>

    { /* Assumption: the last id will be in the last item in the array */}
    { showForm ? 
      <FilmForm 
        key={editableFilm ? editableFilm.id : -1} 
        lastId={props.allFilms.slice(-1)[0].id}
        film={editableFilm} 
        addFilm={(film) => {props.addFilm(film); setShowForm(false);}} 
        cancel={() => setShowForm(false)} 
        updateFilm={(film) => {props.updateFilm(film); setShowForm(false);}}
      /> 
    :
      <Button variant="primary" className="fixed-right-bottom" onClick={() => { setShowForm(true); setEditableFilm(); }}> &#43;</Button>}
      </>
  );
}

function FilmRow(props){
    
  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  return (
    <tr><FilmData film={props.film}/><FilmActions film={props.film} setShowForm={props.setShowForm} setEditableFilm={props.setEditableFilm}/></tr>
  );
}

function FilmData(props){
  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  const [favorites, setFavorites]=useState(props.film ? props.film.favorites : '');
  
  const handleChange = () => { 
    setFavorites(!favorites); 
  };


  return(
    <>
      <td>
        <p className={props.film.favorites ? "favorite" : ""}>
          {props.film.title}
        </p>
      </td>
      <td>
        <Form> 
          <Form.Check 
                type="checkbox"
                id={props.film.id}
                label="Favorite"
                checked={props.film.favorites ? true : false}
                onChange={(event) => handleChange(event.target.value)}
          />
        </Form>
      </td>
      <td>
      {
        <small>{formatWatchDate(props.film.date, 'MMMM D, YYYY')}</small>
      }
      </td>
      <td>
      <Rating rating={props.film.rating} maxStars={5}/>
      </td>
    </>
  );
}

function FilmActions(props) {
  return <td>
    <Button variant='primary' onClick={() => {props.setShowForm(true); props.setEditableFilm(props.film);}}><i className='bi bi-pencil-square'></i></Button>
    </td>
}

function Rating(props) {
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} />
  )
}

export default Films;