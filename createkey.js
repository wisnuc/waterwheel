var ursa = require('ursa')
var fs = require('fs')
var modulusBit = 512;  
var key  = ursa.generatePrivateKey(modulusBit, 65537);
var path ="/git/waterwheel/"

// exports.createkeyfiles=function(path){
// 	var privatePem = ursa.createPrivateKey(key.toPrivatePem());
// 	var privateKey = privatePem.toPrivatePem('utf8');
// 	fs.writeFile(path+'private.pem', privateKey, 'utf8', function(error){
// 	    if(error){
// 	        throw error;
// 	    }
// 	});

// 	var publicPem = ursa.createPublicKey(key.toPublicPem());
// 	var publicKey = publicPem.toPublicPem('utf8');
// 	fs.writeFile(path+'public.pub', publicKey, 'utf8', function(error){
// 	    if(error){
// 	        throw error;
// 	    }
// 	});
// }

function createkeyfiles(path){
	var privatePem = ursa.createPrivateKey(key.toPrivatePem());
	var privateKey = privatePem.toPrivatePem('utf8');
	fs.writeFile(path+'private.pem', privateKey, 'utf8', function(error){
	    if(error){
	        throw error;
	    }
	});

	var publicPem = ursa.createPublicKey(key.toPublicPem());
	var publicKey = publicPem.toPublicPem('utf8');
	fs.writeFile(path+'public.pub', publicKey, 'utf8', function(error){
	    if(error){
	        throw error;
	    }
	});
}

createkeyfiles(path)