'use strict';

const dayjs = require('dayjs');

function Film(id, title, favorite, watchDate, rating=0, user=1){
    this.id=id;
    this.title=title;
    this.favorite=favorite||0;
    this.watchDate=watchDate;
    this.rating=rating;
    this.user=user;
    
    this.formatwatchDate = () => {
        return this.watchDate.format('YYYY-DD-MM').toString();
    }

}

function FilmLibrary(){

    this.films = [];
    
    this.addNewFilm = (film) =>{
        this.films.push(film);
    }

    this.init = () => {
        this.films.push(
            new Film(1,"Pulp Fiction", true,'March 10, 2023',5 ),
            new Film(2, "21 Grams",true,"March 17, 2023",4),
            new Film(3, "Star Wars"),
            new Film(4, "Matrix"),
            new Film(5, "Shrek", false, "March 21, 2023",3),
            new Film(6, "Titanic", true, "October 02, 2015",2)
        );
    }

    this.getFilms = () => {
        return [...this.films];
    }

    this.getFavorites = () => {
        return [...this.films].filter(film=>film.favorites==true);
    }

    this.getBestRated = () => {
        return [...this.films].filter(film=>film.rating==5);
    }

    this.getSeenLastMonth = () => {
        return [...this.films].filter(film=>film.watchDate!='' && film.watchDate<dayjs() && film.watchDate>dayjs().subtract(30, 'days'))
    }

    this.getUnseen = () => {
        return [...this.films].filter(film=>film.watchDate=='');
    }

    this.sortByDate = () => {
        return [...this.films].sort((a,b) => a.watchDate=='' ? 1 : (a.watchDate.isAfter(b.watchDate) ? 1 : -1));
    }

    this.deleteFilm = (id) => {
       this.films.splice( this.films.filter(film => film.id === id),1);
    }

    this.resetWatchedFilms = () =>{
        for(let l of this.films){
            l.watchDate='';
        }
    }

    this.getRated = () => {
        return [...this.films].sort((a,b) => (a.rating-b.rating ? 1 : -1)).filter(film => film.rating > 0);
    }

    this.toString = () => {
        return `\n***** List of films *****${this.films}`;
    }

    this.print=()=>{
        this.films.forEach(f=>{
            console.log(f.toString());
        })
    }
}

module.exports = {Film, FilmLibrary};