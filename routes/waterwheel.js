var router = require('express').Router();
//var checkuuid = require();
var url = require("url");
var debug=false;

router.get('/*', (req, res) => {
    var pathname = url.parse(req.url).pathname;
    var tpath = pathname.substr(1);
    console.log(7878734)
    console.log(tpath)
    //if(!checkuuid(fuuid))return res.status(404).json('uuid not found')
    return res.status(404).json('')
});