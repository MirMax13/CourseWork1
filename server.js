const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/'); // Папка для зберігання завантажених файлів
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname); // Ім'я файлу зберігається без змін
  },
});
const upload = multer({ storage });

const gifSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
});

const GifModel = mongoose.model('Gif', gifSchema);

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
});

// GET-запит для відображення форми завантаження файлів
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET-запит для відображення GIF
app.get('/get-gif/:id', async (req, res) => {
try {
  const gif = await GifModel.findById(req.params.id);

  if (!gif) {
    return res.status(404).send('GIF not found');
  }

  // Встановлення правильного Content-Type для GIF
  res.setHeader('Content-Type', gif.contentType);
  res.send(gif.data);
} catch (error) {
  res.status(500).send('Помилка відкриття GIF з бази даних');
}
});

app.get('/get-content-type/:id', async (req, res) => {
  try {
    const gif = await GifModel.findById(req.params.id);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    res.send(gif.contentType);
  } catch (error) {
    res.status(500).send('Помилка отримання contentType з бази даних');
  }
});
// POST-запит для завантаження файлів
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;

      const gif = new GifModel({
        filename: originalname,
        data: buffer,
        contentType: mimetype,
      });

      await gif.save();

      res.send('Файл GIF успішно завантажено та збережено в базі .');
    } else {
      res.status(400).send('Помилка: Файл не був завантажений.');
    }
  } catch (error) {
    res.status(500).send('Помилка збереження файлу в базу даних.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});