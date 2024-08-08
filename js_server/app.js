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

const secretKey = crypto.randomBytes(32).toString('hex');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(path.join(__dirname, '..','public')));

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}));

app.use('/', routes);

app.get('/public/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'styles.css'));
});

app.get('/public/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'script.js'));
});

app.get('/public/script_express.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'script_express.js'));
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

app.get('/modify-gifs', (req, res) => {
  if (!req.session.isAuthenticated) {
    res.redirect('/'); 
    return;
  }

  res.sendFile(path.join(__dirname, '..', 'views', 'Modify-GIF.html'));
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});