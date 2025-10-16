/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const env = require('dotenv').config();
const app = express();
const static = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const utilities = require('./utilities');
const errorRoute = require('./routes/error');
const session = require('express-session');
const pool = require('./database/');
const accountRoute = require('./routes/accountRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const reviewRoute = require('./routes/reviewRoute');

/* ***********************
 * View Engines and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId'
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(utilities.checkJWTToken);

// Access to firstname and login status in all views
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin;
  res.locals.firstname = req.session.account_firstname;
  next();
});

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static);

//Index Route
app.get('/', utilities.handleErrors(baseController.buildHome));

//Inventory Route
app.use('/inv', inventoryRoute);

// Account Route
app.use('/account', accountRoute);

// Error Route
app.use(errorRoute);

// Reviews Route
app.use('/review', reviewRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: '${req.originalUrl}' : ${err.message}`);
  let status = err.status || 500;
  let message = '';
  if (status == 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.status(status).render('errors/error', {
    title: status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

// new version
