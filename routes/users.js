var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../libraries/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{
    name: 'N',
    relation: 'Self',
    type: 'self',
    id: '1',
    family: [{
      name: 'S',
      relation: 'Father',
      type: 'parent',
      id: '2'
    }, {
      name: 'J',
      relation: 'Mother',
      type: 'parent',
      id: '3'
    }, {
      name: 'P',
      relation: 'Wife',
      type: 'peer',
      id: '4'
    }, {
      name: 'E',
      relation: 'Daughter',
      type: 'child',
      id: '5'
    }, {
      name: 'R',
      relation: 'Son',
      type: 'child',
      id: '6'
    }, {
      name: 'S',
      relation: 'Sister',
      type: 'peer',
      id: '7'
    }, {
      name: 'D',
      relation: 'Nephew',
      type: 'child',
      id: '8'
    }, {
      name: 'V',
      relation: 'Aunt',
      type: 'parent',
      id: '9'
    }]
  }]);
});

router.get('/hash', function(req, res, next) {
  res.json(cipherText(req.ip));
});

router.post('/ticket', function(req, res) {
  var encrypted = cipherText(req.ip);
  db.auth(req.body.userName, req.body.password, function(err, member) {
    if (err) {
      res.status(404);
      res.send();
    } else {
      var ticket = cipherText(member.userName + Date.now() + req.ip);
      res.json({
        encrypted: ticket,
        user: member
      });
    }
  });
});

router.get('/data', function(req, res, next) {
  var deciphered = decipherText(req.query.parm);
})

router.get('/valid', function(req, res, next) {

  res.json({
    valid: true
  });
})

function decipherText(cipher) {
  let decrypted = '';
  var decipher = crypto.createDecipher('aes192', cipher);
  decipher.on('readable', () => {
    const data = decipher.read();
    if (data)
      decrypted += data.toString('utf8');
  });
  decipher.on('end', () => {
    console.log(decrypted);
  });
  decipher.write(cipher, 'hex');
  decipher.end();
  return decrypted;
}

function cipherText(text) {
  var cipher = crypto.createCipher('aes192', text);
  let encrypted = '';
  cipher.on('readable', () => {
    const data = cipher.read();
    if (data)
      encrypted += data.toString('hex');
  });

  cipher.on('end', () => {
    console.log(encrypted);
  });
  cipher.write(text);
  cipher.end();
  return encrypted;
}

module.exports = router;
