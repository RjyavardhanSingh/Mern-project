// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { PORT, MONGO_URI } = require('./src/config.js');
const userRoutes = require('./src/routes/userRoute.js');
const path = require('path');

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://mern-project-5vz5.onrender.com', // Allow any origin in development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};



app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Story Writing Platform API');
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
