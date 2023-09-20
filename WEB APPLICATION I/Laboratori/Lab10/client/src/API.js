import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

/**
 * Getting from the server side and returning the list of films.
 * The list of films could be filtered in the server-side through the optional parameter: filter.
 */
const getFilms = async (filter) => {
  // film.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(
    filter 
      ? fetch(SERVER_URL + 'films?filter=' + filter, { credentials: 'include' })
      : fetch(SERVER_URL + 'films', { credentials: 'include' })
  ).then( json => {
    return json.map((film) => {
      const clientFilm = {
        id: film.id,
        title: film.title,
        favorite: film.favorite,
        rating: film.rating,
        user: film.user
      }
      if (film.watchDate != null)
        clientFilm.watchDate = dayjs(film.watchDate);
      return clientFilm;
    })
  })
}


/** 
 * Getting and returning the definition of the filters from the server-side.
 * This functionality was not requested in the requirements but allows to dinamically change the filters without modifying the front-end.
 */ 
const getFilters = async () => {
  return getJson(
    fetch(SERVER_URL + 'filters', { credentials: 'include' })
  ).then( json => {
    return json;
  })
}


/**
 * Create a new film
 */
const createFilm = async (film) => {
  const response = await fetch(`${SERVER_URL}films`,{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({title: film.title, favorite: film.favorite, watchDate: film.watchDate.format('YYYY-MM-DD'), rating: film.rating})
  });

  if(!response.ok){
    const errMessage = await response.json();
    throw errMessage;
  }
  else{
    return null;
  }
}

const updateFilm = async(film) => {
  const response = await fetch(`${SERVER_URL}films/${film.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: film.id, title: film.title, favorite: film.favorite, watchDate: film.watchDate.format('YYYY-MM-DD'), rating: film.rating})
  });

  if(!response.ok){
    const errMessage = await response.json();
    throw errMessage;
  }
  else{
    return null;
  }
}

const deleteFilm = async(filmId) => {
  const response = await fetch(`${SERVER_URL}films/${filmId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  });
  
  if(!response.ok){
    const errMessage = await response.json();
    throw errMessage;
  }
  else{
    return null;
  }
}

const API = { getFilms, getFilters, createFilm, updateFilm, deleteFilm };
export default API;
