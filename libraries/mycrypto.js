var crypto = require('crypto');

const Scrambler = {

};

Scrambler.decipherText = function(text) {
  try {
    var decipher = crypto.createDecipher('aes192', 'mypassword');
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
  } catch (err) {
    console.log(err);
    throw err;
  }
}

Scrambler.cipherText = function(text) {
  var cipher = crypto.createCipher('aes192', 'mypassword');
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

Scrambler.createSalt = function() {
  var random = crypto.randomBytes(256);
  var hash = crypto.createHash('sha256', 'secret');
  hash.update(random);
  return hash.digest('hex');
}

Scrambler.hashpassword = function(password, salt) {
  var hash = crypto.createHash('sha512', 'secret');
  hash.update(password + salt);
  return hash.digest('hex');
}

Scrambler.generateUrl = function(req, obj) {
  var host = req.body.source;
  var ciphered = this.cipherText(JSON.stringify(obj));
  var proto = req.headers['x-forwarded-proto'];
  console.log(proto);
  console.log(req.protocol);
  console.log(proto + "://" + host + "/register/" + ciphered);
  return proto + "://" + host + "/register/" + ciphered;
}

Scrambler.getTokenObject = function(req) {
  if (!req.headers.authorization) return;
  var store = req.headers.authorization.split(' ')[1];
  if (!store || store === undefined || store === null || store === "null") return;
  var deciphered = this.decipherText(store);
  var decipheredJson = JSON.parse(deciphered);
  return decipheredJson;
}

module.exports = Scrambler;
