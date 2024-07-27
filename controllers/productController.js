const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menghapus gambar lama
const deleteOldImage = (imagePath) => {
  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (product) {
      const oldImagePath = product.imageUrl ? path.join(__dirname, '..', product.imageUrl) : null;

      const updatedData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : product.imageUrl
      };

      await product.update(updatedData);

      // Hapus gambar lama jika ada gambar baru yang diunggah
      if (req.file) {
        deleteOldImage(oldImagePath);
      }

      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
