
require('dotenv').config();

const express = require('express');

const connectDB = require('./src/config/db');

const urlRoutes = require('./src/routes/urlPoutes');
const { redirectToOriginalUrl } = require('./src/controllers/urlController');

connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api', urlRoutes);

app.get('/:code', redirectToOriginalUrl);

app.get('/api/health',(eq,res) => {
    res.status(200).json({status:'UP'});
});

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});
