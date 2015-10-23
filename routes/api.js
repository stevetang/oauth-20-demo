var express = require('express');
var router = express.Router();
var oauthserver = require('oauth2-server');
var helloworld = require('./apis/helloworld');

var oauth = oauthserver({
  model: require('./model'), // See below for specification
  grants: ['client_credentials'],
  debug: true
});

router.all('/oauth/token', oauth.grant());

router.use('/helloworld', oauth.authorise(), helloworld);

router.use(oauth.errorHandler());

module.exports = router;