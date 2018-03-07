let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let flash = require('express-flash');
let session = require('express-session');

let index = require('./routes/index');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    cookie: { maxAge: 6000000000, expires: false },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret',
    user: {},

}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/', index);
app.use('/subscribe', index);
app.use('/create', index);
app.use('/account', index);
app.use('/editUser', index);
app.use('/singin', index);
app.use('/drop', index);
app.use('/search', index);
app.use('/comments/add', index);
app.use('/listOpinion', index);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
