var ursa = require('ursa')
var fs = require('fs')
var encoding = require('encoding');
var modulusBit = 512;  
var key  = ursa.generatePrivateKey(modulusBit, 65537);
function createkeyfiles(){
	var privatePem = ursa.createPrivateKey(key.toPrivatePem());
	var privateKey = privatePem.toPrivatePem('utf8');
	fs.writeFile('private.pem', privateKey, 'utf8', function(error){
	    if(error){
	        throw error;
	    }
	    console.log(privateKey);
	});


	var publicPem = ursa.createPublicKey(key.toPublicPem());
	var publicKey = publicPem.toPublicPem('utf8');
	fs.writeFile('public.pub', publicKey, 'utf8', function(error){
	    if(error){
	        throw error;
	    }
	    console.log(publicKey);
	});
}



var server_public=fs.readFileSync('public.pub').toString()

var server_private=fs.readFileSync('private.pem').toString()

var server = {
    pem :ursa.createPrivateKey(server_private),
    pub :ursa.createPublicKey(server_public)
};

var serverPublic = server.pub;

var serverPrivate = server.pem;

var serverModulusBit = 512;

var serverMaxBit = serverModulusBit/8;

var serverRealBit = serverMaxBit - 11;
var padding = ursa.RSA_PKCS1_PADDING;

function bytes(text, coding) {
    if (typeof text === 'undefined') {
        throw new Error("must have a arg.");
    }

    coding = coding || 'utf8';
    return Buffer.byteLength(text.toString(), coding);
}

function encrypt(plain, publicKey, realBit, padding){
    var start1 = 0;
    var end1   = realBit;
    var result1 = '';
    var originBuff = new Buffer(plain);
    var originByte = bytes(plain, 'utf8');
    while(start1 < originByte){
        var originTmp  = originBuff.slice(start1, end1);
        result1 += publicKey.encrypt(originTmp, 'binary', 'binary', padding);
        start1 += realBit;
        end1 += realBit;
    }

    var encrypted =  encoding.convert(result1, 'binary', 'base64');

    return encrypted.toString();
}

function decrypt(cipher, privateKey, maxBit, padding){
    var start2 = 0;
    var end2   = maxBit;
    var result2 = '';
    var cipherBuff = encoding.convert(cipher, 'base64', 'binary');
    var cipherByte = bytes(cipher, 'base64');
    while(start2 < cipherByte){
        var cipherTmp  = cipherBuff.slice(start2, end2);
        result2 += privateKey.decrypt(cipherTmp, 'binary', 'binary', padding);
        start2 += maxBit;
        end2 += maxBit;
    }

    var decrypted =  encoding.convert(result2, 'binary', 'utf8');
    return decrypted.toString();
}

function serverEncrypt(plain){
    plain = plain || "";
    return encrypt(plain, serverPublic, serverRealBit, padding);
};

function serverDecrypt(cipher){
    cipher = cipher || "";
    return decrypt(cipher, serverPrivate, serverMaxBit, padding);
};

var test="ababasd"

let test1= serverEncrypt(test)
console.log(test1)
console.log(serverDecrypt(test1))

function checkuuid(uuid){

}




