// app.js
'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var product = require('./routes/secretFriend'); // Imports routes for the products
var app = express();

 AWS.config.update({
   credentials: new AWS.SharedIniFileCredentials({profile: 'default'})
  });

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://admin:admin123@ds121814.mlab.com:21814/friendb';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/secretSanta', product);

module.exports = app;