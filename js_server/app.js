const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Генерація секретного ключа для сесій
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

// Підключення до бази даних MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase';
mongoose.connect(mongoURI, {
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
app.set('views', path.join(__dirname, '..','views'));
app.use(express.static(path.join(__dirname, '..','public')));

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
  res.sendFile(path.join(__dirname, '..','public', 'styles.css'));
});

app.get('/public/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'script.js'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'main.html'));
});

app.get('/Comaru', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Comaru.html'));
});

app.get('/Pig', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Pig.html'));
});

app.get('/arctic-vixen', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Arctic-Vixen.html'));
});

app.get('/Others', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Others.html'));
});

app.get('/search-By-Name', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Search-by-name.html'));
});

app.get('/search-By-Attributes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Search-by-attributes.html'));
});

app.get('/modify-gifs', csrfProtection, (req, res) => {
  if (!req.session.isAuthenticated) {
    res.redirect('/'); 
    return;
  }

  res.sendFile(path.join(__dirname, '..', 'views', 'Modify-GIF.html'));
});

// Прослуховування порту
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});