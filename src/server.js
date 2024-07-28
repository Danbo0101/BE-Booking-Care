const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const webRoutes = require('./route/web.js');
const configViewEngine = require('./config/viewEngine.js');
const connectDB = require('./config/connectDB.js');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(204); // No Content
    } else {
        next();
    }
});

// Config fileUpload
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);

// Route
app.use('/v1/api/', webRoutes);

const port = process.env.PORT || 6969;
const hostname = process.env.HOSTNAME || 'localhost';

(async () => {
    try {
        // Test connection 
        await connectDB();
        app.listen(port, hostname, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
