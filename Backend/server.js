// File: server.js
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const sparePartRoutes = require('./routes/sparePartRoutes');
const stockInRoutes = require('./routes/stockInRoutes');
const stockOutRoutes = require('./routes/stockOutRoutes');
const cors = require('cors');

const app = express();
// Enable CORS
app.use(cors());
// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/spareparts', sparePartRoutes);
app.use('/api/stockin', stockInRoutes);
app.use('/api/stockout', stockOutRoutes);

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
