var express = require('express');
var app = express.Router();
var { ensureAuth } = require('../config/auth')

app.get('/', (req, res) => 
    res.send('Welcome to server.')
)

app.get('/data', ensureAuth, (req, res) =>
    res.send('Autherized Data.')
)

module.exports = app;