'use strict';

const dayjs = require("dayjs");

function Film(id, title, favorites, date='', rating=0){
    this.id=id;
    this.title=title;
    this.favorites=favorites||false;
    this.date=date=='' ? '' : dayjs(date);
    this.rating=rating;
    
    this.toString = () => {
        return `\nId : ${this.id}, Title : ${this.title}, Favorite : ${this.favorites}, Watch date : ${this.date=='' ? "<not defined>" : this.date.format("MMMM DD, YYYY")}, Score : ${this.rating==0 ? "<not defined>" : this.rating}`;
    }
}

function FilmLibrary(){

    this.films = [];
    
    this.addNewFilm = (film) =>{
        this.films.push(film);
    }

    this.print=()=>{
        this.films.forEach(f=>{
            console.log(f.toString());
        })
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
       this.films.splice(this.films.filter(film => film.id === id),1);
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
}

const film1 = new Film(1,"Pulp Fiction", true,'March 10, 2023',5 );
const film2 = new Film(2, "21 Grams",true,"March 17, 2023",4);
const film3 = new Film(3, "Star Wars");
const film4 = new Film(4, "Matrix");
const film5 = new Film(5, "Shrek", false, "March 21, 2023",3);

const filmLibrary = new FilmLibrary();

filmLibrary.addNewFilm(film1);
filmLibrary.addNewFilm(film2);
filmLibrary.addNewFilm(film3);
filmLibrary.addNewFilm(film4);
filmLibrary.addNewFilm(film5);

console.log(filmLibrary.toString());

console.log("\n***** List of films sorted by date *****"+filmLibrary.sortByDate().toString());

console.log("\n***** List of films sorted by score *****"+filmLibrary.getRated().toString());

//filmLibrary.deleteFilm(1);
console.log(filmLibrary.toString());

console.log("\n***** List of favorite films *****"+filmLibrary.getFavorites().toString());
console.log("\n***** List of best rated films *****"+filmLibrary.getBestRated().toString());
console.log("\n***** List of films seen last month *****"+filmLibrary.getSeenLastMonth().toString());
console.log("\n***** List of films unseen *****"+filmLibrary.getUnseen().toString());

const favorite = filmLibrary.getFavorites();
for(const fav in favorite){
    console.log(favorite[fav].title);
}
