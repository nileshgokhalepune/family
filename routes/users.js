var express = require('express');
var router = express.Router();
var db = require('../libraries/memberdb');
var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../libraries/config');
var scrambler = require('../libraries/mycrypto');
var moment = require('moment');
var path = require('path');

var sendmail = require('sendmail')({
  silent: true
});

var transport = mailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'someemail@gmail.com',
    password: 'xxxxxxx'
  }
}));
var token;

router.use(function timelog(req, res, next) {
  token = scrambler.getTokenObject(req);
  console.log('Time: ' + Date.now());
  next();
});

router.get('/hash', function (req, res, next) {
  var ipAddress = db.helper.getClientIP(req);
  console.log(`Request IP ${ipAddress}`);
  var cipherText = scrambler.cipherText(ipAddress);
  console.log(cipherText);
  res.json(cipherText);
});

router.post('/ticket', function (req, res) {
  var ipAddress = db.helper.getClientIP(req);
  var encrypted = scrambler.cipherText(ipAddress);
  console.log(encrypted);
  db.memberModel.auth(req.body.userName, req.body.password)
    .then(data => {
      var hashed = scrambler.hashpassword(req.body.password, data.salt);
      console.log(`Member Found - ${hashed}`);
      if (hashed === data.password) {
        var cipherJson = {
          memberId: data._doc._id,
          memberName: data._doc.username,
          date: Date.now(),
          ip: ipAddress,
          memberEmail: data._doc.email
        };
        var ticket = scrambler.cipherText(JSON.stringify(cipherJson));
        console.log(`Ticket created ${ticket}`);
        res.json({
          encrypted: ticket,
          user: {
            name: data.name,
            lastLoggedIn: moment()
          }
        });
        res.send();
      }
    }).catch(err => {
      if (err.code === 500) {
        res.statusCode = 404;
        res.json({
          message: "Invalid username or password"
        });
      } else if (err.code === 404) {
        res.statusCode = 404;
        res.json({
          message: "Not found"
        });
      }
      res.send();
    });
});

/**Gets current user data */
router.get('/data', function (req, res, next) {
  db.memberModel.findMember(token.memberId)
    .then(data => {
      res.json({
        member: data._doc,
        name: data._doc.name
      })
    }).catch(err => {
      res.json({
        message: "Not able to find member"
      });
    });
})

