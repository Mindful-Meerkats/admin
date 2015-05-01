var request = require('request');
var config = require('../config.json');

var getUserById = function( id, callback ){
	var user;
	request( config.apiServer + '/accounts/' + id, function( error, response, body ){
		if( !error && response.statusCode === 200 ){
			user = JSON.parse( error, body );
			callback( user );
		}else {
			console.log( error );
			callback( error, body );
		}
	});
};

module.exports = {
	getUserById: getUserById
};