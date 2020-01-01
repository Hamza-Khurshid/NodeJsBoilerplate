const express = require('express');
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require('passport');
var session = require('express-session');

// Import from custom files
var dbConnection = require ('./config/dbConfig');
var mainRoutes = require('./routes/index');
var userRoutes = require('./routes/user');
var passportConfig = require('./config/passport');

var app = express();

// Passport config
passportConfig(passport);

// Add midlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads'));

// Session
app.use(session({
    secret: 'secretkey',
    resave: true,
    saveUninitialized: true
}))

// app.use(express.static('uploads'))
app.use(passport.initialize())
app.use(passport.session())

// DB connection
dbConnection();


// Routes
app.use('/', mainRoutes);
app.use('/users', userRoutes);


let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));