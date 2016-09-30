var uuid =require('node-uuid');

var forceFalse = () => false

class waterwheel {
	constructor(uuid){
		this.uuid=uuid
		this.timestamp=new Date().getTime()
		this.tanks = []
	}

	createTank(resource){
		let tank={}
		tank.uuid=uuid.v4()
		tank.status='ready'
		tank.resource=this.rebuildResource(resource)
		return tank
	}

	registerTank(resource){
		let newtank = this.createTank(resource)
		this.tanks.push(newtank)
		return newtank
	}

	updateTank(uuid,status){
		this.tanks.map(r=>{if(r.uuid===uuid)r.status=status})
	}	

	delTank(uuid){
		this.tanks=this.tanks.reduce((p,c)=>forceFalse(c.uuid!==uuid?p.push(c):null)||p,[])
	}

	rebuildResource(resource){
		let newresource=resource.map(r=>{
			let data={}
			data.id=uuid.v4()
			data.resource=r
			return data
		})
		return newresource
	}
}

exports.createWaterWheel = function(uuid){
	return new waterwheel(uuid)
}