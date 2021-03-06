var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser').json;
var everyauth = require('everyauth');
var util = require('util');
var uuid = require('node-uuid');
var users = require('./lib/users');
var api = require('./lib/api');

app.use(bodyParser());
app.use(cookieParser('oi3ifh823e9'));
app.use(session({
  genid: function(req) {
    return uuid.v4();
  },
  secret: 'oi3ifh823e9',
  saveUninitialized: false,
  resave: false
}));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function( req, res ){
	res.render('index');
});

app.get('/login', function( req, res ){
  res.render('login');
});


app.listen(3005);
console.log("Hey, I'm at 3005");