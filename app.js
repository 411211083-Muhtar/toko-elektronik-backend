require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const salesRouter = require('./routes/sales');
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; 

const db = require('./db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use('/api/products', productsRouter(db, multer));
app.use('/api/sales', salesRouter(db));
app.use('/api/users', usersRouter);
app.use('/api/customers', customersRouter(db));
app.use('/api/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
