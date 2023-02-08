const express = require('express');
const { default: mongoose, Error } = require('mongoose');
const app = express();
const User = require('./Models/user');
require('dotenv').config();
const session = require('express-session');

const bcrypt = require('bcrypt');

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('connected'))
  .catch((Error) => console.log('errror'));

app.get('/login', (req, res) => {
  res.render('login');
});
const requirelogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
};
app.get('/', (req, res) => {
  res.send('This is the Home page');
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }));

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/login');
});

app.get('/secret', requirelogin, (req, res) => {
  res.render('secret');
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);

  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect('/secret');
  } else {
    res.redirect('/login');
  }
});

app.listen(process.env.PORT, () => {
  console.log('SERVING YOUR APP!');
});
