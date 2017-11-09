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

router.get('/register', function(req, res, next) {
  var parm = req.query.r;
  var decipher = JSON.parse(scrambler.decipherText(parm));
  if (moment().isAfter(moment(decipher.expires))) {
    res.send('The link has expired.');
    return;
  }
  var viewModel = {};
  db.memberModel.findMember(decipher.userId, function(err, member) {
    db.inviteModel.findInvite(decipher.inviteId, function(err, invite) {
      viewModel.name = invite._doc.guestName.split(' ')[0];
      viewModel.lastName = invite._doc.guestName.split(' ')[1];
      viewModel.email = invite._doc.guestEmail
      res.render('register', {
        viewModel
      });
    });
  });
});
module.exports = router;
