var serverEncrypt =require('./endecrype').serverEncrypt
var serverDecrypt =require('./endecrype').serverDecrypt
const uuid = require('node-uuid');


function checkuuid(uuid){
	return true
}

function register(msg){
	if(!checkuuid(msg)) return false
	let newuser={}
	newuser.uuid = uuid.v4()
	return serverEncrypt(JSON.stringify(newuser))
}

function statuson(msg,socket){
	try{
		let user=JSON.parse(serverDecrypt(msg))
		console.log(user)
		storage.nasLogin(user.uuid,socket)
	}
	catch(e){
		console.log(e)
	}
}

function statusoff(socketid){
	storage.removeNas(socketid)
}

exports.register = register
exports.statuson = statuson
exports.statusoff = statusoff