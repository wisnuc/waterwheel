var socket = require('socket.io-client')('http://localhost:10086');
console.log(111)
socket.emit('register',"111")
socket.on('connection', function(socket){
  socket.on('register', function(msg){
    console.log(msg)
  });

});