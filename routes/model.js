var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/bijia';

var authorizedClientIds = ['s6BhdRkqt3', 'toto', 'testbysteve'];

var model = {
  
  //
  // oauth2-server callbacks - always requried
  //
  getAccessToken: function (bearerToken, callback) {

    console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

    MongoClient.connect(dbUrl, function(err, db) {
      assert.equal(null, err);
      var col = db.collection('OAuthAccessTokens');
      col.findOne({accessToken: bearerToken}, callback);
    });
  
  },
  
  getClient: function (clientId, clientSecret, callback) {

    console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

    MongoClient.connect(dbUrl, function(err, db) {

      assert.equal(null, err);
      var col = db.collection('OAuthClients');

      if (clientSecret === null) {
        col.findOne({ clientId: clientId }, callback);
      } else{

        col.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);

      }


    });

  },
  
  // This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
  // it gives an example of how to use the method to resrict certain grant types
  grantTypeAllowed: function (clientId, grantType, callback) {

    console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');
  
    if (grantType === 'password') {
      callback(false, authorizedClientIds.indexOf(clientId) >= 0);
    } else {
      callback(false, true);
    }
  

  },
  
  saveAccessToken: function (token, clientId, expires, userId, callback) {

    console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

    MongoClient.connect(dbUrl, function(err, db) {

      assert.equal(null, err);
      var col = db.collection('OAuthAccessTokens');

      col.insertOne({
        accessToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
      },
      function(err, r){
        assert.equal(null, err);
        callback();
      });

    });

  },

  //
  // required by grant type = client credentials
  //

  getUserFromClient: function(clientId, clientSecret, callback) {
    console.log('in getUserFromClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

    MongoClient.connect(dbUrl, function(err, db) {

      assert.equal(null, err);
      var col = db.collection('OAuthUsers');

      if (clientSecret === null) {
        col.findOne({ clientId: clientId }, callback);
      } else {
        col.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
      }

    });

  }

}

module.exports = model;