'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');
const dayjs = require("dayjs");

const filters = {
  'filter-favorite':  { label: 'Favorites', url: '/filter/filter-favorite', filterFunction: film => film.favorite},
  'filter-best':      { label: 'Best Rated', url: '/filter/filter-best', filterFunction: film => film.rating >= 5},
  'filter-lastmonth': { label: 'Seen Last Month', url: '/filter/filter-lastmonth', filterFunction: film => isSeenLastMonth(film)},
  'filter-unseen':    { label: 'Unseen', url: '/filter/filter-unseen', filterFunction: film => film.watchDate ? false : true}
};


const isSeenLastMonth = (film) => {
  if('watchDate' in film && film.watchDate) {  // Accessing watchDate only if defined
    const watchDate = dayjs(film.watchDate);
    const diff = watchDate.diff(dayjs(),'month')
    const isLastMonth = diff <= 0 && diff > -1 ;      // last month
    return isLastMonth;
  }
}

/** WARNING: 
 * When you are retrieving films, you should not consider the value of the “user” column. When you are creating new films, you should assign all of them to the same user (e.g., user with id=1).
 */ 

/** NOTE:
 * return error messages as json object { error: <string> }
 */


// This function retrieves the whole list of films from the database.
exports.listFilms = (filter) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); }

      const films = rows.map((e) => {
        // WARNING: the database returns only lowercase fields. So, to be compliant with the client-side, we convert "watchdate" to the camelCase version ("watchDate").
        const film = Object.assign({}, e, { watchDate: e.watchdate } );  // adding camelcase "watchDate"
        delete film.watchdate;  // removing lowercase "watchdate"
        if (film.rating == null)  // casting NULL value to 0
          film.rating = 0;
        return film;
      });

      // WARNING: if implemented as if(filters[filter]) returns true also for filter = 'constructor' but then .filterFunction does not exists
      if (filters.hasOwnProperty(filter)) 
        resolve(films.filter(filters[filter].filterFunction));
      else resolve(films);
    });
  });
};
  
// This function retrieves a film given its id and the associated user id.
exports.getFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: 'Film not found.' });
      } else {
        // WARN: database is case insensitive. Converting "watchDate" to camel case format
        const film = Object.assign({}, row, { watchDate: row.watchdate } );  // adding camelcase "watchDate"
        delete film.watchdate;  // removing lowercase "watchdate"
        if (film.rating == null)  // casting NULL value to 0
          film.rating = 0;
        resolve(film);
      }
    });
  });
};
  
  
/**
 * This function adds a new film in the database.
 * The film id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createFilm = (film) => {
  // our database is configured to have a NULL value for films without rating
  if (film.rating <= 0)
    film.rating = null;
  if (film.watchDate == "")
    film.watchDate = null;

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO films (title, favorite, watchDate, rating, user) VALUES(?, ?, ?, ?, ?)';
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function (err) {
      if (err) {
        reject(err);
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getFilm(this.lastID));
    });
  });
};
  
// This function updates an existing film given its id and the new properties.
exports.updateFilm = (id, film) => {
  // our database is configured to have a NULL value for films without rating
  if (film.rating <= 0)
    film.rating = null;
  if (film.watchDate == "")
    film.watchDate = null;

  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title = ?, favorite = ?, watchDate = ?, rating = ? WHERE id = ?';
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) {
        resolve({ error: 'Film not found.' });
      } else {
        resolve(exports.getFilm(id)); 
      }
    });
  });
};
  
// This function deletes an existing film given its id.
exports.deleteFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else
        resolve(null);
    });
  });
}
