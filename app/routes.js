'use strict';

const express = require('express');
const app = express();

app.all('/*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');
    next();
});

app.get('/', function(req, res) {
	res.render('index');
});

app.use(function(req, res) {
	res.status(404).redirect('/');
});

module.exports = app;