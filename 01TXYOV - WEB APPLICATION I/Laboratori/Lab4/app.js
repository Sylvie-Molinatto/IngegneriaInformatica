'use strict';

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

function fillFilmsList(films) {

    const filmList = document.getElementById('list-films');
    filmList.textContent='';
    for(const film in films) {
      // Classic Way 
      const film1 = createFilmRow(films[film]);  
      filmList.appendChild(film1);            

      // String Literal Way
      // const ansEl = createFilmRowLiteral(film);
      //filmList.insertAdjacentHTML('afterbegin', ansEl);
    }
}



function createFilmRow(film){

    const li = document.createElement('li');
    li.className="list-group-item";
    li.id=film.id

    const div = document.createElement('div');
    div.className="d-flex w-100 justify-content-between";
    li.appendChild(div);

    // <button class="btn-trash" ><i class="fa fa-trash"></i></button>
    const button = document.createElement('button');
    button.className="btntrash";
    button.id=film.id;
    div.appendChild(button);

    button.addEventListener('click', e => {
        console.log(e);
        document.getElementById(e.target.id).remove();
        console.log(e.target.id);
    })

    const icon = document.createElement('i');
    icon.className = "fa fa-trash";
    icon.id=film.id;
    button.appendChild(icon);

    // Film title
    const pTitle = document.createElement('p');
    pTitle.innerText = film.title;
    pTitle.className="text-start col-md-3 col-3";
    if(film.favorites==true){
        pTitle.className="favorite text-start col-md-3 col-3";
    }
    div.appendChild(pTitle);
    
    // Span
    const span = document.createElement('span');
    span.className="custom-control custom-checkbox col-md-2 col-3";
    div.appendChild(span);

    // Checkbox
    const inputCheckBox = document.createElement('input');
    inputCheckBox.type="checkbox";
    inputCheckBox.className="custom-control-input checkbox";
    inputCheckBox.id = "check-f"+film.id;
    if(film.favorites==true){
        inputCheckBox.checked=true;
    }
    span.appendChild(inputCheckBox);

    // Label
    const label = document.createElement('label');
    label.innerText=" Favorite";
    label.className="custom-control-label";
    label.htmlFor="check-f"+film.id;
    span.appendChild(label);


    const small = document.createElement('small');
    small.className="watch-date col-md-3 col-3";
    small.innerText=(film.date=='' ? "" : film.date.format("MMMM DD, YYYY"));
    div.appendChild(small);

    const span3 = document.createElement("span");
    span3.className="rating text-end col-md-3 col-3";
    div.appendChild(span3);
    for(let i=0;i<film.rating;i++){
        const img = document.createElement("img");
        img.className="bi bi-star-fill";
        img.src="star-fill.svg";
        img.alt="star-fill"
        span3.appendChild(img);
    }

    if(film.rating<5){
        for(let i=0;i<5-film.rating;i++){
            const img = document.createElement("img");
            img.className="bi bi-star";
            img.src="star.svg";
            img.alt="star"
            span3.appendChild(img);
        }
    }
    
    return li;
}

// STRING LITERAL WAY
function createFilmRowLiteral(film) {
    return `<li class="list-group-item" id="${film.title}">
              <div class="d-flex w-100 justify-content-between">
                <p class="${film.favorites=='' ? "" : "favorite"} text-start col-md-4 col-3">${film.title}</p>
                <span class="custom-control custom-checkbox col-md-2 col-3">
                  <input type="checkbox" class="custom-control-input" id="check-f${film.id}" ${film.favorites=='' ? "" : "checked"}>
                  <label class="custom-control-label" for="check-f${film.id}">Favorite</label>
                </span>
                <small class="watch-date col-md-3 col-3">${film.date=='' ? "<not defined>" : film.date.format("MMMM DD, YYYY")}</small>
                <span class="rating text-end col-md-3 col-3">
                  <p class='rating'>${film.rating} </p>
                </span>
              </div>
            </li>`
  }

function addListeners(){

    const filmLibrary = new FilmLibrary();
    filmLibrary.init();

    const all = document.getElementById("filter-all");
    all.addEventListener('click', e => {
        console.log(e);
        console.log(e.target.id);

        [].slice.call(document.getElementsByClassName('list-group-item list-group-item-action'))
        .forEach(function(elem) {
            elem.classList.remove('active');
        });
        document.getElementById("filter-all").classList.add("active");
        document.getElementById('filter-title').innerText='All';
        const films = filmLibrary.getFilms();
        fillFilmsList(films);
    });

    const fav = document.getElementById("filter-favorites");
    fav.addEventListener('click', e => {
        console.log(e);
        console.log(e.target.id);

        [].slice.call(document.getElementsByClassName('list-group-item list-group-item-action'))
        .forEach(function(elem) {
            elem.classList.remove('active');
        });
        e.target.classList.remove("active");
        document.getElementById("filter-favorites").classList.add("active");
        document.getElementById('filter-title').innerText='Favorites';
        const fav = filmLibrary.getFavorites();
        fillFilmsList(fav);
    });

    const best = document.getElementById("filter-best");
    best.addEventListener('click', e => {
        console.log(e);
        console.log(e.target.id);

        [].slice.call(document.getElementsByClassName('list-group-item list-group-item-action'))
        .forEach(function(elem) {
            elem.classList.remove('active');
        });

        document.getElementById("filter-best").classList.add("active");
        document.getElementById('filter-title').innerText='Best Rated';
        const best = filmLibrary.getBestRated();
        fillFilmsList(best);
    });

    const seenLastMonth = document.getElementById("filter-seen-last-month");
    seenLastMonth.addEventListener('click', e => {
        console.log(e);
        console.log(e.target.id);

        [].slice.call(document.getElementsByClassName('list-group-item list-group-item-action'))
        .forEach(function(elem) {
            elem.classList.remove('active');
        });

        document.getElementById("filter-seen-last-month").classList.add("active");
        document.getElementById('filter-title').innerText='Seen Last Month';
        const seenLastMonth = filmLibrary.getSeenLastMonth();
        fillFilmsList(seenLastMonth);
    });

    const unseen = document.getElementById("filter-unseen");
    unseen.addEventListener('click', e => {
        console.log(e);
        console.log(e.target.id);

        [].slice.call(document.getElementsByClassName('list-group-item list-group-item-action'))
        .forEach(function(elem) {
            elem.classList.remove('active');
        });

        document.getElementById("filter-unseen").classList.add("active");
        document.getElementById('filter-title').innerText='Unseen';
        const unseen = filmLibrary.getUnseen();
        fillFilmsList(unseen);
    });
}

function main(){
    const filmLibrary = new FilmLibrary();
    filmLibrary.init();
    const films = filmLibrary.getFilms();
    fillFilmsList(films);
    addListeners();
}

main();