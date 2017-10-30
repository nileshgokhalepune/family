var express = require('express');
var router = express.Router();
var crypto = require('crypto');

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
  var cipher = crypto.createCipher('aes192', req.ip);
  let encrypted = '';
  cipher.on('readable', () => {
    const data = cipher.read();
    if (data)
      encrypted += data.toString('hex');
  });

  cipher.on('end', () => {
    console.log(encrypted);
  });
  cipher.write(req.ip);
  cipher.end();
  res.json(encrypted);
});

module.exports = router;
