'use strict';

/* Data Access Object (DAO) module for accessing users data */

const {db} = require('./db');
const crypto = require('crypto');

// This function returns user's information given its id.
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        const user = { id: row.id, email: row.email, name: row.name, surname: row.surname, role: row.role }
        resolve(user);
      }
    });
  });
};

// This function is used at log-in time to verify username and password.
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      }
      else {

        const user = { id: row.id, username: row.email, name: row.name, role: row.role };

        // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hashedPassword, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

// This function retrieves the whole list of users from the database.
exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); return; }

      const users = rows.map((e) => {
        // WARN: the database returns only lowercase fields. So, to be compliant with the client-side, we convert "creationdate" and "publicationdate" to the camelCase version ("creationDate" and "publicationDate").
        const user = Object.assign({}, e);
        delete user.hashedPassword; 
        delete user.salt; 
        return user;
      });
      resolve(users)
    });
  });
};
