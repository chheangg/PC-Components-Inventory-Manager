// Dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./utilities/config');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression')
require('express-async-errors');

// Mongoose connection to MongoDB
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

// Bind Mongoose error
db.on('error', console.error.bind(console, "MongoDB connection error:"));

// Routes import
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/data/uploads', express.static(path.join(__dirname, 'public/data/uploads')))

// Routes
app.use('/', indexRouter);
app.use('/catalog', catalogRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
