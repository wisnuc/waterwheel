var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var mime=require('config/mime');
const globby = require('globby');
var xattr = require('fs-xattr');
const uuid = require('node-uuid');
var schedule = require('node-schedule');
var spawnSync = require('child_process').spawnSync;
/** Express **/
var app = express();
var fs = require("fs");
//var timeout =require('connect-timeout');
//app.use(timeout('10000s'));
/** Database Connection **/
var env = app.get('env');
if (env !== 'production' && env !== 'development' && env !== 'test') {
  console.log('Unrecognized NODE_ENV string: ' + env);
  console.log('exit');
  process.exit(1);
} else {
  console.log('NODE_ENV is set to ' + env);
}
var broker = require("./lib/broker")
var cstorage = require('./lib/storage').createStorage
global.storage = cstorage()
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
  extended: true
}));
/** Routeing Begins **/
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/nas', require('./routes/nas'));
/** Routing Ends **/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.type('text/plain');
  res.send(err.status + ' ' + err.message);
});

// module.exports = app;
/**
 * Module dependencies.
 */
var io = require("socket.io").listen(12450);
io.sockets.on('connection', function(socket){
  var id = socket.id;
  socket.on('register', function(msg){
    socket.emit('register1',broker.register(msg))
  });

  socket.on('statuson', function(msg){
    broker.statuson(msg,socket)
  });

  socket.on('disconnect',function(){
    console.log(222222)
    broker.statusoff(id)
  });
});

// var app = require('../build/app');

/**
 * Get port from environment and store in Express.
 */


module.exports = app
