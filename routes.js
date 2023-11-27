const express = require('express');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');


const GifModel = require('./gifModel');

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
    const gif = await GifModel.findById(gifId);

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

    const gif = await GifModel.findById(gifId);
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

      const gif = await GifModel.findById(gifId);
      if (!gif) {
      return res.status(404).send('GIF not found');
      }

      res.json(gif.filename);
  } catch (error) {
      res.status(500).send('Помилка отримання атрибутів GIF з бази даних');
  }
  });
  
router.get('/download-gif/:id', async (req, res) => {
  try {
    const gifId = req.params.id;
    const downloadFileName = req.query.fileName || 'downloaded.gif';

    const gif = await GifModel.findById(gifId);

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
    const gifs = await GifModel.find({}, 'filename');
    res.json(gifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку GIFs');
  }
});
  
router.get('/Comaru-gif-list', async (req, res) => {
  try {
    const ComaruGifs = await GifModel.find({ attributes: 'Comaru' }, 'filename');
    res.json(ComaruGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "Comaru" GIFs');
  }
});
  
router.get('/Pig-gif-list', async (req, res) => {
  try {
    const PigGifs = await GifModel.find({ attributes: 'pig' }, 'filename');
    res.json(PigGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "Pig" GIFs');
  }
});
  
router.get('/Arctic-Vixen-gif-list', async (req, res) => {
  try {
    const Arctic_VixenGifs = await GifModel.find({ attributes: 'arctic_vixen' }, 'filename');
    res.json(Arctic_VixenGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "arctic_vixen" GIFs');
  }
});
  
router.get('/Others-gif-list', async (req, res) => {
  try {
    const OthersGifs = await GifModel.find({ attributes: 'others' }, 'filename');
    res.json(OthersGifs);
  } catch (error) {
    res.status(500).send('Помилка отримання списку "others" GIFs');
  }
});
  
router.get('/search-by-name/:name', async (req, res) => {
  try {
    const searchTerm = req.params.name;
    const gifs = await GifModel.find({ filename: { $regex: searchTerm, $options: 'i' } }, 'filename');
    res.json(gifs);
  } catch (error) {
    res.status(500).send('Помилка пошуку GIFs за назвою');
  }
});
  
router.get('/search-by-attribute/:attribute', async (req, res) => {
  const attribute = req.params.attribute;
  try {
    const gifs = await GifModel.find({ attributes: attribute }).exec();
    const truncatedGifs = gifs.map(gif => ({
      _id: gif._id,
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
    const gifId = req.params.id;
    const newName = req.body.newName;

    if (!newName) {
      return res.status(400).send('New name is required.');
    }

    const updatedGif = await GifModel.findOneAndUpdate(
      { _id: gifId },
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
    const gifId = req.params.id;
    const { newAttributes } = req.body;

    if (!Array.isArray(newAttributes)) {
      return res.status(400).send('Invalid attributes format');
    }

    const gif = await GifModel.findById(gifId);

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
    const gifId = req.params.id;
    const deletedGif = await GifModel.findByIdAndDelete(gifId);

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
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      const defaultAttribute = req.body.defaultAttribute || 'all';
      let additionalAttributes = [];

      if (req.body.attributes) {
        additionalAttributes = req.body.attributes.split(',').map(attribute => attribute.trim());
      }

      // Додати атрибути
      const allAttributes = [...new Set([defaultAttribute, ...additionalAttributes])];

      // Перевірка на GIF
      if (mimetype !== 'image/gif') {
        fs.unlinkSync(req.file.path);
        return res.status(400).send('Only GIF files are allowed.');
      }

      const fileData = fs.readFileSync(req.file.path);
      const gif = new GifModel({
        filename: originalname,
        data: fileData,
        contentType: mimetype,
        attributes: allAttributes,
      });
      await gif.save();

      // Видалити тимчасовий файл
      fs.unlinkSync(req.file.path);

      res.send('File successfully uploaded and saved to the database.');
    } else {
      res.status(400).send('Error: File was not uploaded.');
    }
  } catch (error) {
    res.status(500).send('Error saving file to the database.');
  }
});
  
router.post('/check-auth', (req, res) => {
  const { login, password } = req.body;

  // Порівняння логіну і паролю з даними адміна
  if (login === 'Admin' && password === 'Steo9765') {
    req.session.isAuthenticated = true;
    res.status(200).send('Authentication successful');
  } else {
    req.session.isAuthenticated = false;
    res.status(401).send('Invalid login or password');
  }
});

  module.exports = router;