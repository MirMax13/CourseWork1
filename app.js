const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');


const app = express();
const routes = require('./routes');
const port = 3000;
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}));

app.use('/', routes);

app.get('/public/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/public/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/Comaru', (req, res) => {
  res.render('Comaru');
});

app.get('/Pig', (req, res) => {
  res.render('Pig');
});

app.get('/arctic-vixen', (req, res) => {
  res.render('Arctic-Vixen');
});

app.get('/Others', (req, res) => {
  res.render('Others');
});

app.get('/search-By-Name', (req, res) => {
  res.render('Search-by-name');
});

app.get('/search-By-Attributes', (req, res) => {
  res.render('Search-by-attributes');
});

app.get('/Modify-Gifs', (req, res) => {
  if (!req.session.isAuthenticated) {
    res.redirect('/'); // Перенаправлення на головну сторінку
    return;
  }

  res.render('Modify-GIF');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});