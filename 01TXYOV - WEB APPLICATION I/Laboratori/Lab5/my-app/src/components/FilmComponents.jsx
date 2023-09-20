import 'bootstrap-icons/font/bootstrap-icons.css';
import 'dayjs'
import { Container, Table, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";

function Films(props) {
  return (
     <Container style={{padding:10}}>
       <Row>
          <Col className="mx-auto">
            <FilmTable films={props.films}></FilmTable>
          </Col>
       </Row>
     </Container>
  );
}

function FilmTable(props){

  const {films, activeFilter} = props;

  return (
    <Table responsive>
      <tbody>
        {
          films.map((film) => <FilmRow film={film} key={film.id}/>)
        }
      </tbody>
    </Table>
  );
}

function FilmRow(props){

  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  return (
    <tr><FilmData film={props.film}/></tr>
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

function Rating(props) {
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} />
  )
}

export {Films};