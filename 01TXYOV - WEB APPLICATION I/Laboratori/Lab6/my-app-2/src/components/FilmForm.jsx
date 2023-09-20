import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Film } from '../FilmModel';
import dayjs from 'dayjs';

function FilmForm(props) {
  const [id, setId] = useState(props.film ? props.film.id : props.lastId + 1);
  const [title, setTitle] = useState(props.film ? props.film.title : '');
  const [favorites, setFavorites] = useState(props.film ? props.film.favorites : '');
  const [date, setDate] = useState(props.film ? props.film.date ? props.film.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD') : '');
  const [rating, setRating] = useState(props.film ? props.film.rating : 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    // create a new film
    const film = new Film(id, title, favorites, date, rating);
    // TODO: add validations!
    if(film.rating>5 || film.rating<0){
      alert('The rating should be between zero and five inclusive');
    }
    else{
      if(props.film) {
        props.updateFilm(film);
      }
      else {
        // add the film to the "films" state
        props.addFilm(film);
      }
    }
    
  }

  const handleChange = () => { 
    setFavorites(!favorites); 
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" minLength={2} required={true} value={title} onChange={(event) => setTitle(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Favorites</Form.Label>
        <Form.Check type="checkbox" id="checkbox" checked={favorites} onChange={(event) => handleChange(event.target.value)}></Form.Check>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" value={date || ''} onChange={(event) => setDate(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Rating</Form.Label>
        <Form.Control type="number" value={rating} onChange={(event) => setRating(event.target.value)}></Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">Add</Button><Button variant="danger" onClick={props.cancel}>Cancel</Button>
    </Form>
  );
}

export default FilmForm;