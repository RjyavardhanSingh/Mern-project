// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { PORT, MONGO_URI } = require('./src/config.js');
const userRoutes = require('./src/routes/userRoute.js');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Story Writing Platform API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
