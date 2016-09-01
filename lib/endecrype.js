var ursa = require('ursa')
var fs = require('fs')
var encoding = require('encoding');

var path = ""

var server_public=fs.readFileSync(path+'public.pub').toString()

var server_private=fs.readFileSync(path+'private.pem').toString()

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

exports.serverEncrypt=function(plain){
    plain = plain || "";
    return encrypt(plain, serverPublic, serverRealBit, padding);
};

exports.serverDecrypt=function(cipher){
    cipher = cipher || "";
    return decrypt(cipher, serverPrivate, serverMaxBit, padding);
};




