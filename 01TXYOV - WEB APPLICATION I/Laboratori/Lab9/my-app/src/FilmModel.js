'use strict';
import dayjs from 'dayjs';

function Film(id, title, favorite, watchDate, rating=0){
    this.id=id;
    this.title=title;
    this.favorite=favorite||false;
    this.watchDate=watchDate && dayjs(watchDate);
    this.rating=rating;
    
    this.toString = () => {
        return `\nId : ${this.id}, Title : ${this.title}, Favorite : ${this.favorite}, Watch date : ${this.watchDate=='' ? "<not defined>" : this.watchDate.format("MMMM DD, YYYY")}, Score : ${this.rating==0 ? "<not defined>" : this.rating}`;
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
        return [...this.films].filter(film=>film.date!='' && film.date<dayjs() && film.date>dayjs().subtract(30, 'days'))
    }

    this.getUnseen = () => {
        return [...this.films].filter(film=>film.date=='');
    }

    this.sortByDate = () => {
        return [...this.films].sort((a,b) => a.date=='' ? 1 : (a.date.isAfter(b.date) ? 1 : -1));
    }

    this.deleteFilm = (id) => {
       this.films.splice( this.films.filter(film => film.id === id),1);
    }

    this.resetWatchedFilms = () =>{
        for(let l of this.films){
            l.date='';
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

export {Film, FilmLibrary};