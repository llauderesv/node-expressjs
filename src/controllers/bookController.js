const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

module.exports = function bookController(bookService) {
  const getIndex = (req, res) => {
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
        // const author = await bookService.getAuthors();
        // debug(author);
        // debug('Successfully Fetched the books: ', books);

        res.render('bookListView', {
          title: 'Books',
          nav: res.nav,
          books,
        });
      } catch (error) {
        debug(`Error Occured: ${error.stack}`);
      }
      client.close();
    })();
  };

  const getId = (req, res) => {
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

        // debug('Finding One Books.', book);
        book.details = await bookService.getBookById(book.bookId);

        debug(book.details.description);
        res.render('bookView', {
          title: 'Book Detailed Page',
          nav: res.nav,
          book,
        });
      } catch (error) {
        debug(`Error Occured: ${error.stack}`);
      }
      client.close();
    })();
  };

  return {
    getIndex,
    getId,
  };
};
