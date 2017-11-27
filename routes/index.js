var express = require('express');
var router = express.Router();
var db = require('../libraries/memberdb');
var scrambler = require('../libraries/mycrypto');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/registerd', function(req, res, next) {
  var parm = req.query.r;
  var decipher = JSON.parse(scrambler.decipherText(parm));
  if (moment().isAfter(moment(decipher.expires))) {
    res.send('The link has expired.');
    return;
  }
  var viewModel = {};
  db.memberModel.findMember(decipher.userId, function(err, member) {
    db.inviteModel.findInvite(decipher.inviteId, function(err, invite) {
      if (invite && invite._doc) {
        viewModel.name = invite.guestName.split(' ')[0];
        viewModel.lastName = invite.guestName.split(' ')[1];
        viewModel.email = invite.guestEmail;
        viewModel.userId = decipher.userId;
        viewModel.relation = invite.guestRelation;
        viewModel.type = db.helper.findType(invite.guestRelation);
        res.json(viewModel);
      } else {
        res.statusCode = 500;
        res.statusMessage = "Something is not correct";
        res.end();
      }
    });
  });
});
module.exports = router;
