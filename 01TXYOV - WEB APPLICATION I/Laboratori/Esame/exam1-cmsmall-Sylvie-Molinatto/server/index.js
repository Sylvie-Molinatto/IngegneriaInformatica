/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');    
const cors = require('cors');
const { check, validationResult, } = require('express-validator'); // validation middleware

const pagesDao = require('./pages_dao'); // module for accessing the pages table in the DB
const usersDao = require('./user_dao');

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
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await usersDao.getUser(username, password);
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

const isAdmin = (req, res, next) => {
  // Assuming you have a property in the user object indicating admin status
  if (req.user.role==='Admin') {
    next(); // Proceed to the next middleware
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
}

/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Pages Users APIs ***/

// 1. Retrieve the list of all the available pages.
// GET /api/pages
app.get('/api/pages',
isLoggedIn,
  (req, res) => {
    pagesDao.listPages()
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pages => res.json(pages))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 2. Retrieve the list of all the published pages.
// GET /api/publishedPages
app.get('/api/publishedPages',
  (req, res) => {
    pagesDao.listPublishedPages()
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pages => res.json(pages))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 3. Retrieve a page, given its “id”.
// GET /api/pages/<id>
// Given a page id, this route returns the associated page.
app.get('/api/pages/:id',
[
  check('id').isInt({min:1})
],
  async (req, res) => {
    try {
      const result = await pagesDao.getPage(req.params.id);
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

// 4. Retrieve the blocks of a page.
// GET /api/pages/:id/blocks
app.get('/api/pages/:id/blocks',
[
  check('id').isInt({min: 1})
],
  (req, res) => {
    pagesDao.getPageBlocks(req.params.id)
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pageBlocks => res.json(pageBlocks))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 5. Retrieve a page block, given its 'id'.
// GET /api/pages/:pageid/blocks/:blockid
app.get('/api/pages/:pageid/blocks/:blockid',
[
  check('pageid').isInt({min: 1}),
  check('blockid').isInt({min: 1})
],
  (req, res) => {
    pagesDao.getPageBlock(req.params.pageid, req.params.blockid)
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pageBlock => res.json(pageBlock))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 6. Retrieve the user, given its "id".
// GET /api/users/:id
// Given a user id, this route returns the associated informations of the user
app.get('/api/users/:id',
[
  check('id').isInt({min: 1})
],
  async (req, res) => {
    try {
      const result = await usersDao.getUserById(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// 7. Retrieve the website name.
// GET /api/website-name
app.get('/api/website-name',
  async (req, res) => {
    try {
      const result = await pagesDao.getWebsiteName();
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

// 8. Create a new page
// POST /api/pages
// This route adds a new page
app.post('/api/pages',
isLoggedIn,
  [
    check('title').isLength({min: 1, max:160}),
    check('creationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('publicationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('author').isInt({min: 1})
  ], 
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const page = {
      title: req.body.title,
      author: req.body.author,
      creationDate: req.body.creationDate, 
      publicationDate: req.body.publicationDate,
    };

    try {
      const result = await pagesDao.createNewPage(page); // NOTE: createNewPage returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new page: ${err}` }); 
    }
  }
);

// 9. Create a new block
// POST /api/pages/:id/block
// This route adds a new block
app.post('/api/pages/:id/block',
isLoggedIn, 
  [
    check('id').isInt({min:1}),
    check('type').isIn(['header', 'paragraph', 'image']).withMessage('Invalid block type'),
    check('content').isString().isLength({min: 1, max:1000}),
    check('position').isInt()
  ], 
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const block = {
      pageid: req.params.id,
      type: req.body.type, 
      content: req.body.content,
      position: req.body.position
    };

    try {
      const result = await pagesDao.createNewBlock(req.params.id, block); // NOTE: createNewPage returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new page: ${err}` }); 
    }
  }
);

// 10. Update an existing page
// POST /api/pages/:id
// This route allows to modify a page, specifiyng its id and the necessary data.
app.put('/api/pages/:id',
isLoggedIn,
  [
    check('pageid').isInt(),
    check('title').isLength({min: 1, max:160}),
    check('creationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('publicationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('author').isInt()
  ], 
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    // Is the id in the body equal to the id in the url?
    if (req.body.pageid !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const page = {
      pageid: req.body.pageid,
      title: req.body.title,
      author: req.body.author,
      creationDate: req.body.creationDate, 
      publicationDate: req.body.publicationDate,
    };

    try {
      const result = await pagesDao.updatePage(page); 
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of page ${req.params.id}: ${err}` }); 
    }
  }
);

// 11. Update an existing page block
// POST /api/pages/:pageid/blocks/:blockid
// This route allows to modify a page block, specifiyng its id and the necessary data.
app.put('/api/pages/:pageid/blocks/:blockid',
isLoggedIn,
  [
    check('pageid').isInt({min: 1}),
    check('blockid').isInt({min: 1}),
    check('content').isString().isLength({min: 1, max:1000}),
    check('position').isInt({min: 1})
  ], 
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    // Is the pageid in the body equal to the pageid in the url?
    if (req.body.pageid !== Number(req.params.pageid)) {
      return res.status(422).json({ error: 'URL and body pageid mismatch' });
    }

    // Is the blockid in the body equal to the blockid in the url?
    if (req.body.blockid !== Number(req.params.blockid)) {
      return res.status(422).json({ error: 'URL and body blockid mismatch' });
    }

    const block = {
      pageid: req.body.pageid,
      blockid: req.body.blockid,
      content: req.body.content,
      position: req.body.position
    };

    try {
      const result = await pagesDao.updatePageBlock(block); 
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of page block ${req.params.blockid}: ${err}` }); 
    }
  }
);

// 12. Delete an existing page, given its “id”
// DELETE /api/pages/:id
// Given a page id, this route deletes the associated page from the library.
app.delete('/api/pages/:id', isLoggedIn,
isLoggedIn,
  [ check('id').isInt({min:1}) ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      await pagesDao.deletePage(req.params.id);
      res.status(200).json({}); 
    } catch (err) {
      res.status(500).end();
    }
  }
);

// 13. Delete a specific page block , given pageid and blockid
// DELETE /api/pages/:pageid/blocks/:blockid
// Given a page id and a blockid this route deletes the associated block.
app.delete('/api/pages/:pageid/blocks/:blockid', isLoggedIn,
isLoggedIn,
  [ check('pageid').isInt({min: 1}) ],
  [ check('blockid').isInt({min: 1}) ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      await pagesDao.deletePageBlock(req.params.pageid, req.params.blockid);
      res.status(200).json({}); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of the block number ${req.params.blockid} of the page ${req.params.pageid}: ${err} ` });
    }
  }
);

// 14. Delete page blocks, given pageid
// DELETE /api/pages/:pageid/blocks
// Given a page id, this route deletes the associated blocks.
app.delete('/api/pages/:id/blocks', isLoggedIn,
isLoggedIn,
  [ check('id').isInt({min: 1}) ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      await pagesDao.deletePageBlocks(req.params.id);
      res.status(200).json({}); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of blocks of the page ${req.params.id}: ${err} ` });
    }
  }
);

// 15. Get all users
// GET /api/users/
app.get('/api/users',
isLoggedIn,
isAdmin,
  async (req, res) => {
    try {
      const result = await usersDao.getUsers();
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

// 16. Update website name
// PUT /api/website-name
app.put('/api/website-name',
isLoggedIn,
isAdmin,
[
  check('name').isString().isLength({min: 1, max: 30})
],
  async (req, res) => {

    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    
    try {
      const result = await pagesDao.updateWebsiteName(req.body.name);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

/*** Authentication APIs ***/

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
  