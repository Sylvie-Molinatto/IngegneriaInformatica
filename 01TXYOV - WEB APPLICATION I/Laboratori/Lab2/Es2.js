'use strict';
const dayjs = require('dayjs');
const sqlite = require('sqlite3');

const db = new sqlite.Database('films-copy.db', (err) => {
    if(err) throw err;
});

function Film(id, title, isFavorite = false, watchDate, rating) {
  this.id = id;
  this.title = title;
  this.favorite = isFavorite;
  this.rating = rating;
  // saved as dayjs object
  this.watchDate = watchDate && dayjs(watchDate);

  this.toString = () => {
    return `Id: ${this.id}, ` +
    `Title: ${this.title}, Favorite: ${this.favorite}, ` +
    `Watch date: ${this._formatWatchDate('MMMM D, YYYY')}, ` +
    `Score: ${this._formatRating()}` ;
  }

  this._formatWatchDate = (format) => {
    return this.watchDate ? this.watchDate.format(format) : '<not defined>';
  }

  this._formatRating = () => {
    return this.rating  ? this.rating : '<not assigned>';
  }
}


function FilmLibrary() {
  this.list = [];

  this.print = () => {
    console.log("***** List of films *****");
    this.list.forEach((item) => console.log(item.toString()));
  }

  this.addNewFilm = (film) => {
    if(!this.list.some(f => f.id == film.id))
      this.list.push(film);
    else
      throw new Error('Duplicate id');
  };

  this.deleteFilm = (id) => {
    const newList = this.list.filter(function(film, index, arr) {
      return film.id !== id;
    })
    this.list = newList;
  } 

  this.resetWatchedFilms = () => {
    this.list.forEach((film) => delete film.watchDate);
  }

  this.getRated = () => {
    const newList = this.list.filter(function(film, index, arr) {
      return film.rating > 0;
    })
    return newList;
  }

  this.sortByDate = () => {
    const newArray = [...this.list];
    newArray.sort((d1, d2) => {
      if(!(d1.watchDate)) return  1;   // null/empty watchDate is the lower value
      if(!(d2.watchDate)) return -1;
      return d1.watchDate.diff(d2.watchDate, 'day')
    });
    return newArray;
  }

  this.getAllFilms = function getAllFilms(){
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM films";
        db.all(sql,[],(err,rows) => {
            if(err){
              reject(err);
            }
            else{
              const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
              resolve(films);
            }
        });
    });
  }

  this.getAllFavoriteFilms = function getAllFavoriteFilms(){
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM films WHERE favorite=1";
        db.all(sql,[],(err,rows) => {
            if(err){
              reject(err);
            }
            else{
              const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
              resolve(films);
            }
        });
    });
  }

    this.getAllFilmsWatchedToday = function getAllFilmsWatchedToday(){
      return new Promise((resolve, reject)=> {
          const sql = "SELECT * FROM films WHERE watchdate=?";
          db.all(sql,[dayjs().format("YYYY-MM-DD")],(err,rows) => {
              if(err){
                reject(err);
              }
              else{ 
                const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                resolve(films);
              }
          });
      });
    }

    this.getAllFilmsWatchedBefore = function getAllFilmsWatchedBefore(date){
      return new Promise((resolve, reject)=> {
          const sql = "SELECT * FROM films WHERE watchdate<?";
          db.all(sql,[date.format("YYYY-MM-DD")],(err,rows) => {
              if(err){
                reject(err);
              }
              else{
                const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                resolve(films);
              }
          });
      });
    }

    this.getAllFilmsScoredLowerThan = function getAllFilmsScoredLowerThan(score){
      return new Promise((resolve, reject)=> {
          const sql = "SELECT * FROM films WHERE rating<=?";
          db.all(sql,[score],(err,rows) => {
              if(err){
                reject(err);
              }
              else{
                const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                resolve(films);
              }
          });
      });
    }

    this.getAllFilmsByTitle = function getAllFilmsByTitle(title){
      return new Promise((resolve, reject)=> {
          const sql = "SELECT * FROM films WHERE title LIKE?";
          db.all(sql,['%'+title+'%'],(err,rows) => {
              if(err){
                reject(err);
              }
              else{
                const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                resolve(films);
              }
          });
      });
    }

    this.addFilm = function addFilm(film){
        return new Promise((resolve, reject)=> {
            const sql = "INSERT INTO films VALUES (?,?,?,?,?)";
            db.run(sql,[film.id, film.title, film.favorite, film.watchdate, film.rating], (err) => {
              if (err) reject(err);
              else resolve('Film added : '+film.title);
            });   
        });
      }

      this.deleteFilm = function deleteFilm(id){
        return new Promise((resolve, reject)=> {
            const sql = "DELETE FROM films WHERE id=?";
            db.run(sql,[id], (err) => {
              if (err) reject(err);
              else resolve('Film with id '+id+' deleted');
            });   
        });
      }

      this.deleteWatchDates = function deleteWatchDates(){
        return new Promise((resolve, reject)=> {
            const sql = "UPDATE films SET watchdate = NULL";
            db.run(sql, (err) => {
              if (err) reject(err);
              else resolve('Watchdate deleted');
            });   
        });
      }

}

async function main() {

  const library = new FilmLibrary();
  
  const films = await library.getAllFilms();
  console.log("******* FILMS IN THE DATABASE ********");
  films.forEach((film) => console.log(film.toString()));

  const favoriteFilms = await library.getAllFavoriteFilms();
  console.log("******* FAVORITE FILMS  ********");
  favoriteFilms.forEach((film) => console.log(film.toString()));

  const filmsWatchedToday = await library.getAllFilmsWatchedToday();
  console.log("******* FILMS WATCHED TODAY  ********");
  filmsWatchedToday.forEach((film) => console.log(film.toString()));

  const date = dayjs(("2023-03-22"));
  const filmsWatchedBefore = await library.getAllFilmsWatchedBefore(date);
  console.log("******* FILMS WATCHED BEFORE ",date.format("YYYY-MM-DD")," ********");
  filmsWatchedBefore.forEach((film) => console.log(film.toString()));

  const score = 4;
  const filmsScoredLowerThan = await library.getAllFilmsScoredLowerThan(score);
  console.log("******* FILMS SCORED LOWER THAN ",score," ********");
  filmsScoredLowerThan.forEach((film) => console.log(film.toString()));

  const string = "Wars";
  const filmsByTitle = await library.getAllFilmsByTitle(string);
  console.log("******* FILMS WITH TITLE CONTAINING THE STRING '",string,"' ********");
  filmsByTitle.forEach((film) => console.log(film.toString()));
 
  
  const deleteFilm = await library.deleteFilm(6);
  console.log(deleteFilm);

  const deleteFilm2 = await library.deleteFilm(7);
  console.log(deleteFilm2);
  
  const film = new Film(6, "Avatar", true, dayjs("2023-01-23"), 5);
  const newFilm = await library.addFilm(film);
  console.log(newFilm); 

  const film2 = new Film(7, "Titanic", false, dayjs("2016-06-20"),1);
  const newFilm2 = await library.addFilm(film2);
  console.log(newFilm2); 

  /*
  const deleteWatchDate = await library.deleteWatchDates();
  console.log(deleteWatchDate); */

  db.close();
}

debugger;
main();

