const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const startServer = async () => {
    await connectDatabase();

    const app = express();

    app.set('view',path.join(__dirname,'views'));

    app.use('/products', productRoutes);

    app.get('/', (req, res) => res.redirect('/products'));

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () =>
    console.log('Server running at http://localhost:${PORT}')
  );
  
}