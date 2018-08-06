const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

// Using MongoDB Database...
function router(nav) {
  const adminRouter = express.Router();

  adminRouter.route('/').get((req, res) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected Successfully to MongoDB Database');

        const db = client.db(dbName);

        const response = await db.collection('books').insertMany([
          {
            bookId: 1,
            title: 'Test Title',
            author: 'Test Author',
          },
          {
            bookId: 2,
            title: 'Test Title',
            author: 'Test Author',
          },
          {
            bookId: 3,
            title: 'Test Title',
            author: 'Test Author',
          },
          {
            bookId: 4,
            title: 'Test Title',
            author: 'Test Author',
          },
          {
            bookId: 5,
            title: 'Test Title',
            author: 'Test Author',
          },
        ]);

        res.json(response);
      } catch (error) {
        debug(`Error Occured: ${error.stack}`);
      }
      client.close();
    })();
  });

  return adminRouter;
}

module.exports = router;
