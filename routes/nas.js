//var User = require('mongoose').model('User');
var router = require('express').Router();
//var checkuuid = require();
var url = require("url");
var debug=false;
var socketmanage = require('../lib/socket')
var adapter = require('../lib/adapter')
var formidable = require('formidable')
var sanitize = require('sanitize-filename')
var tmppath = process.cwd()+'/tmpfolder/'
var upath = process.cwd()+'/uploads/'
var path = require('path')
var fs = require('fs');
const UUID = require('node-uuid');
const readChunk = require('read-chunk');
const fileType = require('file-type');
var rimraf = require('rimraf');


router.get('/*/waterwheel*', (req, res) => {
    let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    //console.log(111111)
    let uuids=tpath.split('/')
    //console.log(tpath)
    if(uuids.length>4)return res.status(400).json('')
    if(uuids.length===4){
        let re = storage.getRequest(uuids[2],uuids[3])
        if(!re) return res.status(404).json('request not found') 
        return res.status(200).json(re) 
    }
    if(uuids.length===3){
        let re =storage.getWaterWheelByNas(uuids[0])
        if(!re) return res.status(404).json('request not found') 
        return res.status(200).json(re) 
    }
    let result=storage.getWaterWheel(uuids[2])
	if(!result)return res.status(404).json('waterwheel not found')
	return res.status(200).json(result)
	//}
    //if(!checkuuid(fuuid))return res.status(404).json('uuid not found')
    //return res.status(404).json('')
});

router.get('/*/files*',(req,res)=>{
    let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    let uuids=tpath.split('/')
    if(uuids.length!==5)return res.status(400).json('url is invalid')
    let fname = storage.getFileName(uuids[2],uuids[3],uuids[4])
    if(!fname)return res.status(404).json('file not found')
    let realpath= path.join(upath,fname)
    fs.exists(realpath, function(exists){
      if(!exists){
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.write("File was not found on this server.");
          res.end();
      } 
      else{
        var readStream = fs.createReadStream(realpath)
        const buffer = readChunk.sync(realpath, 0, 262);
        var filetype =  fileType(buffer);
        if (filetype!==null){
          res.writeHead(200, {'Content-Type': filetype.mime});
          readStream.pipe(res);
        }
        else{
          res.writeHead(200, {'Content-Type': 'unknow'});
          readStream.pipe(res);
        }
      }
    })
})

router.post('/*/files*',(req,res)=>{
    let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    let uuids=tpath.split('/')
    if(uuids.length!==5)return res.status(400).json('url is invalid')
    if(req.is('multipart/form-data')&&storage.checkFiles(uuids[2],uuids[3],uuids[4])){
      let sha256, abort = false
      let form = new formidable.IncomingForm()
      form.hash = 'sha256'

      form.on('field', (name, value) => {
        if (name === 'sha256')
          sha256 = value
      })

      form.on('fileBegin', (name, file) => {
        file.path = path.join(tmppath, UUID.v4())
      })

      form.on('file', (name, file) => {
        if (abort) return
        if (sha256 !== file.hash) {
          return fs.unlink(file.path, err => {
            res.status(400).json('digest is invalid')
          })
        }
        
       fs.rename(file.path,path.join(upath,file.hash),err=>{
          if(err)return callback(err)
          storage.updateRequest(uuids[2],uuids[3],'done')
          res.status(200).json('success')
       })
      })

      // this may be fired after user abort, so response is not guaranteed to send
      form.on('error', err => {
        abort = true
        return res.status(500).json({
          code: err.code,
          message: err.message
        })
      })

      form.parse(req)
    }
})

router.delete('/*/files*',(req,res)=>{
    let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    let uuids=tpath.split('/')
    if(uuids.length!==5)return res.status(400).json('url is invalid')
    let fname = storage.getFileName(uuids[2],uuids[3],uuids[4])
    if(!fname)return res.status(404).json('file not found')
    let realpath= path.join(upath,fname)
    fs.exists(realpath, function(exists){
      if(!exists){
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write("File was not found on this server.");
        res.end();
      } 
      else{
        rimraf(realpath, err => {
          if (err) return done(err)
          return res.status(200).json('success')
        })
      }
    })
})

router.post('/*/waterwheel*',(req,res)=>{
	  let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    let uuids=tpath.split('/')

    if(typeof(req.body.data)!=='object') return res.status(406).json('need request data')
    if(!req.body.data)return res.status(406).json('need request data')
    if(uuids.length>3)return res.status(400).json('')
    if(uuids.length===3){
    	let waterwheel=storage.getWaterWheel(uuids[2])
    	let newtank=waterwheel.registerTank(req.body.data)
    	let newres=adapter.toServer(uuids[0],uuids[2],newtank.uuid)
      try{
  	    socketmanage.sendMessage(uuids[0],'resourceadded',newres)
      }
      catch(e){
      }
    	return res.status(200).json('')
    }
    let result= storage.waterWheelBundle(uuids[0])
    if(!result)return res.status(404).json('nas not found')
    return res.status(200).json(result.uuid)
    //else 
});

router.delete('/*/waterwheel*',(req,res)=>{
    let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    let uuids=tpath.split('/')
    if(uuids.length<3||uuids.length>4)return res.status(400).json('')
    if(!storage.hasNas(uuids[0]))return res.status(404).json('nas not found')
    if(!storage.hasWaterWheel(uuids[2]))return res.status(404).json('waterwheel not found')
    if(uuids.length===3){
        storage.deleteWaterWheel(uuids[0],uuids[2])
        return res.status(200).json('delete waterwheel success')
    }
    if(uuids.length===4){
        storage.deleteRequest(uuids[2],uuids[3])
        return res.status(200).json('delete request success')
    }
})

router.patch('/*/waterwheel*',(req,res)=>{
  let pathname = url.parse(req.url).pathname;
  let tpath = pathname.substr(1);
  let uuids=tpath.split('/')
  if(uuids.length===4){
  	let re=storage.updateRequest(uuids[2],uuids[3],req.body.status)
    if(!re)return res.status(400).json('failed')
  	return res.status(200).json('updated request')
  }
	return res.status(404).json('request not found')
    //else 
});

router.get('/*', (req, res) => {
    let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    //console.log(tpath)
    let uuids=tpath.split('/')
    if(uuids.length>1)return res.status(400).json('')
    if(storage.hasNas(uuids[0]))return res.status(200).json('')
    return res.status(404).json('nas not found')
	//else if(uuids.length===2){
	//}
    //if(!checkuuid(fuuid))return res.status(404).json('uuid not found')
    //return res.status(404).json('')
});

router.post('/*',(req,res)=>{
	  let pathname = url.parse(req.url).pathname;
    let tpath = pathname.substr(1);
    let uuids=tpath.split('/')
    if(uuids.length>1)return res.status(400).json('')
    let result= storage.waterWheelBundle(uuids[0])
    if(!result)return res.status(404).json('nas not found')
    return res.status(200).json(result.uuid)
    //else 
});

module.exports = router;

