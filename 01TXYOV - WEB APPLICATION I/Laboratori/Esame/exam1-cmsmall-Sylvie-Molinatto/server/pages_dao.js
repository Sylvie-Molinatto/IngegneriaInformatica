'use strict';

/* Data Access Object (DAO) module for accessing pages data */

const { db } = require('./db');
const dayjs = require("dayjs");

const isPublished = (page) => {
  if (page.publicationDate == null || typeof page.publicationDateDate.diff !== 'function' || page.publicationDate > dayjs())
    return false;
  return true;
};

// This function retrieves the whole list of pages from the database.
exports.listPages = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); return; }

      const pages = rows.map((e) => {
        // WARN: the database returns only lowercase fields. So, to be compliant with the client-side, we convert "creationdate" and "publicationdate" to the camelCase version ("creationDate" and "publicationDate").
        const page = Object.assign({}, e, { creationDate: e.creationdate, publicationDate: e.publicationdate });
        delete page.creationdate;  // removing lowercase "creationdate"
        delete page.publicationdate; // removing lowercase "publicationdate"
        return page;
      });
      resolve(pages)
    });
  });
};

// This function retrieves the whole list of pages from the database.
exports.listPublishedPages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM pages WHERE publicationdate<>'' AND date(publicationdate)<=date()";
    db.all(sql, (err, rows) => {
      if (err) { reject(err); return; }

      const pages = rows.map((e) => {
        // WARN: the database returns only lowercase fields. So, to be compliant with the client-side, we convert "creationdate" and "publicationdate" to the camelCase version ("creationDate" and "publicationDate").
        const page = Object.assign({}, e, { creationDate: e.creationdate, publicationDate: e.publicationdate });
        delete page.creationdate;  // removing lowercase "creationdate"
        delete page.publicationdate; // removing lowercase "publicationdate"
        return page;
      });
      resolve(pages)
    });
  });
};

// This function retrieves a page given its id and the author user id.
exports.getPage = (pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages WHERE pageid=?';
    db.get(sql, [pageid], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Page not found.' });
      } else {
        // WARN: database is case insensitive. Converting "creationdate" and "publicationdate" to camel case format
        const page = Object.assign({}, row, { creationDate: row.creationdate }, { publicationDate: row.publicationdate });
        delete page.creationdate;  // removing lowercase "creationdate"
        delete page.publicationdate; // removing lowercase "publicationdate"
        resolve(page);
      }
    });
  });
};


// This function retrieves page blocks given page id.
exports.getPageBlocks = (pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM blocks WHERE pageid=? ORDER BY position';
    db.all(sql, [pageid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const pageBlocks = rows.map((e) => {
        const pageBlock = Object.assign({}, e);
        return pageBlock;
      });
      resolve(pageBlocks)
    });
  });
};

// This function retrieves page block given block id and page id.
exports.getPageBlock = (pageid, blockid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM blocks WHERE pageid=? AND blockid=?';
    db.get(sql, [pageid, blockid], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Block not found.' });
      } else {
        // WARN: database is case insensitive. Converting "creationdate" and "publicationdate" to camel case format
        const pageBlock = Object.assign({}, row);
        resolve(pageBlock);
      } 
    });
  });
};

// This function retrieves the website name.
exports.getWebsiteName = (pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT name FROM website_name';
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Page not found.' });
      } else {
        const websiteName = Object.assign({}, row);
        resolve(websiteName);
      }
    });
  });
};

// This function allow to create a new page
exports.createNewPage = (page) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO pages (title, author, creationdate, publicationdate) VALUES (?,?,?,?)'
    db.run(sql, [page.title, page.author, page.creationDate, page.publicationDate], function (err) {
      if (err) {
        reject(err);
        return;
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getPage(this.lastID));
    });
  })
}

// This function allows to create a new block for a page
exports.createNewBlock = (pageid, block) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO blocks (pageid, type, content, position) VALUES (?,?,?,?)'
    db.run(sql, [pageid, block.type, block.content, block.position], function (err) {
      if (err) {
        reject(err);
        return;
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getPageBlock(pageid, this.lastID));
    });
  })
};

// This function allows to update a page
exports.updatePage =  (page) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE pages SET title=?, publicationdate=?, author=? WHERE pageid=?'
    db.run(sql, [page.title, page.publicationDate, page.author, page.pageid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getPage(page.pageid));
    });
  })
}

// This function allows to update a block of a page
exports.updatePageBlock =  (block) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE blocks SET content=?, position=? WHERE pageid=? AND blockid=?'
    db.run(sql, [block.content, block.position, block.pageid, block.blockid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getPageBlock(block.pageid, block.blockid));
    });
  })
}


// This function allows to delete a page
exports.deletePage =  (pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM pages WHERE pageid=?'
    db.run(sql, [pageid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  })
}

// This function allows to delete a specific page block
exports.deletePageBlock =  (pageid, blockid) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM blocks WHERE pageid=? and blockid=?'
    db.run(sql, [pageid, blockid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  })
}

// This function allows to delete all page blocks
exports.deletePageBlocks =  (pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM blocks WHERE pageid=?'
    db.run(sql, [pageid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  })
}

// This function allows to update the website name
exports.updateWebsiteName =  (name) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE website_name SET name=? WHERE id=1'
    db.run(sql, [name], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getWebsiteName());
    });
  })
}