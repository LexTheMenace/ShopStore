const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors'); 
const connectDB = require('./config/db.js'); ;
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
dotenv.config();
const app = express();

connectDB();
app.get('/', (req, res) => {
  res.send('API is running...')
});

app.use('/api/v1/products', productRoutes);
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green)
);