//var createError = require('http-errors');
require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const apiRouter = require('./routes/api');
const session = require('express-session')

const app = express();
const exphbs = require('express-handlebars');

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//sesion
app.use(session({
  secret: process.env.KEY_SESSION, // chuỗi ký tự đặc biệt để Session mã hóa, tự viết
  resave: false,
  saveUninitialized: false
  
}));


//set handelbars
app.engine("hbs", exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'login',
  layoutsDir: 'views/layouts/',
}));

app.set('view engine', 'hbs');
app.set('views', './views');



app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api', apiRouter);

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

// var cors = require('cors')

// app.use(cors());

app.use(passport.initialize());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('404 - Khong tim thay trang')
  next();
});

module.exports = app;

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
