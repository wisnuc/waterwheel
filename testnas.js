var socket = require('socket.io-client')('http://localhost:12450');
console.log(111)
socket.emit('register',"111")

socket.on('register1', function(msg){
  console.log(333)
  console.log(msg)
});