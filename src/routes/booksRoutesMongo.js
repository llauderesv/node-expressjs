const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  const bookRouter = express.Router(); // Load built it Express router

  // Setup Routes
  bookRouter.route('/').get((req, res) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected Successfully to MongoDB Database.');

        const db = client.db(dbName);
        const collection = await db.collection('books');
        const books = await collection.find().toArray();
        debug('Successfullt Fetched the books: ', books);

        res.render('bookListView', {
          title: 'Books',
          nav,
          books,
        });
      } catch (error) {
        debug(`Error Occured: ${error.stack}`);
      }
      client.close();
    })();
  });

  bookRouter.route('/:bookId').get((req, res) => {
    const { bookId } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected Successfully to MongoDB Database.');

        const db = client.db(dbName);
        const collection = await db.collection('books');
        const book = await collection.findOne({ _id: ObjectID(bookId) });
        debug('Finding One Books.', book);

        res.render('bookView', {
          title: 'Book Detailed View',
          nav,
          book,
        });
      } catch (error) {
        debug(`Error Occured: ${error.stack}`);
      }
      client.close();
    })();
  });
  return bookRouter;
}

module.exports = router;
