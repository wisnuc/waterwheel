var uuid =require('node-uuid');

class waterwheel {
	constructor(uuid){
		this.uuid=uuid
		this.timestamp=new Date().getTime()
		this.tanks = []
	}

	rebuildResource(resource){
		//console.log(']]]]]]]]]]]]]]')
		// let nresource=JSON.parse(resource)
		//console.log(typeof(resource))
		
		//console.log(resource)
		let newresource=resource.map(r=>{
			let data={}
			data.id=uuid.v4()
			data.resource=r
			return data
		})
		return newresource
	}

	updateTank(uuid,status){
		this.tanks.map(r=>{if(r.uuid===uuid)r.status=status})
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

	delTank(uuid){
		this.tanks=this.tanks.reduce((p,c)=>{
			if(c.uuid!==uuid)p.push(c)
			return p
		},[])
	}
}

exports.createWaterWheel = function(uuid){
	return new waterwheel(uuid)
}