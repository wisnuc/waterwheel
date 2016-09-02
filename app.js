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
global.storage = require('./lib/storage')
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/** Routeing Begins **/
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/register', require('./routes/register'));
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
  var hs = socket.handshake;

  socket.on('register', function(msg){
    console.log("222")
    console.log(socket)
    socket.emit('register1',broker.register(msg))
  });

  socket.on('statuson', function(msg){
    broker.statuson(msg)
  });
});


// var app = require('../build/app');
var debug = require('debug')('myapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '80');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.timeout = 100000000000;
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = server
