var expect=require('chai').expect
var validator = require('validator')
var UUID = require('node-uuid')
var createWaterWheel = require('../lib/waterwheel').createWaterWheel

describe('waterwheel', function() {
  describe('create waterwheel', function() {
    it('should create a new waterwheel', function(done) {
        let newwaterwheel =createWaterWheel('123456')
        expect(newwaterwheel.uuid).to.equal('123456')
        expect(newwaterwheel.tanks).deep.to.equal([])
        done()
    })
  })

  describe('create rebuildResource', function() {

    it('should create rebuildResource', function(done) {
        let newwaterwheel =createWaterWheel('123456')
        let newresource = newwaterwheel.rebuildResource(["123","456","789"])
        expect(newresource[0].resource).to.equal('123')
        expect(newresource[1].resource).to.equal('456')
        expect(newresource[2].resource).to.equal('789')
        done()
    })
  })

  describe('create tank', function() {

    it('should create a new tank', function(done) {
        let newwaterwheel =createWaterWheel('123456')
        let newtank = newwaterwheel.createTank(["123","456","789"])
        expect(newtank.resource[0].resource).to.equal('123')
        expect(newtank.resource[1].resource).to.equal('456')
        expect(newtank.resource[2].resource).to.equal('789')
        expect(newtank.status).to.equal('ready')
        done()
    })
  })

  describe('register tank', function() {

    it('should create a new tank and push it into tanks', function(done) {
        let newwaterwheel =createWaterWheel('123456')
        let newtank = newwaterwheel.registerTank(["123","456","789"])
        expect(newtank.resource[0].resource).to.equal('123')
        expect(newtank.resource[1].resource).to.equal('456')
        expect(newtank.resource[2].resource).to.equal('789')
        expect(newtank.status).to.equal('ready')
        expect(newwaterwheel.tanks.length).to.equal(1)
        expect(newwaterwheel.tanks[0]).deep.to.equal(newtank)
        done()
    })
  })

  describe('delete tank', function() {

    it('should del a tank', function(done) {
        let newwaterwheel =createWaterWheel('123456')
        let newtank = newwaterwheel.registerTank(["123","456","789"])
        expect(newtank.resource[0].resource).to.equal('123')
        expect(newtank.resource[1].resource).to.equal('456')
        expect(newtank.resource[2].resource).to.equal('789')
        expect(newtank.status).to.equal('ready')
        expect(newwaterwheel.tanks.length).to.equal(1)
        expect(newwaterwheel.tanks[0]).deep.to.equal(newtank)
        newwaterwheel.delTank(newwaterwheel.tanks[0].uuid)
        console.log("-----")
        console.log(newwaterwheel)
        expect(newwaterwheel.tanks.length).to.equal(0)
        done()
    })
  })
})