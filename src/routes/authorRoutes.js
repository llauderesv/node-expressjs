const express = require('express');
const debug = require('debug')('app:authorRoutes');
const authorController = require('../controllers/authorController');
const bookService = require('../services/goodReadServices');

function router() {
  const authorRoutes = express.Router();

  authorRoutes.get('/', (req, res) => {
    (async function getListAuthors() {
      const { books } = await bookService.getAuthors();
      debug(books);
      res.render('authorView', {
        nav: res.nav,
        title: "Tim O'Reilly Books",
        books: books.book,
      });
    })();
  });

  return authorRoutes;
}

module.exports = router;
