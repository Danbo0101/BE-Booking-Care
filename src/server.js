const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const webRoutes = require('./route/web.js');
const configViewEngine = require('./config/viewEngine.js');
const connectDB = require('./config/connectDB.js');
const fileUpload = require('express-fileupload');
// const cors = require('cors');

require('dotenv').config();

const app = express();
// app.use(cors({ origin: true }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//config fileUpload
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);
//route
app.use('/v1/api/', webRoutes);

const port = process.env.PORT || 6969;
const hostname = process.env.hostname;

(async () => {
    try {
        // test connection 
        await connectDB();;
        app.listen(port, hostname, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }

})()




