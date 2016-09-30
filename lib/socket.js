class socketmanager{
	sendMessage(uuid,action,msg){
		let targetsocket=storage.getNasSocket(uuid)
		targetsocket.emit(action,msg)
	}
}

module.exports = new socketmanager()