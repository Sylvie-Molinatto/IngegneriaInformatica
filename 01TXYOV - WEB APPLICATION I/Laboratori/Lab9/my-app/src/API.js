import { Film } from "./FilmModel";
const SERVER_URL = 'http://localhost:3001';

const getFilms = async () => {
  const response = await fetch(SERVER_URL + '/api/films');
  if(response.ok) {
    const filmsJson = await response.json();
    return filmsJson.map(f=> new Film(f.id, f.title, f.favorite, f.watchDate, f.rating));
  }
  else
    throw new Error('Internal server error');
}

const API = {getFilms};
export default API;