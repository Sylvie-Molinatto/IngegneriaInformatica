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
      if (film.watchDate)
        clientFilm.watchDate = dayjs(film.watchDate);
      return clientFilm;
    })
  })
}

/**
 * Getting and returing a film, specifying its filmId.
 */
const getFilm = async (filmId) => {
  return getJson( fetch(SERVER_URL + 'films/' + filmId, { credentials: 'include' }))
    .then( film => {
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
    } )
}

/**
 * This function wants a film object as parameter. If the filmId exists, it updates the film in the server side.
 */
function updateFilm(film) {
  if (film && film.watchDate && (film.watchDate instanceof dayjs))
      film.watchDate = film.watchDate.format("YYYY-MM-DD");
  return getJson(
    fetch(SERVER_URL + "films/" + film.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(film) // dayjs date is serialized correctly by the .toJSON method override
    })
  )
}

/**
 * This funciton adds a new film in the back-end library.
 */
function addFilm(film) {
  return getJson(
    fetch(SERVER_URL + "films/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(film) 
    })
  )
}

/**
 * This function deletes a film from the back-end library.
 */
function deleteFilm(filmId) {
  return getJson(
    fetch(SERVER_URL + "films/" + filmId, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}

const API = { getFilms, getFilm, addFilm, deleteFilm, updateFilm };
export default API;
