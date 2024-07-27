const express = require('express');
const sequelize = require('./config/config');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const saleRoutes = require('./routes/saleRoutes');
const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Allow access to the uploads folder
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/sales', saleRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
