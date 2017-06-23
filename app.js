var express = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var parseurl = require('parseurl');
var fs = require('fs');
var busboy = require('busboy');

var app = express();

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Covfefe',
  resave: false,
  saveUninitialized: true
}));

var words = {
  wordsArr: [
      {'words': fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n")}
  ]
};
var numGuesses = [8];
var guessedLetters = [];



app.get('/', function (req, res) {
  context = {
    numGuesses: numGuesses,
    guessedLetters: guessedLetters
  };
  res.render('index', context);
});

app.post('/', function (req, res) {
  var letter = req.body.letter;
  console.log(letter);
  guessedLetters.push(letter);
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('listening');
});
