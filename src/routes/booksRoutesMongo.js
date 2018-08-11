const express = require('express');
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodReadServices');

function router() {
  // Load built it Express router
  const bookRouter = express.Router();
  const { getIndex, getId } = bookController(bookService);

  // Apply Middleware to Authenticate the user...
  bookRouter.use((req, res, next) => {
    debug(req.user);
    if (!req.user) res.redirect('/auth/signin');
    else next();
  });

  // Setup Routes
  bookRouter.route('/').get(getIndex);
  bookRouter.route('/:bookId').get(getId);

  return bookRouter;
}

module.exports = router;
