const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
// const authenticateAdmin = require('../middleware/authenticateAdmin'); // Komentari ini

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const { name } = req.body; // Ambil nama produk dari body request
    const extension = path.extname(file.originalname); // Dapatkan ekstensi file
    const filename = `${name.replace(/\s+/g, '_')}${extension}`; // Buat nama file baru berdasarkan nama produk
    cb(null, filename);
  }
});

const upload = multer({ storage });

module.exports = (db) => {
  const router = express.Router();

  // router.use(authenticateAdmin); // Komentari ini

  // Get all products
  router.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Get product by id
  router.get('/:product_id', (req, res) => {
    const { product_id } = req.params;
    db.query('SELECT * FROM products WHERE product_id = ?', [product_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(results[0]);
    });
  });

  // Create new product
  router.post('/', upload.single('image_url'), (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    db.query('INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)', [name, description, price, image], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ product_id: results.insertId, name, description, price, image });
    });
  });

  // Update product by id
  router.put('/:product_id', upload.single('image_url'), (req, res) => {
    const { product_id } = req.params;
    const { name, description, price } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : null;

    const updateProduct = () => {
      const query = 'UPDATE products SET name = ?, description = ?, price = ?' + (image ? ', image_url = ?' : '') + ' WHERE product_id = ?';
      const values = image ? [name, description, price, image, product_id] : [name, description, price, product_id];

      db.query(query, values, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ product_id, name, description, price, image });
      });
    };

    if (image) {
      // Hapus gambar lama jika ada
      db.query('SELECT image_url FROM products WHERE product_id = ?', [product_id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length > 0 && results[0].image_url) {
          const oldImagePath = path.join(__dirname, '..', results[0].image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error('Failed to delete old image:', err);
            });
          }
        }
        updateProduct();
      });
    } else {
      updateProduct();
    }
  });

  // Delete product by id
  router.delete('/:product_id', (req, res) => {
    const { product_id } = req.params;
    db.query('SELECT image_url FROM products WHERE product_id = ?', [product_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0 && results[0].image_url) {
        const oldImagePath = path.join(__dirname, '..', results[0].image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Failed to delete old image:', err);
          });
        }
      }

      db.query('DELETE FROM products WHERE product_id = ?', [product_id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product deleted' });
      });
    });
  });

  return router;
};
