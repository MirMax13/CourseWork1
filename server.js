const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
//var app = express();

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

app.use(express.static(path.join(__dirname, 'public')));
// GET-запит для відображення форми завантаження файлів
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET-запит для відображення GIF
app.get('/get-gif/:id', async (req, res) => {
try {
  const gifId = req.params.id;
  const gif = await GifModel.findById(gifId);

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
app.get('/get-gif-text/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findById(gifId);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    // Встановіть правильний Content-Type для текстового файлу
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=gif.txt');
    
    // Конвертуйте бінарні дані GIF у формат Base64
    const base64Data = gif.data.toString('base64');
    
    // Відправте дані у формі текстового файлу
    res.send(base64Data);
  } catch (error) {
    res.status(500).send('Помилка відкриття GIF з бази даних');
  }
});


app.get('/get-content-type/:id', async (req, res) => {
  try {
    const gifId = req.params.id;

    const gif = await GifModel.findById(gifId);
    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    res.send(gif.contentType);
  } catch (error) {
    res.status(500).send('Помилка отримання contentType з бази даних');
  }
});

app.get('/download-gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findById(gifId);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    // Встановіть правильний Content-Type для GIF
    res.setHeader('Content-Type', gif.contentType);
    res.setHeader('Content-Disposition', 'attachment; filename=downloaded.gif');
    res.send(gif.data);
  } catch (error) {
    res.status(500).send('Помилка відкриття GIF з бази даних');
  }
});

app.get('/save-gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findById(gifId);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    // Створіть файл та записуйте в нього бінарні дані
    const filePath = `uploads/${gifId}.gif`;
    fs.writeFileSync(filePath, gif.data);

    res.download(filePath); // Відправте файл користувачеві для завантаження
  } catch (error) {
    res.status(500).send('Помилка збереження файлу');
  }
});


// POST-запит для завантаження файлів
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;


      // Зчитати файл як бінарні дані
      const fileData = fs.readFileSync(req.file.path);
      
      const gif = new GifModel({
        filename: originalname,
        data: fileData,
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

/*app.post('/convert-text-to-gif', async (req, res) => {
  try {
    const { text } = req.body; // Отримайте текст з тіла запиту

    if (!text) {
      return res.status(400).send('Text not provided in the request body.');
    }

    // Створіть буфер із тексту у формат Base64
    const binaryData = Buffer.from(text, 'base64');

    if (!binaryData) {
      return res.status(400).send('Failed to convert text to binary data.');
    }

    // Відправте бінарні дані як GIF відповідь на запит
    res.setHeader('Content-Type', 'image/gif');
    res.send(binaryData);
  } catch (error) {
    console.error('Error converting text to GIF:', error);
    res.status(500).send('Помилка конвертації тексту в GIF.');
  }
});*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});