var expect=require('chai').expect
var validator = require('validator')
var UUID = require('node-uuid')
var requireUncached = require('./requireuncached').requireUncached
var cstorage = require('../lib/storage').createStorage

describe('storage', function() {

  describe('create waterwheel', function() {
    it('should create a new waterwheel', function(done) {
        //let storage =requireUncached('../lib/storage')
        let storage = cstorage()
    	let newwaterwheel=storage.createNewWaterWheel()
        expect(newwaterwheel.tanks).deep.to.equal([])
        done()
    })
  })

  describe('nasLogin', function() {
    it('should set nases map and sockets map', function(done) {
        //let storage =requireUncached('../lib/storage')
        let storage = cstorage()
    	let socket={}
    	socket.id='123'
    	storage.nasLogin('456',socket)
    	expect(storage.nases.get('456')).to.equal(socket)
    	expect(storage.sockets.get('123')).to.equal('456')
    	done()
    })
  })

  describe('waterwheelbundle', function() {

    it('should give a nasuuid to a waterwheel', function(done) {
        //let storage =requireUncached('../lib/storage')
        let storage = cstorage()
    	let socket={}
    	socket.id='123'
    	storage.nasLogin('456',socket)
    	expect(storage.nases.get('456')).to.equal(socket)
    	expect(storage.sockets.get('123')).to.equal('456')
    	let newwaterwheel=storage.waterWheelBundle('456')
    	expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
    	expect(tanklist[0]).deep.to.equal(newwaterwheel)
    	done()
    })
  })

  describe('setContainerMap  v1', function() {
    it('should set nas-waterwheels map(create a new key)', function(done) {
        //let storage =requireUncached('../lib/storage')
        let storage = cstorage()
    	let uuid = '123'
    	let tank = {'aaa':'bbb'}
    	storage.setContainerMap(uuid,tank)
    	let waterwheellist=storage.containermap.get('123')
    	expect(waterwheellist[0]).deep.to.equal(tank)
    	done()
    })
  })

  describe('setContainerMap  v2', function() {
    it('should set nas-waterwheels map(add a value)', function(done) {
        //let storage =requireUncached('../lib/storage')
        let storage = cstorage()
    	let uuid = '123'
    	let tank1 = {'aaa':'bbb'}
    	let tank2 = {'ccc':'ddd'}
    	storage.setContainerMap(uuid,tank1)
    	let waterwheellist1=storage.containermap.get('123')
    	expect(waterwheellist1[0]).deep.to.equal(tank1)
        expect(waterwheellist1.length).to.equal(1)
    	storage.setContainerMap(uuid,tank2)
    	let waterwheellist2=storage.containermap.get('123')
        expect(waterwheellist2.length).to.equal(2)
    	expect(waterwheellist2[0]).deep.to.equal(tank1)
    	expect(waterwheellist2[1]).deep.to.equal(tank2)
    	done()
    })
  })

  describe('deletewaterwheel', function() {
    it('should delete a waterwheel', function(done) {
        //let storage =requireUncached('../lib/storage')
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        storage.deleteWaterWheel('456',newwaterwheel.uuid)
        expect(storage.waterwheelmap.has(newwaterwheel.uuid)).to.equal(false)
        expect(storage.containermap.get('456')).deep.to.equal([])
        done()
    })
  })

  describe('deleterequest', function() {
    it('should delete a request', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank([])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        storage.deleteRequest(newwaterwheel.uuid,newrequest.uuid)
        let waterwheel2=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(0)
        let waterwheellist2=storage.containermap.get('456')
        expect(waterwheellist2[0].tanks.length).to.equal(0)
        done()
    })
  })

  describe('updaterequest', function() {
    it('should update a request', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank([])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        let waterwheel2=storage.updateRequest(newwaterwheel.uuid,newrequest.uuid,'done')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        expect(waterwheellist1[0].tanks[0].status).to.equal('done')
        done()
    })
  })

  describe('updaterequest', function() {
    it('should get false if waterwheeluuid is invalid', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank([])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        let waterwheel2=storage.updateRequest('4213124',newrequest.uuid,'done')
        expect(waterwheel2).to.equal(false)
        done()
    })
  })

  describe('updaterequest', function() {
    it('should do nothing if requestuuid is invalid', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank([])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        let waterwheel2=storage.updateRequest(newwaterwheel.uuid,'321','done')
        expect(waterwheel2).to.equal(newwaterwheel)
        done()
    })
  })

describe('updaterequest', function() {
    it('should do nothing if status is not done, ready or error', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank([])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        let waterwheel2=storage.updateRequest(newwaterwheel.uuid,newrequest.uuid,'51233')
        expect(waterwheel2).to.equal(newwaterwheel)
        done()
    })
  })

describe('checkfiles', function() {
    it('should get true', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank(['44668953'])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        newrequest.resource[0].id='555'
        let re=storage.checkFiles(newwaterwheel.uuid,newrequest.uuid,'555')
        expect(re).to.equal(true)
        done()
    })
  })

describe('checkfiles', function() {
    it('should get false if resourceuuid is invalid', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank(['44668953'])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        newrequest.resource[0].id='555'
        let re=storage.checkFiles(newwaterwheel.uuid,newrequest.uuid,'444')
        expect(re).to.equal(false)
        done()
    })
  })

describe('checkfiles', function() {
    it('should get false if requestuuid is invalid', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank(['44668953'])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        newrequest.resource[0].id='555'
        let re=storage.checkFiles(newwaterwheel.uuid,'7865','555')
        expect(re).to.equal(false)
        done()
    })
  })

describe('checkfiles', function() {
    it('should get false if waterwheeluuid is invalid', function(done) {
        let storage = cstorage()
        let socket={}
        socket.id='123'
        storage.nasLogin('456',socket)
        expect(storage.nases.get('456')).to.equal(socket)
        expect(storage.sockets.get('123')).to.equal('456')
        let newwaterwheel=storage.waterWheelBundle('456')
        expect(storage.waterwheelmap.get(newwaterwheel.uuid)).deep.to.equal(newwaterwheel)
        let tanklist=storage.containermap.get('456')
        expect(tanklist[0]).deep.to.equal(newwaterwheel)
        let newrequest=newwaterwheel.registerTank(['44668953'])
        let waterwheel1=storage.waterwheelmap.get(newwaterwheel.uuid)
        expect(waterwheel1.tanks.length).to.equal(1)
        let waterwheellist1=storage.containermap.get('456')
        expect(waterwheellist1[0].tanks.length).to.equal(1)
        newrequest.resource[0].id='555'
        let re=storage.checkFiles('7234785',newrequest.uuid,'555')
        expect(re).to.equal(false)
        done()
    })
  })

})