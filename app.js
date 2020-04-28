const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./middleware/verify-jwt');

const PORT = process.env.PORT || 3000;

// Connect to mongoDB
mongoose.connect(
    process.env.DB_STRING,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('Connection to DB established!')
);

// Middlewares
app.use(express.json());

// Import routes
const user = require('./routes/user');
const molecule = require('./routes/molecule');

// Route middlewars
app.use('/api/user', user);
app.use('/api/molecule', molecule);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
