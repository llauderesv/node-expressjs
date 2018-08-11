const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        const url = 'mongodb://localhost:27017';
        const libraryApp = 'libraryApp';

        // Validate the user when logged in to Mongo Db Database...
        (async function mongo() {
          let client;

          try {
            client = await MongoClient.connect(url);
            debug('Successfully connected to MongoDB Client');

            const db = client.db(libraryApp);
            const col = db.collection('users');
            const user = await col.findOne({ username });
            debug(user);
            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (e) {
            debug(`Error occured: ${e.stack}`);
          }

          client.close();
        })();
      }
    )
  );
};
