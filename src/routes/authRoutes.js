const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

function router(nav) {
  const authRouter = express.Router();

  // Sign Up Route
  authRouter.route('/signUp').post((req, res) => {
    const { username, password } = req.body;
    const url = 'mongodb://localhost:27017';
    const libraryApp = 'libraryApp';

    (async function addUser() {
      let client;

      try {
        client = await MongoClient.connect(url);
        debug('Successfully connected to MongoDB Client');

        const db = client.db(libraryApp);
        const col = db.collection('users');
        const result = await col.insertOne({ username, password });
        debug(result);
        const [registeredUser] = result.ops;
        debug(registeredUser);
        req.logIn(registeredUser, () => {
          res.redirect('/auth/profile');
        });
      } catch (e) {
        debug(`Error occured: ${e}`);
      }
      client.close();
    })();
  });

  // Profile Route
  authRouter
    .route('/profile')
    .all((req, res, next) => {
      if (!req.user) res.redirect('/auth/signin');
      else next();
    })
    .get((req, res) => {
      debug(nav);
      const { username, password } = req.user;
      res.render('profile', {
        nav: res.nav,
        title: 'Profile Page',
        username,
        password,
      });
    });

  // Sign In Route
  authRouter
    .route('/signin')
    .all((req, res, next) => {
      debug('Sign In Page');
      if (req.user) res.redirect('/auth/profile');
      else next();
    })
    .get((req, res) => {
      res.render('signin', {
        nav: res.nav,
        title: 'Sign In Page',
      });
    })
    .post(
      passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/',
      })
    );

  // Log out Route
  authRouter.route('/logout').all((req, res, next) => {
    req.logOut();
    res.redirect('/');
    next();
  });

  return authRouter;
}

module.exports = router;
