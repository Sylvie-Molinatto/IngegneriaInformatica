'use strict';

/** DB access module **/

const sqlite = require('sqlite3');

// open the database
exports.db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});
