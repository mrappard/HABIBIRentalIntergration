'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./app/routes');

const server = require('http').Server(app);

app.use(compression());
app.use(helmet());
app.use(cors());

app.use(express.static(__dirname + '/views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if(app.get('env') === 'development')
	app.use(morgan('dev'));

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/public', express.static(__dirname + '/public'));

app.use('/', routes);

server.listen(port);