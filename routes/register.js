//var User = require('mongoose').model('User');
var router = require('express').Router();
//var checkuuid = require();
var debug=false;

router.get('/*', (req, res) => {
    var pathname = url.parse(req.url).pathname;
    var fuuid = pathname.substr(1);
    //if(!checkuuid(fuuid))return res.status(404).json('uuid not found')
    
});


module.exports = router;