/** Sends an invite to a specified person */
router.post('/invite', function (req, res, next) {
  var guest = req.body.guest;
  if (!guest.memberrelation || !guest.memberName || !guest.memberEmail) {
    res.statusCode = 500;
    res.statusMessage = "Invalid request";
    res.end();
    return;
  }
  var userId = token.memberId;
  guest.userId = userId;
  //Get the current user.
  db.memberModel.findMember(userId)
    .then(member => {
      //find the invitiation
      db.inviteModel.findInvites(userId, function (err, result) {
        //if an invite already exists 
        if (result) {
          var inviteExists = result.filter(doc => {
            return doc._doc.guestRelation === guest.memberrelation;
          });
          if (inviteExists.length > 0) {
            res.statusCode = 500;
            res.statusMessage = `You have already sent an invite to your ${guest.memberrelation}. You can see that in the invite list in your profile`;
            res.send();
            return;
          }
        }
        //If this is new invitation save it
        db.inviteModel.save(guest, function (err, data) {
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
            //Send an email to he invitee.
            sendmail({
              from: 'nileshgokhale45@gmail.com',
              to: guest.memberEmail,
              subject: `Invitation from a family member ${member.name} ${member.lastName}`,
              html: `<p>Hello ${guest.memberName},</p>
                    <p>${member.name} ${member.lastName} claims that you are his ${guest.memberrelation}. He is inviting you to join him as a family member on Family.
                    You can accept this invitation by clicking on the following link</p>
                    <a href="${url}">Accept</a>
              `
            }, function (error, reply) {
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
      });
    });
});

//Creates a new user
router.post('/create', function (req, res, next) {
  if (req.body) {
    var data = req.body.user;
    var salt = scrambler.createSalt();
    var password = scrambler.hashpassword(data.password, salt);
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

    db.memberModel.save(user, function (err, doc) {
      if (err)
        throw err;
      res.json(doc);
    });
  }
});

//Relates two members.
router.post('/relate', function (req, res, next) {
  var originalUserId = req.body.userId;
  var newUserId = req.body.newUserId;
  var relation = req.body.relation;
  //Find the user who invited
  db.memberModel.findMember(originalUserId).then(original => {
    //find the new user who was invited and created an account.
    db.memberModel.findMember(newUserId).then(newuser => {
      //lookup for relations based on the relation and gender.
      db.relationLookup.lookup(relation, original.gender, function (err, found) {
        if (err) {
          res.statusCode = 404;
          res.statusMessage = "Relation not found";
          res.send();
          return;
        }
        //check if the relative already exists in the original users relatives
        var relativeExists = original.family.find((record) => record.userId === newuser._id.toString());
        if (!relativeExists) {
          var relative = {
            userId: newUserId,
            relation: relation,
            name: newuser._doc.name + " " + newuser._doc.lastName,
            type: db.helper.findType(relation)
          };
          original.family.push(relative);
        }
        //check if relative already exists in the new users relative list.
        relativeExists = newuser.family.find((record) => record.userId === original._id.toString());
        if (!relativeExists) {
          relative = {
            userId: original._id,
            relation: found,
            name: original._doc.name,
            type: db.helper.findType(found)
          }
          newuser.family.push(relative);
          newuser.save();
          original.save();
          res.statusCode = 200;
          res.statusMessage = "Relation added";
          res.send();
        }
      });
    }).catch(err => {
      throw "The new member was not found";
    })
  }).catch(err => {
    res.status = 404;
    res.statusMessage = "User who invited was not found";
    res.send();
  })
});
// check if the token is active or not.
router.get('/valid', function (req, res, next) {
  res.statusCode = 200;
  if (token.date) {
    res.json({
      message: 'Active',
      valid: true
    });
    return;
  }
  res.json({
    message: 'Inactive',
    valid: false
  });
});

//Gets the avatar saved for a member
router.get('/avatar/:payload', function (req, res, next) {
  if (req.params.payload) {
    var authHeader = req.params.payload;
    res.statusCode = 200;
    if (authHeader && authHeader !== undefined && authHeader !== 'undefined') {
      var obj = JSON.parse(scrambler.decipherText(authHeader));
      if (obj) {
        var id = obj.memberId
        db.memberModel.find({
          _id: id
        }, {
            imgSource: 1
          }, function (err, data) {
            if (err || !data || data.length === 0 || !data[0].imageSource) {
              res.sendFile(path.join(__dirname, '../', 'public/images/missing.gif'));
            } else {
            }
          });
      }
    }
  }
});

//Find a relation .
router.get('/relation/find', function (req, res, next) {
  if (!req.params.relation) {
    res.statusCode = 500;
    res.statusMessage = "Relation not specified";
    res.send();
    return;
  } else {

  }
});

router.get('/find/:name', function (req, res, next) {
  if (!req.params.name) {
    res.send({});
    return;
  } else {
    db.memberModel.findByName(req.params.name).then(data => {
      res.json(data);
    }).catch(err => {
      if (err && err === "Not found") {
        res.statusCode = 404;
        res.send();
        return;
      }
      res.statusCode = 500;
      res.statusMessage = "An error occurred";
      res.send();
      return;
    });
  }
});

router.get('/connections', function (req, res, next) {
  if (token.memberId) {
    var returnList = [];
    db.memberModel.findMember(token.memberId)
      .then(data => {
        IterateOver(data.family, function (mem, report) {
          db.memberModel.findMember(mem.userId).then(data1 => {
            IterateOver(data1.family, function (mem1, report) {
              db.memberModel.findMember(mem1.userId).then(data2 => {
                if (data2.id !== token.memberId)
                  returnList.push(data2);
                report();
              }).catch(err => {
                //do nothing
              })
            }, function () {
              res.json(returnList);
              return;
            });
            report();
          }).catch(err => {
            //do nothing
          });
        }, function () {
          //do nothing here
        });
      }).catch(err => {
        res.status = 500;
        res.json("There was a problem fetching the member");
      });
  }
});

function sendResponse() {

}

module.exports = router;

function getCounterRelation(relation, targetGender) {
  return;
}

function IterateOver(list, iterator, callback) {
  var doneCount = 0;

  function report() {
    doneCount++;
    if (doneCount === list.length)
      callback();
  }

  for (var i = 0; i < list.length; i++) {
    iterator(list[i], report);
  }
}
