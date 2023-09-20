'use strict'

// imports
const express = require('express');
const morgan = require('morgan');
const dao = require('./dao');
const dayjs = require('dayjs');
//const film = require('./FilmModel');

// init
const app = express();
const port = 3000;

// set up middlewares
app.use(express.json());
app.use(morgan('dev'));

/* ROUTES */

// GET /api/filters
// This route returns the list of filters (only "labels" and "ids").
app.get('/api/filters', 
(req, res) => {
  // When the "filters" object is serialized through this method, filter functions are not serialized.
  res.json(dao.listFilters())
});

// GET /api/films
app.get('/api/films',(req, res)=> {
    dao.listFilms(req.query.filter)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
})

// GET /api/films/<id>
app.get('/api/films/:id', async(req, res) => {
    try{
        const result = await dao.getFilm(req.params.id);
        if (result.error)
            res.status(404).json(result);
        res.json(result);
    }catch{
        res.status(500).end();
    }
});

// POST /api/films/new
app.post('/api/films/new', async(req, res) => {
try{
    const film = await dao.addFilm(req.body);
    res.status(201).end();
}catch{
    res.status(503).end();
}
})

// PUT api/films/<id>/edit
app.put('/api/films/:id/edit', async(req,res) => {
    try {
        const result = await dao.updateFilm(req.params.id, req.body);
        if (result.error)
            res.status(404).json(result);
        res.json(result); 
      } catch (err) {
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}: ${err}` });
      }
})

// PUT /api/films/<id>/rating
app.put('/api/films/:id/rating', async(req, res) => {
    try {
        const result = await dao.editRating(req.params.id, req.body.rating);
        if (result.error)
            res.status(404).json(result);
        return res.json(result); 
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
    }
   
})

// PUT /api/films/<id>/favorite
app.put('/api/films/:id/favorite', async(req,res) => {
    try {
        const result = await dao.markFavorite(req.params.id, req.body.favorite);
        if (result.error)
            res.status(404).json(result);
        return res.json(result); 
      } catch (err) {
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
      }
})

// DELETE /api/films/<id>/delete
app.delete('/api/films/:id/delete', async(req,res) => {
    try{
        const result = await dao.deleteFilm(req.params.id);
        if(result.err)
            res.status(404).end();
        res.status(204).end();
    }catch{
        res.status(503).end();
    }
})

// start the server
app.listen(port, () => 'API server started');