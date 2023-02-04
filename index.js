const express = require('express');
const { default: mongoose, Error } = require('mongoose');
const app = express();
const User = require('./Models/user');
require('dotenv').config();

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
  res.redirect('/');
});

app.get('/secret', (req, res) => {
  res.send('THIS IS A SECRET! YOU CAN NOT SEE ME UNLESS YOU ARE LOGGED IN ');
});

app.listen(process.env.PORT, () => {
  console.log('SERVING YOUR APP!');
});
