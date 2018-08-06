const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

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
const nav = [
  { link: '/books', title: 'books' },
  { link: '/authors', title: 'authors' },
];

// const bookRouter = require('./src/routes/booksRoutes')(nav)
// Load the Book Route Separate file...
const bookRouter = require('./src/routes/booksRoutesMongo')(nav); // Load the Book Route Separate file...
const adminRouter = require('./src/routes/adminRoutes')(nav); // Load the Book Route Separate file...

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res) => {
  // res.send("Hello from my Library app"); // Display text in the browser...
  // Using Path join you can work with path carefully...
  // res.sendFile(path.join(__dirname, 'views/index.html'));

  // We are now using PUG/JADE to our templating engines
  res.render('index', {
    title: 'Library',
    nav,
  });
});

app.listen(port, () => {
  // Callback function when port is already opened.
  debug(`Listening on port ${chalk.blue(port)}`);
});
