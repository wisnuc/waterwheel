class adapter{
	toServer(serverid,waterwheelid,resourceid){
		let newresponse={}
		newresponse.server=serverid
		newresponse.waterwheel=waterwheelid
		newresponse.resource =resourceid 
		return newresponse
	}
}

module.exports = new adapter() 