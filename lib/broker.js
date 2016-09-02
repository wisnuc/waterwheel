var serverEncrypt =require('./endecrype').serverEncrypt
var serverDecrypt =require('./endecrype').serverDecrypt
const uuid = require('node-uuid');

function checkuuid(uuid){
	return true
}

function register(msg){
	if(!checkuuid(msg)) return false
	return serverEncrypt(uuid.v4())
}

exports.register = register