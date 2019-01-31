/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    jwt = require('jsonwebtoken'),
    _ = require('underscore');

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */
exports.play = function(req, res) {

  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = function(req, res) {
  var token = process.env.TOKEN;
  var user = "null";
  if (token){
      jwt.verify(token, process.env.SECRET, function(err, decoded) {
          if(decoded){
              console.log(decoded.exp, ' '+Date.now() / 1000);
              if (decoded.exp > Date.now() / 1000){
                  user = JSON.stringify({'token' : token});
              }
          }else{
              console.log(err);
          }

      });
  }

    console.log('from index', user);
    res.render('index', {
        user: user
    });
};