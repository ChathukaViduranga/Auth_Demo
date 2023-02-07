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
  res.redirect('/');
});

app.get('/secret', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.send('THIS IS A SECRET! YOU CAN NOT SEE ME UNLESS YOU ARE LOGGED IN ');
});
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const validpass = await bcrypt.compare(password, user.password);
  if (validpass) {
    req.session.user_id = user._id;
    res.send('Welcome ');
  } else {
    res.send('try again');
  }
});

app.listen(process.env.PORT, () => {
  console.log('SERVING YOUR APP!');
});
