var util = require('util');
var request = require('request');
var ld = require('lodash');
var config = require('../config');
var users = [];

exports.findOrCreateByTwitterData = function(twitterUserData, accessToken, accessTokenSecret, promise) {
  console.log( twitterUserData );
  request( config.apiServer() + '/accounts', function( error, response, body ){
    if( !error && response.statusCode === 200 ){
      users = JSON.parse( body );

      var user = ld.findWhere( users, { 'twitterid': twitterUserData.id });
      if( user ){
        user = ld.assign( user ,{ accessToken: accessToken, accessTokenSecret: accessTokenSecret });
        promise.fulfill( user );
        return;
      }else {
        request.post( config.apiServer() + '/accounts', { twitterid: twitterUserData.id, accessToken: accessToken, accessTokenSecret: accessTokenSecret }, function( err, resp, bd ){
          if( !err && resp.statusCode === 200 ){
            console.log("create new user");
            var b = JSON.parse( bd );
            var user = b.generated_keys[0];
            promise.fulfill( user );
            return;
          }else {
            console.log( err );
            promise.fail( err );
          }
        });
      }
    }else {
      console.log( error );
      promise.fail( error );
    }
  });
};