const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const routes = require('./routes');

const app = express();
const port = 3000;

// Генерація секретного ключа для сесій
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

// Підключення до бази даних MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Обробка помилок підключення до MongoDB
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
});

// Налаштування шаблонізатора та шляхів для статичних файлів
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Налаштування сесій
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}));

// Підключення маршрутів
app.use('/', routes);

// Обробка статичних файлів
app.get('/public/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/public/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Маршрути
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

// Прослуховування порту
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});