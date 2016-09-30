var createWaterWheel = require('./waterwheel').createWaterWheel
const uuid = require('node-uuid');
var forceFalse = () => false


class storage{

	constructor(){
		this.waterwheelmap=new Map()  //waterwheelid, waterwheel map
		this.nases = new Map() // uuid,socket map
		this.sockets = new Map() //socketid, uuid map
		this.containermap = new Map() // nasuuid,waterwheels map
	}

	hasSocket(socketid){
		return this.sockets.has(socketid)
	}

	hasWaterWheel(uuid){
		return this.waterwheelmap.has(uuid)
	}

	hasNas(uuid){
		return this.nases.has(uuid)
	}

	getNasSocket(uuid){
		if(this.hasNas(uuid))return this.nases.get(uuid)
		return false
	}

	getWaterWheel(uuid){
		if(this.hasWaterWheel(uuid))return this.waterwheelmap.get(uuid) 
		return false
	}

	getFileName(waterwheeluuid,requestuuid,resourceuuid){
		let re = this.getRequest(waterwheeluuid,requestuuid)
		if(!re)return false
		let re2 = false
	    re.resource.map(r=>r.id===resourceuuid?re2 = r.resource:null)
	    return re2
	}

	getWaterWheelByNas(uuid){
		if(this.containermap.has(uuid))return this.containermap.get(uuid)
		return false
	}

	getRequest(waterwheeluuid,requestuuid){
		let re = this.getWaterWheel(waterwheeluuid)
		if(!re)return false
		let re2=false
		re.tanks.map(r=>{
			if(r.uuid===requestuuid)re2=r
		})
		return re2
	}

	createNewWaterWheel(){
		let tuuid = uuid.v4()
		let newwaterwheel=createWaterWheel(tuuid)
		return newwaterwheel
	}

	createNewRequest(waterwheeluuid,data){
		let newwaterwheel=this.getWaterWheel(waterwheeluuid)
    	let newtank=newwaterwheel.registerTank(data)
    	return newtank
	}



	updateRequest(waterwheeluuid,tankuuid,status){
		let newwaterwheel = this.getWaterWheel(waterwheeluuid)
		if(!newwaterwheel)return false
		if(status==='ready'||status==='done'||status==='error')newwaterwheel.updateTank(tankuuid,status)
		return newwaterwheel	
	}

	deleteWaterWheel(nasuuid,waterwheeluuid){
		if(this.waterwheelmap.has(waterwheeluuid)){
			let waterwheel=this.waterwheelmap.get(waterwheeluuid)
			this.waterwheelmap.delete(waterwheeluuid)
			let waterwheellist=this.containermap.get(nasuuid)
			let newlist=waterwheellist.reduce((p,c)=>forceFalse(c!==waterwheel?p.push(c):null)||p,[])
			this.containermap.set(nasuuid,newlist)
		}
	}

	deleteRequest(waterwheeluuid,requestuuid){
		if(this.waterwheelmap.has(waterwheeluuid)){
			let waterwheel = this.waterwheelmap.get(waterwheeluuid)
			waterwheel.tanks=waterwheel.tanks.reduce((p,c)=>forceFalse(c.uuid!==requestuuid?p.push(c):null)||p,[])
		}
	}

	removeNas(socketid){
		if(this.hasSocket(socketid)){
			let nasuuid=this.sockets.get(socketid)
			this.nases.delete(nasuuid)
			this.sockets.delete(socketid)
		}
		return false
	}

	waterWheelBundle(nasuuid){
		if(this.hasNas(nasuuid)){
			let newwaterwheel = this.createNewWaterWheel()
			this.waterwheelmap.set(newwaterwheel.uuid,newwaterwheel)
			this.setContainerMap(nasuuid,newwaterwheel)
			return newwaterwheel
		}
		return false
	}

	nasLogin(uuid,socket){
		this.nases.set(uuid,socket)
		this.sockets.set(socket.id,uuid)
	}

	setContainerMap(nasuuid,tank){
		if(this.containermap.has(nasuuid)){
			let tanklist=this.containermap.get(nasuuid)
			tanklist.push(tank)
			this.containermap.set(nasuuid,tanklist)
		}
		else{
	 		let newlist=[]
	 		newlist.push(tank)
	 		this.containermap.set(nasuuid,newlist)
		}
	}

	checkFiles(waterwheeluuid,requestuuid,resourceuuid){
		let re = this.getRequest(waterwheeluuid,requestuuid)
		if(!re)return false
		let re2 = false
	    re.resource.map(r=>r.id===resourceuuid?re2 = true:null)
	    return re2
	}
}

function createStorage(){
	return new storage()
}

exports.createStorage=createStorage