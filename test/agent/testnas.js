var request =require('supertest')
var fs =require('fs')

var app = require('../../app')
var expect = require('chai').expect
//import Promise from 'bluebird'

describe('testnas api', function() {
  //console.log(1111111110)

  beforeEach(function(done){
    //console.log(1111111111)
    let cstorage = require('../../lib/storage').createStorage
    storage= cstorage()
    let socket={}
    socket.id='444444'
    storage.nasLogin('123456',socket)
    //console.log(storage.nases.get('123456'))
    //console.log(1111111112)
    done()
  })
    
  it('should get a nas status(200) ', (done) => {
    //console.log(storage.nases.get('123456'))
    //console.log(1111111113)
    request(app)
      .get('/nas/123456')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('');
         done();
       })
  })

  it('should get 404 if requestuuid is invalid(get request status)', (done) => {
    request(app)
      .get('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('request not found');
         done();
       })
  })

  it('should create a new waterwheel(200)', (done) => {
    request(app)
      .post('/nas/123456')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         done();
       })
  })

  it('should get 404 if nasuuid is invalid(create request)', (done) => {
    request(app)
      .post('/nas/12345')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('nas not found');
         done();
       })
  })

  it('should get 406 if missing request date (add a new request into a waterwheel)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    request(app)
      .post('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .expect(406)
      .end((err, res) => {
        //console.log(res)
         if(err) return done(err);
         expect(res.body).to.deep.equal('need request data');
         done();
       })
  })

  it('should add a new request into a waterwheel', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    request(app)
      .post('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .send({'data':["aga34"]})
      .expect(200)
      .end((err, res) => {
         // console.log(res)
         if(err) return done(err);
         expect(res.body).to.deep.equal('');
         done();
       })
  })

  it('should get 406 if request data is number (add a new request into a waterwheel)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    request(app)
      .post('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .send({'data':34543})
      .expect(406)
      .end((err, res) => {
         // console.log(res)
         if(err) return done(err);
         expect(res.body).to.deep.equal('need request data');
         done();
       })
  })

  it('should get 406 if request data is string (add a new request into a waterwheel)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    request(app)
      .post('/nas/123456/waterwheel/321/321')
      .set('Accept', 'application/json')
      .send({'data':'34543'})
      .expect(406)
      .end((err, res) => {
         // console.log(res)
         if(err) return done(err);
         expect(res.body).to.deep.equal('need request data');
         done();
       })
  })

  it('should get 404 if nasuuid is invalid (get nas status)', (done) => {
    request(app)
      .get('/nas/1234567')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('nas not found');
         done();
       })
  })

  it('should get a waterwheel status', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    request(app)
      .get('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body[0].uuid).to.deep.equal('321');
         expect(res.body[0].tanks).to.deep.equal([]);
         done();
       })
  })

  it('should get a request status', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    newwaterwheel.registerTank(['123'])
    request(app)
      .get('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body[0].uuid).to.deep.equal('321');
         expect(res.body[0].tanks[0].resource[0].resource).to.deep.equal('123');
         expect(res.body[0].tanks[0].status).to.deep.equal('ready');
         done();
       })
  })

  it('should delete a waterwheel status', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    request(app)
      .delete('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('delete waterwheel success');
         done();
       })
  })

  it('should get 400 if url too long (delete a request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .delete('/nas/123456/waterwheel/321/'+newtank.uuid+'/345235')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('');
         done();
       })
  })

  it('should get 400 if url too short (delete a request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .delete('/nas/123456/waterwheel')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('');
         done();
       })
  })

  it('should get 404 if nasuuid is invalid (delete a request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .delete('/nas/12345/waterwheel/321')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('nas not found');
         done();
       })
  })

  it('should get 404 if waterwheeluuid is invalid (delete a request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .delete('/nas/123456/waterwheel/21')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('waterwheel not found');
         done();
       })
  })

  it('should delete a request status(200)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .delete('/nas/123456/waterwheel/321/5213')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('delete request success');
         done();
       })
  })

  it('should update a request status(200)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .patch('/nas/123456/waterwheel/321/'+newtank.uuid)
      .set('Accept', 'application/json')
      .send({'status':'done'})
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('updated request');
         done();
       })
  })

  it('should get 404 if url too short (update request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .patch('/nas/123456/waterwheel/321')
      .set('Accept', 'application/json')
      .send({'status':'done'})
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('request not found');
         done();
       })
  })

  it('should get 404 if url too long (update request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .patch('/nas/123456/waterwheel/321/'+newtank.uuid+'/')
      .set('Accept', 'application/json')
      .send({'status':'done'})
      .expect(404)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('request not found');
         done();
       })
  })

  it('should do nothing is status is not done, ready or error (update request 200)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .patch('/nas/123456/waterwheel/321/'+newtank.uuid)
      .set('Accept', 'application/json')
      .send({'status':'543'})
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('updated request');
         done();
       })
  })

  it('should get 400 if waterwheeluuid is invalid (update request)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['123'])
    request(app)
      .patch('/nas/123456/waterwheel/323/'+newtank.uuid)
      .set('Accept', 'application/json')
      .send({'status':'done'})
      .expect(400)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('failed');
         done();
       })
  })

  it('should upload a file', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f'])

    request(app)
      .post('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id)
      .set('Accept', 'application/json')
      .attach('file','createkey.js')
      .field('sha256','1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('success');
         done();
       })
  })

  it('should get 400 if url too long (upload)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f'])

    request(app)
      .post('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id+'/')
      .set('Accept', 'application/json')
      .attach('file','createkey.js')
      .field('sha256','1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f')
      .expect(400)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('url is invalid');
         done();
       })
  })

  it('should get 400 if url too short (upload)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f'])

    request(app)
      .post('/nas/123456/files/321/'+newtank.uuid)
      .set('Accept', 'application/json')
      .attach('file','createkey.js')
      .field('sha256','1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f')
      .expect(400)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('url is invalid');
         done();
       })
  })

  it('should get 400 if sha256 is not correct (upload)', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f'])

    request(app)
      .post('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id)
      .set('Accept', 'application/json')
      .attach('file','createkey.js')
      .field('sha256','321')
      .expect(400)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('digest is invalid');
         done();
       })
  })

  it('should download a file', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f'])

    request(app)
      .post('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id)
      .set('Accept', 'application/json')
      .attach('file','createkey.js')
      .field('sha256','1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('success');
         let req=request(app)
          .get('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if(err) return done(err);
            // let file = res.body.find(obj => obj.type === 'file')
            // console.log(file.size)
            // console.log(file.name)
            done();
          })
       })
  })

  it('should delete a file', (done) => {
    let createWaterWheel = require('../../lib/waterwheel').createWaterWheel
    let newwaterwheel=createWaterWheel()
    newwaterwheel.uuid='321'
    storage.waterwheelmap.set('321',newwaterwheel)
    storage.setContainerMap('123456',newwaterwheel)
    let newtank=newwaterwheel.registerTank(['1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f'])

    request(app)
      .post('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id)
      .set('Accept', 'application/json')
      .attach('file','createkey.js')
      .field('sha256','1a526c21993825de479bda67c08f8c90502464dd08d81ccaa444ce2074aad47f')
      .expect(200)
      .end((err, res) => {
         if(err) return done(err);
         expect(res.body).to.deep.equal('success');
         let req=request(app)
          .delete('/nas/123456/files/321/'+newtank.uuid+'/'+newtank.resource[0].id)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.body).to.deep.equal('success');
            done();
          })
       })
  })
})
