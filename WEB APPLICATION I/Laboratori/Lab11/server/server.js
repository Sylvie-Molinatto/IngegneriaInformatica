/*** Importing modules ***/
const express = require('express');
const { check, validationResult, } = require('express-validator'); // validation middleware
const morgan = require('morgan');    
const cors = require('cors');

const filmDao = require('./dao-films'); // module for accessing the films table in the DB
const userDao = require('./user-dao');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

/*** init express and set-up the middlewares ***/
const app = express();
app.use(express.json());
app.use(morgan('dev'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect email and/or password');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Films Users APIs ***/


// GET /api/filters
// This route returns the list of filters (only "labels" and "ids").
app.get('/api/filters', 
(req, res) => {
  // When the "filters" object is serialized through this method, filter functions are not serialized.
  res.json(filmDao.listFilters())
});

// 1. Retrieve the list of all the available films.
// GET /api/films
// This route returns the FilmLibrary. It handles also "filter=?" query parameter
app.get('/api/films',
isLoggedIn,
  (req, res) => {
    // get films that match optional filter in the query
    filmDao.listFilms(req.user.id, req.query.filter)
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(films => res.json(films))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 2. Retrieve a film, given its “id”.
// GET /api/films/<id>
// Given a film id, this route returns the associated film from the library.
app.get('/api/films/:id',
isLoggedIn,
  [ check('id').isInt({min: 1}) ],    // check: is the id a positive integer?
  async (req, res) => {
    try {
      const result = await filmDao.getFilm(req.user.id, req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);


// 3. Create a new film, by providing all relevant information.
// POST /api/films
// This route adds a new film to film library.
app.post('/api/films',
isLoggedIn,
  [
    check('title').isLength({min: 1, max:160}),
    check('favorite').default(0).isBoolean(),
    // only date (first ten chars) and valid ISO
    check('watchDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('rating').default(0).isInt({min: 0, max: 5})
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    // WARN: note that we expect watchDate with capital D but the databases does not care and uses lowercase letters, so it returns "watchdate"
    const film = {
      title: req.body.title,
      favorite: req.body.favorite,
      watchDate: req.body.watchDate, // A different method is required if also time is present. For instance: (req.body.watchDate || '').split('T')[0]
      rating: req.body.rating,
      user: req.user.id  // alternatively you can use the user id in the request, but it is not safe
    };

    try {
      const result = await filmDao.createFilm(film); // NOTE: createFilm returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new film: ${err}` }); 
    }
  }
);

// 4. Update an existing film, by providing all the relevant information
// PUT /api/films/<id>
// This route allows to modify a film, specifiying its id and the necessary data.
app.put('/api/films/:id',
isLoggedIn,
  [
    check('id').isInt(),
    check('title').isLength({min: 1, max:160}),
    check('favorite').default(0).isBoolean(),
    // only date (first ten chars) and valid ISO
    check('watchDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('rating').default(0).isInt({min: 0, max: 5})
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
    }
    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const film = {
      id: req.body.id,
      title: req.body.title,
      favorite: req.body.favorite,
      watchDate: req.body.watchDate,
      rating: req.body.rating,
      user: req.user.id  // alternatively you can use the user id in the request, but it is not safe
    };

    try {
      const result = await filmDao.updateFilm(req.user.id, film.id, film);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of film ${req.params.id}: ${err}` });
    }
  }
);

// 5. Mark an existing film as favorite/unfavorite
// PUT /api/films/<id>/favorite 
// This route changes only the favorite value. It could also be a PATCH.
app.put('/api/films/:id/favorite',
isLoggedIn,
  [
    check('id').isInt(),  
    check('favorite').isBoolean(),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
    }

    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    try {
      const film = await filmDao.getFilm(req.user.id, req.params.id);
      if (film.error)
        return res.status(404).json(film);
      film.favorite = req.body.favorite;  // update favorite property
      const result = await filmDao.updateFilm(req.user.id, film.id, film);
      return res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the favorite update of film ${req.params.id}` });
    }
  }
);

// 6. Update the rating of a specific film
// PUT /api/films/<id>/rating 
// This route changes only the rating value. It could also be a PATCH.
app.put('/api/films/:id/rating',
isLoggedIn,
  [
    check('id').isInt(),  
    check('rating').isInt({ min: 0, max: 5 }),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
    }

    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    try {
      const film = await filmDao.getFilm(req.user.id, req.params.id);
      if (film.error)
        return res.status(404).json(film);
      film.rating = req.body.rating;  // update favorite property
      const result = await filmDao.updateFilm(req.film.id,film.id, film);
      return res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the rating update of film ${req.params.id}` });
    }
  }
);


// 7. Delete an existing film, given its “id”
// DELETE /api/films/<id>
// Given a film id, this route deletes the associated film from the library.
app.delete('/api/films/:id', isLoggedIn,
isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      await filmDao.deleteFilm(req.user.id, req.params.id);
      res.status(200).json({}); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of film ${req.params.id}: ${err} ` });
    }
  }
);

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

/* If we aren't interested in sending error messages... */
/*app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  // req.user contains the authenticated user, we send all the user info back
  res.status(201).json(req.user);
});*/

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
