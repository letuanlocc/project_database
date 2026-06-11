const express = require('express');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');

dotenv.config();

const startServer = async () => {
  await connectDatabase();

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/order', orderRoutes);
  app.use('/admin', adminRoutes);

  app.use(express.static(path.join(__dirname, 'views')));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
};

startServer();