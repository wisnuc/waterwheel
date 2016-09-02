const waterwheel ={
	constructor(uuid){
		this.uuid=uuid
	}
}

exports.createWaterWheel = function(uuid){
	return new waterwheel(uuid)
}