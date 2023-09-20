/* Data Access Object (DAO) module for accessing Q&A */
/* Initial version taken from exercise 4 (week 03) */

const sqlite = require('sqlite3');
const {Film, FilmLibrary} = require('./FilmModel');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});

const filters = {
  'filter-all':       { label: 'All', id: 'filter-all', filterFn: () => true}, 
  'filter-favorite':  { label: 'Favorites', id: 'filter-favorite', filterFn: film => film.favorite}, 
  'filter-best':      { label: 'Best Rated', id: 'filter-best', filterFn: film => film.rating >= 5}, 
  'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFn: film => isSeenLastMonth(film)}, 
  'filter-unseen':    { label: 'Unseen', id: 'filter-unseen', filterFn: film => dayjs(film.watchDate).isValid()  ? false : true }
};

const isSeenLastMonth = (film) => {
  if (film.watchDate == null || typeof dayjs(film.watchDate).diff !== 'function')
    return false;
  return dayjs(film.watchDate).diff(dayjs(), 'month') === 0;
};

exports.listFilters = () => {
  return filters;
}

// get all the films
exports.listFilms = (filter) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM films' ;
        db.all(query, [], (err, rows) => {
          if(err) {
            reject(err);
            return;
          }
        
          const films = rows.map((record) => {
            const film =  new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating);
            return film;
          });
           
          if (filters.hasOwnProperty(filter)) {
            resolve(films.filter(filters[filter].filterFn));
          }
          else resolve(films); 
      });
    });
  };

// get a film given its id
exports.getFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      if (row == undefined)
        resolve({error: 'Film not found.'}); 
      else {
        const film = new Film(row.id, row.title, row.favorite, row.watchdate, row.rating, row.user);
        resolve(film);
      }
    });
  });
};

// add a new film
exports.addFilm = (film) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO films(title, favorite, watchdate, rating, user) VALUES(?, ?, ?, ?, ?)';
        const parameters = [film.title, film.favorite, film.watchdate, film.rating, film.user];
        db.run(query, parameters, function (err) {  // this.lastID won't be available with an arrow function here
            if (err)
            reject(err);
            else
            resolve(exports.getFilm(this.lastID));
        });
    });
};

// update an existing film
exports.updateFilm = (filmId, film) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE films SET title = ?, favorite = ?, watchdate = ?, rating = ? WHERE id = ?';
      db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, filmId], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(exports.getFilm(filmId)); 
      });
    });
};


exports.editRating = (filmId, rating) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET rating = ? WHERE id = ?';
    db.run(sql, [rating, filmId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getFilm(filmId)); 
    });
  });
}


exports.markFavorite = (filmId, favorite) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET favorite = ? WHERE id = ?';
    db.run(sql, [favorite, filmId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getFilm(filmId)); 
    });
  });
}

// Delete an existing film
exports.deleteFilm = (filmID) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM films WHERE id = ?';
      db.run(sql, [filmID], function (err) {  // this.changes won't be available with an arrow function here
        if (err){
          reject(err);
          return;
        }
        else
          // returning the number of affected rows: if nothing deleted, returns 0
          resolve(null);
      });
    });
  };
