/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    io = require('socket.io');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
process.env.MONGOHQ_URL = 'mongodb://localhost:27017/testapp'
process.env.SECRET = 'mredetts'

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

//Bootstrap db connection
mongoose.connect(config.db);

var db = mongoose.connection;

try{
    db.on('open', function(){
        console.log('successfully connected to the DB');
    })
}catch(e){
console.log('nope', e)
}


db.once('close', function(){
    console.log('successfully disconnected from DB');
})

db.once('error', function(err){
    console.log('hi', err);
})

process.on('SIGINT', function () {
    console.log('closing');
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination (SIGINT)');
        process.exit(0);
    });
})

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//bootstrap passport config
require('./config/passport')(passport);

var app = express();

app.use(function(req, res, next){
    next();
});

//express settings
require('./config/express')(app, passport, mongoose);

//Bootstrap routes
require('./config/routes')(app, passport, auth);

//Start the app by listening on <port>
var port = config.port;
var server = app.listen(port);
var ioObj = io.listen(server, { log: false });
//game logic handled here
require('./config/socket/socket')(ioObj);
console.log('Express app started on port ' + port);

//Initializing logger
logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;