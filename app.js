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

everyauth.twitter
	.consumerKey('Ria1i9itfX5hRJQlwPCnjz1Ln')
	.consumerSecret('RQfqYQYMXhvFqp19j5PX5JA2p3uySMU84PhQAUSShUxPWgb64G')
	.findOrCreateUser(function( session, accessToken, accessTokenSecret, twitterUserData ){
		var promise = this.Promise();
		users.findOrCreateByTwitterData( twitterUserData, accessToken, accessTokenSecret, promise );
		return promise;
	})
	.redirectPath('/');

everyauth.everymodule.findUserById(function( id, callback ){
        api.getUserById(id, function( err, user ){
        	if( err ) return callback( err );
        	callback( null, user );
        });
     });

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
app.use(everyauth.middleware( app ));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function( req, res ){
	res.render('index');
});


app.listen(3005);
console.log("Hey, I'm at 3005");