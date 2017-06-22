var express = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var path = require('path');
var sessions = require('express-session');
var parseurl = require('parseurl');

var app = express();


app.get('/index/', function (req, res) {
  res.send('hello');
});

app.listen(3000, function () {
  console.log('listening');
});
