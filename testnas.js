var socket = require('socket.io-client')('http://localhost:12450');
console.log(111)
socket.emit('register',"111")

socket.on('register1', function(msg){
	socket.emit('statuson',msg)
});

socket.on('resourceadded', function(msg){
	console.log(msg)
});