var express = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var parseurl = require('parseurl');
var busboy = require('busboy');
var fs = require('fs');

var app = express();

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Covfefe',
  resave: false,
  saveUninitialized: true
}));

var allWords = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
var word = allWords[Math.floor(Math.random() * allWords.length)];
console.log(word);
var tooManyLetters = '';
var guessedLetters = [];
var displayWord = '';
var numGuesses = 8;
var message = 'Good Luck';
var alreadyGuessed = '';
for (var i = 0; i < word.length; i++) {
  displayWord += '_';
}



app.get('/signIn', function (req, res) {
  context = {};
  res.render('signIn', context);
});

app.post('/signIn', function (req, res) {
  res.redirect('/index/');
});

app.get('/index/', function (req, res) {


  context = {
    numGuesses: numGuesses,
    guessedLetters: guessedLetters,
    displayWord: displayWord,
    message: message,
    alreadyGuessed: alreadyGuessed,
    tooManyLetters: tooManyLetters
  };
  res.render('index', context);
});

app.post('/index/', function (req, res) {
  var letter = req.body.letter.toLowerCase();
  console.log(typeof letter);
  if (guessedLetters.includes(letter)) {
    alreadyGuessed = 'You have already guessed this letter, try again.';
  } else {
    alreadyGuessed = '';
  }
  var index = word.indexOf(letter);
  if (index === -1) {
    if (index === -1 && guessedLetters.includes(letter)) {
      numGuesses++;
    }
    numGuesses--;
  }
  guessedLetters.push(letter);
  while (index > -1) {
    displayWord = displayWord.substr(0, index) + letter + displayWord.substr(index + 1);
    index = word.indexOf(letter, index + 1);
    tooManyLetters = '';
  }
  if (letter.length > 1 || letter === '') {
    letter = '';
    numGuesses++;
    tooManyLetters = 'Only one letter at a time please.';
  }
  if (numGuesses < 1) {
    message = 'You lost! Your word was ' + word + '.  Click new word if you would like to play again.';
  }
  if (!displayWord.includes('_')) {
    message = 'You win!  Click new word if you would like to play again?';
  }
  res.redirect('/index/');
});

app.post('/clear', function (req, res) {
  displayWord = '';
  word = allWords[Math.floor(Math.random() * allWords.length)];
  guessedLetters = [];
  alreadyGuessed = '';
  numGuesses = 8;
  message = 'Good luck';
  for (var i = 0; i < word.length; i++) {
    displayWord += '_';

  }
  res.redirect('/index');
});

app.listen(3000, function () {
});
