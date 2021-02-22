const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const exercisesRoutes = require('./api/routes/exercises');
const trainingRoutes = require('./api/routes/training');
const userRoutes = require('./api/routes/user');
const blogRoutes = require('./api/routes/blog');

// mongoose.connect(
//     process.env.MONGODB_URI,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//     }).then(() => console.log("MongoDb connected"))
//     .catch(err => console.log(err));

const MongoClient = require("mongodb").MongoClient;
const client = await new MongoClient(process.env.MONGODB_URI,{ useNewUrlParser: true});
client.connect();
mongoose.connection.once('open', () => { console.log('MongoDB Connected'); });
mongoose.connection.on('error', (err) => { console.log('MongoDB connection error: ', err);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*",);
    res.header("Access-Control-Allow-Headers', Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/exercises', exercisesRoutes);
app.use('/training', trainingRoutes);
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message 
        }
    });
});

module.exports = app;