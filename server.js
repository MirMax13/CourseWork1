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
  attributes: [String],
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

app.get('/', (req, res) => { // GET-запит для відображення форми завантаження файлів
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/get-gif/:id', async (req, res) => { // GET-запит для відображення GIF
try {
  const gifId = req.params.id;
  const gif = await GifModel.findById(gifId);

  if (!gif) {
    return res.status(404).send('GIF not found');
  }


  res.setHeader('Content-Type', gif.contentType);   // Встановлення правильного Content-Type для GIF
  res.send(gif.data);
} catch (error) {
  res.status(500).send('Помилка відкриття GIF з бази даних');
}
});
/*app.get('/get-gif-text/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findById(gifId);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }


    res.setHeader('Content-Type', 'text/plain');     // Встановлення правильного Content-Type для текстового файлу
    res.setHeader('Content-Disposition', 'attachment; filename=gif.txt');
    
  
    const base64Data = gif.data.toString('base64');   // Конвертування бінарних даних GIF у формат Base64
    

    res.send(base64Data);     // Відправка даних у формі текстового файлу
  } catch (error) {
    res.status(500).send('Помилка відкриття GIF з бази даних');
  }
});*/


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

app.get('/get-gif-attributes/:id', async (req, res) => {
  try {
    const gifId = req.params.id;

    const gif = await GifModel.findById(gifId);
    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    res.json(gif.attributes);
  } catch (error) {
    res.status(500).send('Помилка отримання атрибутів GIF з бази даних');
  }
});

app.get('/download-gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findById(gifId);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

 
    res.setHeader('Content-Type', gif.contentType);    // Встановлення правильного Content-Type для GIF
    res.setHeader('Content-Disposition', 'attachment; filename=downloaded.gif');
    res.send(gif.data);
  } catch (error) {
    res.status(500).send('Помилка відкриття GIF з бази даних');
  }
});

/*app.get('/save-gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findById(gifId);

    if (!gif) {
      return res.status(404).send('GIF not found');
    }


    const filePath = `uploads/${gifId}.gif`;     // Створення файлу та запис у нього бінарних даних
    fs.writeFileSync(filePath, gif.data);

    res.download(filePath); // Відправка файлу користувачеві для завантаження
  } catch (error) {
    res.status(500).send('Помилка збереження файлу');
  }
});*/

// GET-маршрут для отримання списку гіфок
app.get('/get-gif-list', async (req, res) => {
  try {
    const gifs = await GifModel.find({}, 'filename');
    res.json(gifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку GIFs');
  }
});

app.get('/get-Comaru-gif-list', async (req, res) => {
  try {
    const ComaruGifs = await GifModel.find({ attributes: 'Comaru' }, 'filename');
    res.json(ComaruGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "Comaru" GIFs');
  }
});

app.get('/get-Pig-gif-list', async (req, res) => {
  try {
    const PigGifs = await GifModel.find({ attributes: 'pig' }, 'filename');
    res.json(PigGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "Pig" GIFs');
  }
});

app.get('/get-Arctic_Vixen-gif-list', async (req, res) => {
  try {
    const Arctic_VixenGifs = await GifModel.find({ attributes: 'arctic_vixen' }, 'filename');
    res.json(Arctic_VixenGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "arctic_vixen" GIFs');
  }
});

app.get('/get-Others-gif-list', async (req, res) => {
  try {
    const OthersGifs = await GifModel.find({ attributes: 'others' }, 'filename');
    res.json(OthersGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "others" GIFs');
  }
});

app.post('/upload', upload.single('file'), async (req, res) => { // POST-запит для завантаження файлів
  try {
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;

      const fileData = fs.readFileSync(req.file.path); // Зчитування файлів як бінарні дані
      
      const gif = new GifModel({
        filename: originalname,
        data: fileData,
        contentType: mimetype,
        attributes: ['all'], 
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