var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../libraries/memberdb');
var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var sendmail = require('sendmail')({
  silent: true
});

var transport = mailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'nileshgokhale45@gmail.com',
    password: '8:F%,(+g'
  }
}));

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
      var cipherJson = {
        memberId: member._doc._id,
        memberName: member._doc.username,
        date: Date.now(),
        ip: req.ip,
        memberEmail: member._doc.email
      };
      var ticket = cipherText(JSON.stringify(cipherJson));
      res.json({
        encrypted: ticket,
        user: member
      });
    }
  });
});

router.get('/data', function(req, res, next) {
  var deciphered = decipherText(req.headers.authorization.split(' ')[1]);
  var decipheredJson = JSON.parse(deciphered);
  db.findMember(decipheredJson.memberId, function(err, member) {
    if (err) {
      res.json({
        message: "Not able to find member"
      });
    }
    if (member) {
      res.json({
        member: member._doc
      });
    }
  });
})

router.get('/valid', function(req, res, next) {
  res.json({
    valid: true
  });
});

router.post('/invite', function(req, res, next) {
  var store = req.headers.authorization.split(' ')[1];
  var guest = req.body.guest;
  var deciphered = decipherText(store);
  var decipheredJson = JSON.parse(deciphered);
  var userId = decipheredJson.memberId;

  var mailOptions = {
    from: 'nileshgokhale45@gmail.com',
    to: guest.guestEmail,
    subject: 'Invitation from a family member ' + decipheredJson.memberName,
    text: `Hello ${guest.memberName}
              ${decipheredJson.memberName} from claims you to be his ${guest.memberrelation}. He is inviting you to join him as a family member on Family.
              You can accept this invitation by clicking on the following link
    `
  };
  sendmail({
    from: 'nileshgokhale45@gmail.com',
    to: guest.memberEmail,
    subject: 'Invitation from a family member ' + decipheredJson.memberName,
    html: `<p>Hello ${guest.memberName},</p>
              <p>${decipheredJson.memberName} claims that you are his ${guest.memberrelation}. He is inviting you to join him as a family member on Family.
              You can accept this invitation by clicking on the following link</p>
        `
  }, function(error, reply) {
    console.log(error && error.stack);
    console.dir(reply);
    res.statusCode = 200;
    res.json({
      message: `Successfully invited ${guest.guestName} to be part of your family!!!`
    })
  })
// transport.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     res.statusCode = 500;
//     res.json({
//       message: 'Failed to send invitation'
//     });
//     return;
//   }
//   res.statusCode = 200;
//   res.json({
//     message: `Successfully invited ${guest.guestName} to be part of your family!!!`
//   })
// });
});

function decipherText(text) {
  try {
    var decipher = crypto.createDecipher('aes192', 'mypassword');
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function cipherText(text) {
  var cipher = crypto.createCipher('aes192', 'mypassword');
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

module.exports = router;
