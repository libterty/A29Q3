const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const Handlebars = require('handlebars');
const H = require('just-handlebars-helpers');
const app = express();

const db = require('./models');
const Expense = db.Expense;
const User = db.User;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const port = process.env.PORT || 3000;
const { ECONNRESET, logErrors, notFound } = require('./config/middlewares');

require('./config/passport')(passport);

app.use(express.static('public'));
app.use(
  session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
H.registerHelpers(Handlebars);

//template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//routes
app.use('/', require('./routes/home'));
app.use('/trackers', require('./routes/trackers'));
app.use('/users', require('./routes/user'));
app.use('/auth', require('./routes/auths'));

app.use(ECONNRESET);
app.use(notFound);
app.use(logErrors);

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});

module.exports = app;
