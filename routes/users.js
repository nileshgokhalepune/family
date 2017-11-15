var express = require('express');
var router = express.Router();
var db = require('../libraries/memberdb');
var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../libraries/config');
var scrambler = require('../libraries/mycrypto');
var moment = require('moment');

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

router.use(function timelog(req, res, next) {
  console.log('Time: ' + Date.now());
  next();
});

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
  res.json(scrambler.cipherText(req.ip));
});

router.post('/ticket', function(req, res) {
  var encrypted = scrambler.cipherText(req.ip);
  db.memberModel.auth(req.body.userName, req.body.password, function(err, member) {
    if (err) {
      res.statusCode = 404;
      res.statusMessage = "Invalid username or password";
      res.send();
    } else {
      var hashed = scrambler.hashpassword(req.body.password, member.salt);
      if (hashed === member.password) {
        var cipherJson = {
          memberId: member._doc._id,
          memberName: member._doc.username,
          date: Date.now(),
          ip: req.ip,
          memberEmail: member._doc.email
        };
        var ticket = scrambler.cipherText(JSON.stringify(cipherJson));
        res.json({
          encrypted: ticket,
          user: member
        });
      } else {
        res.status = 401;
        res.statusMessage = "Invalid username or password";
        res.send();
      }
    }
  });
});

router.get('/data', function(req, res, next) {
  var deciphered = scrambler.decipherText(req.headers.authorization.split(' ')[1]);
  var decipheredJson = JSON.parse(deciphered);
  db.memberModel.findMember(decipheredJson.memberId, function(err, member) {
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
  if (req.headers.authorization)
    var authHeader = req.headers.authorization.split(' ')[1];
  res.statusCode = 200;
  if (authHeader && authHeader !== undefined && authHeader !== 'undefined') {
    var obj = JSON.parse(scrambler.decipherText(authHeader));
    if (obj.date) {
      res.json({
        message: 'Active',
        valid: true
      });
      return;
    }
  }
  res.json({
    message: 'Inactive',
    valid: false
  });
});

router.post('/invite', function(req, res, next) {
  var store = req.headers.authorization.split(' ')[1];
  var guest = req.body.guest;
  var deciphered = scrambler.decipherText(store);
  var decipheredJson = JSON.parse(deciphered);
  var userId = decipheredJson.memberId;
  guest.userId = userId;
  db.memberModel.findMember(userId, function(err, member) {
    db.inviteModel.findInvites(userId, function(err, result) {
      if (result) {
        var inviteExists = result.filter(doc => {
          return doc._doc.guestRelation === guest.memberrelation
        });
        if (inviteExists.length > 0) {
          res.statusCode = 500;
          res.statusMessage = "You have already sent an invite to your wife. You can see that in the invite list in your profile";
          res.send();
          return;
        }
      }
      db.inviteModel.save(guest, function(err, data) {
        if (err) {
          res.statusCode = 500;
          res.statusMessage = "Unable to send invite at this time";
          res.send();
          return;
        }
        if (data) {
          var url = scrambler.generateUrl(req, {
            userId: userId,
            inviteId: data._doc._id,
            expires: moment().add(10, 'd')
          });
          sendmail({
            from: 'nileshgokhale45@gmail.com',
            to: guest.memberEmail,
            subject: `Invitation from a family member ${member.name} ${member.lastName}`,
            html: `<p>Hello ${guest.memberName},</p>
                    <p>${member.name} ${member.lastName} claims that you are his ${guest.memberrelation}. He is inviting you to join him as a family member on Family.
                    You can accept this invitation by clicking on the following link</p>
                    <a href="${url}">Accept</a>
              `
          }, function(error, reply) {
            console.log(error && error.stack);
            console.dir(reply);
            res.statusCode = 200;
            res.json({
              message: `Successfully invited ${guest.guestName} to be part of your family!!!`
            })
          });
        } else {
          res.status = 500;
          res.statusMessage = "Unable to send invitation at this time.";
          res.send();
        }
      });
    })
  });
});

router.post('/create', function(req, res, next) {
  if (req.body) {
    var data = req.body;
    var salt = scrambler.createSalt(); //cipherText(data.userName + '');
    var password = scrambler.hashpassword(data.password, salt); //cipherText(data.password + salt);
    var user = new db.memberModel({
      userName: data.userName,
      password: password,
      name: data.name,
      lastName: data.lastName,
      dateOfBirth: data.dateofBirth,
      type: 'self',
      salt: salt,
      gender: db.helper.findGender(data.relation)
    });

    db.memberModel.save(user, function(err, doc) {
      if (err)
        throw err;
      res.json(doc);
    });
  }
});

router.post('/relate', function(req, res, next) {
  var originalUserId = req.body.userId;
  var newUserId = req.body.newUserId;
  var relation = req.body.relation;
  db.memberModel.findMember(originalUserId, function(err, member) {
    if (err || !member) {
      res.statusCode = 404;
      res.statusMessage = "User who invited was not found";
      res.send();
      return;
    } else {
      db.memberModel.findMember(newUserId, function(err, other) {
        if (err || !other) {
          res.statusCode = 404;
          res.statusMessage = "The new member was not found";
          res.send();
          return;
        } else {
          db.relationLookup.lookup(relation, function(err, found) {
            if (err) {
              res.statusCode = 404;
              res.statusMessage = "Relation not found";
              res.send();
              return;
            }
            var relativeExists = member.family.find((record) => record.userId === other._id.toString());
            if (!relativeExists) {
              var relative = {
                userId: newUserId,
                relation: relation,
                name: other._doc.name,
                type: db.helper.findType(relation)
              };
              member.family.push(relative);
            }
            relativeExists = other.family.find((record) => record.userId === member._id.toString());
            if (!relativeExists) {
              relative = {
                userId: member._id,
                relation: found,
                name: member._doc.name,
                type: db.helper.findType(found)
              }
              other.family.push(relative);
              other.save();
              member.save();
              res.statusCode =200;
              res.statusMessage = "Relation added";
              res.send();
            }
          });
        }
      });
    }
  });
});

module.exports = router;


function getCounterRelation(relation, targetGender) {
  return;
}