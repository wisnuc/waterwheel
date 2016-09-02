var createWaterWheel = require('./waterwheel').createWaterWheel
const uuid = require('node-uuid');

class storage{

	constructor(){
		this.waterWheelMap=new Map()
		this.nases = []
	}

	createTank(){
		let tuuid = uuid.v4()
		let newwaterwheel=createWaterWheel(tuuid)

	}
}

module.exports = new storage() 