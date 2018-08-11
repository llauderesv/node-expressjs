const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const config = {
  user: 'psvincelibrary',
  password: '_tv954Llaudere$',
  server: 'psvincelibrary.database.windows.net',
  database: 'PSLibrary',
  // pool: {
  //   max: 10,
  //   min: 0,
  //   idleTimeoutMillis: 30000,
  // },
  options: {
    encrypt: true,
  },
};

sql.connect(config).catch(error => debug(error));
app.use(morgan('tiny'));

// User Body Parser for submitting form...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({ secret: 'my-library' }));

require('./src/config/passport.js')(app);
// Applying Custom Middleware
// Middleware is function that comes in...
// app.use((req, res, next) => {
//   debug('My Middleware');
//   next();
// });
// Use to load static files in your app...
app.use(express.static(path.join(__dirname, '/public/')));
// Load some external library files...
app.use(
  '/css',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/jquery/dist'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js'))
);
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Use this nav to make use from the whole routes...

const getCurrentNavigation = user => {
  const nav = [
    { link: '/books', title: 'books' },
    { link: '/authors', title: 'authors' },
  ];

  if (user) {
    nav.push({ link: '/auth/logout', title: 'Log out' });
  }
  return nav;
};

app.use((req, res, next) => {
  res.nav = getCurrentNavigation(req.user);
  next();
});
// const bookRouter = require('./src/routes/booksRoutes')(nav)
// Load the Book Route Separate file...
const bookRouter = require('./src/routes/booksRoutesMongo'); // Load the Book Route Separate file...
const adminRouter = require('./src/routes/adminRoutes'); // Load the Book Route Separate file...
const authRouter = require('./src/routes/authRoutes'); // Load the Auth Router Separate file...
const authorRouter = require('./src/routes/authorRoutes'); // Load the Auth Router Separate file...

app.use('/books', bookRouter());
app.use('/admin', adminRouter());
app.use('/auth', authRouter());
app.use('/authors', authorRouter());

app.get('/', (req, res) => {
  // res.send("Hello from my Library app"); // Display text in the browser...
  // Using Path join you can work with path carefully...
  // res.sendFile(path.join(__dirname, 'views/index.html'));

  // We are now using PUG/JADE to our templating engines
  res.render('index', {
    title: 'Library',
    nav: res.nav,
  });
});

app.listen(port, () => {
  // Callback function when port is already opened.
  debug(`Listening on port ${chalk.blue(port)}`);
});
