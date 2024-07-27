const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get all sales
  router.get('/', (req, res) => {
    db.query('SELECT * FROM sales', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Get sale by id
  router.get('/:sale_id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM sales WHERE sale_id = ?', [sale_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      res.json(results[0]);
    });
  });

  // Create new sale
  router.post('/', (req, res) => {
    const { product_id, customer_id, quantity, total_price } = req.body;
    db.query('INSERT INTO sales (product_id, customer_id, quantity, total_price) VALUES (?, ?, ?, ?)', [product_id, customer_id, quantity, total_price], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ sale_id: results.insertId, product_id, customer_id, quantity, total_price });
    });
  });

  // Update sale by id
  router.put('/:sale_id', (req, res) => {
    const { sale_id } = req.params;
    const { product_id, customer_id, quantity, total_price } = req.body;
    db.query('UPDATE sales SET product_id = ?, customer_id = ?, quantity = ?, total_price = ? WHERE sale_id = ?', [product_id, customer_id, quantity, total_price, sale_id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ sale_id, product_id, customer_id, quantity, total_price });
    });
  });

  // Delete sale by id
  router.delete('/:sale_id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM sales WHERE sale_id = ?', [sale_id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Sale deleted' });
    });
  });

  return router;
};
