const express = require('express');
const debug = require('debug')('app');
const sql = require('mssql');

function router(nav) {
  const bookRouter = express.Router(); // Load built it Express router

  // Setup Routes
  bookRouter.route('/').get((req, res) => {
    (async function query() {
      const request = new sql.Request(); // Connecting to MSSQL Azure Database
      // Create a Query
      const { recordset } = await request.query('SELECT * FROM Books');
      debug('Result successfully fetched:', recordset);

      res.render('bookListView', {
        title: 'Books',
        nav,
        books: recordset,
      });
    })();
  });

  bookRouter.route('/:bookId').get((req, res) => {
    (async function query() {
      const { bookId } = req.params;
      const request = new sql.Request(); // Connecting to MSSQL Azure Database
      // Create a Query
      const { recordset } = await request
        .input('bookId', sql.Int, bookId)
        .query('SELECT * FROM Books WHERE bookId = @bookId');

      debug('Successfully fetched Details:', recordset[0]);

      res.render('bookView', {
        title: 'Book Detailed View',
        nav,
        book: recordset[0],
      });
    })();
  });
  return bookRouter;
}

module.exports = router;
