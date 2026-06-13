const express = require('express');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/db');
const { sequelize } = require('./models/product');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');

dotenv.config();

const startServer = async () => {
  await connectDatabase();
  await sequelize.authenticate();
  console.log('Sequelize connected');

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  app.use('/order', orderRoutes);
  app.use('/admin', adminRoutes);

  app.use(express.static(path.join(__dirname, 'views')));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

  // Error handling middleware (must be BEFORE app.listen)
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: err.message || 'Lỗi server nội bộ' });
  });
  
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Server is ready to accept requests');
  });

  // Graceful shutdown on errors
  server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    }
  });

  // Unhandled rejection handler - don't exit
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
  });

  // Uncaught exception handler - don't exit
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Send error alert but keep server running
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});