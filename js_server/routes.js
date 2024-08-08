const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const GifModel = require('./gifModel');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/'); // Папка для зберігання завантажених файлів
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname); // Ім'я файлу зберігається без змін
    },
  });
  
const upload = multer({ storage });

const router = express.Router();

router.use(bodyParser.json());

router.get('/gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const gif = await GifModel.findOne({ id: gifId });

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    res.setHeader('Content-Type', gif.contentType);
    res.send(gif.data);
  } catch (error) {
    res.status(500).send('Помилка відкриття GIF з бази даних');
  }
});

router.get('/gif-attributes/:id', async (req, res) => {
  try {
    const gifId = req.params.id;

    const gif = await GifModel.findOne({ id: gifId });
    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    res.json(gif.attributes);
  } catch (error) {
    res.status(500).send('Помилка отримання атрибутів GIF з бази даних');
  }
});
  
router.get('/gif-name/:id', async (req, res) => {
  try {
      const gifId = req.params.id;

      const gif = await GifModel.findOne({ id: gifId });
      if (!gif) {
      return res.status(404).send('GIF not found');
      }

      res.json({ filename: gif.filename });
  } catch (error) {
      res.status(500).send('Помилка отримання атрибутів GIF з бази даних');
  }
  });
  
router.get('/download-gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const downloadFileName = req.query.fileName || 'downloaded.gif';

    const gif = await GifModel.findOne({ id: gifId });

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    res.setHeader('Content-Type', gif.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${downloadFileName}`);
    res.send(gif.data);
  } catch (error) {
    res.status(500).send('Помилка відкриття GIF з бази даних');
  }
});
  
router.get('/gif-list', async (req, res) => {
  try {
    const gifs = await GifModel.find({}, 'filename id');
    res.json(gifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку GIFs');
  }
});
  
router.get('/gif-list-by-name/:name', async (req, res) => {
  try {
    const searchTerm = req.params.name;
    const gifs = await GifModel.find({ filename: { $regex: searchTerm, $options: 'i' } }, 'filename id');
    res.json(gifs);
  } catch (error) {
    res.status(500).send('Помилка пошуку GIFs за назвою');
  }
});
  
router.get('/gif-list-by-attribute/:attribute', async (req, res) => {
  const attribute = req.params.attribute;
  try {
    const gifs = await GifModel.find({ attributes: attribute }).exec();
    const truncatedGifs = gifs.map(gif => ({
      id: gif.id,
      filename: gif.filename,
    }));
    res.json(truncatedGifs);
  } catch (error) {
    console.error('Error searching by attribute:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
router.put('/edit-name/:id', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).send('Authentication required');
    }
    const gifId = req.params.id;
    const newName = req.body.newName;

    if (!newName) {
      return res.status(400).send('New name is required.');
    }

    const updatedGif = await GifModel.findOneAndUpdate(
      { id: gifId },
      { $set: { filename: newName } },
      { new: true } // Повернути оновлений документ
    );

    if (!updatedGif) {
      return res.status(404).send('GIF not found.');
    }

      res.send('GIF name updated successfully.');
    } catch (error) {
      console.error('Error updating GIF name:', error);
      res.status(500).send('Internal Server Error');
    }
});
  
router.put('/edit-attributes/:id', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).send('Authentication required');
    }
    const gifId = req.params.id;
    const { newAttributes } = req.body;

    if (!Array.isArray(newAttributes)) {
      return res.status(400).send('Invalid attributes format');
    }

    const gif = await GifModel.findOne({ id: gifId });;

    if (!gif) {
      return res.status(404).send('GIF not found');
    }

    // Застосувати зміни до атрибутів
    gif.attributes = newAttributes;

    // Зберегти зміни у базі даних
    await gif.save();

    return res.status(200).send('Attributes updated successfully');
  } catch (error) {
    console.error('Error updating attributes:', error);
    return res.status(500).send('Internal Server Error');
  }
});
  
router.delete('/gif/:id', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).send('Authentication required');
    }
    const gifId = req.params.id;
    const deletedGif = await GifModel.findOneAndDelete({ id: gifId });

    if (!deletedGif) {
      return res.status(404).send('GIF not found.');
    }

    res.send('GIF deleted successfully.');
  } catch (error) {
    console.error('Error deleting GIF:', error);
    res.status(500).send('Internal Server Error');
  }
});
  
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).send('Authentication required');
    }
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      const defaultAttribute = req.body.defaultAttribute || 'all';
      let additionalAttributes = [];

      if (req.body.attributes) {
        additionalAttributes = req.body.attributes.split(',').map(attribute => attribute.trim());
      }

      // Додати атрибути 
      const allAttributes = [...new Set([defaultAttribute, ...additionalAttributes])];
      //TODO: Check if all appears if it is not in the list
      // Перевірка на GIF
      if (mimetype !== 'image/gif') {
        fs.unlinkSync(req.file.path);
        return res.status(400).send('Only GIF files are allowed.');
      }

      const fileData = fs.readFileSync(req.file.path);
      const gif = new GifModel({
        id: new mongoose.Types.ObjectId().toString(),
        filename: originalname,
        data: fileData,
        contentType: mimetype,
        attributes: allAttributes,
      });
      await gif.save();

      fs.unlinkSync(req.file.path);

      res.status(201).send('File successfully uploaded and saved to the database.');
    } else {
      res.status(400).send('Error: File was not uploaded.');
    }
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error saving file to the database:', error);
    res.status(500).send('Error saving file to the database.');
  }
});
  
router.post('/check-auth', (req, res) => {
  const { login, password } = req.body;

  if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    res.status(200).json({ isAuthenticated: true, message: 'Authentication successful' });
  } else {
    req.session.isAuthenticated = false;
    res.status(401).json({ isAuthenticated: false, message: 'Invalid login or password' });
  }
});

  module.exports = router;