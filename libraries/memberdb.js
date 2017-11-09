var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  lastName: String,
  dateOfBirth: Date,
  password: String,
  salt: String,
  locations: Array,
  family: Array,
  type: String
});

var memberModel = mongoose.model('member', memberSchema, 'member');

memberModel.auth = function(username, password, callback) {
  var user = memberModel.findOne({
    userName: username
  }, {
    password: 1,
    salt: 1
  }, function(err, member) {
    if (err) {
      callback(err, null);
      console.bind(console, 'Error while trying to retrieve user!');
      throw err;
    } else if (!member) {
      callback("Not found", null);
    } else {
      callback(null, member);
    }
  });
}

memberModel.findMember = function(objectId, callback) {
  var user = memberModel.findOne({
    _id: objectId
  }, {
    "password": 0
  }, function(err, member) {
    callback(err, member);
  });
};

memberModel.save = function(user, callback) {
  if (user) {
    user.save(function(err, doc) {
      if (err) callback(err, null);
      callback(null, doc);
    });
  } else {
    callback('User information cannot be empty', null);
  }
}

module.exports.memberModel = memberModel;

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
var inviteSchema = new mongoose.Schema({
  userId: ObjectId,
  guestName: String,
  guestEmail: String,
  guestRelation: String
});

var inviteModel = mongoose.model('invite', inviteSchema, 'invite');

inviteModel.save = function(data, callback) {
  var objectId = new mongoose.Types.ObjectId();
  var guest = new inviteModel({
    _id: objectId,
    guestName: data.memberName,
    guestEmail: data.memberEmail,
    guestRelation: data.memberrelation,
    userId: data.userId
  });
  guest.save(function(err, data) {
    if (err) {
      console.log(err) ;
      callback(err, null);
    }
    console.log('Saved');
    callback(err, data);
  });
}

inviteModel.findInvites = function(userid, callback) {
  inviteModel.find({
    userId: userid
  }, function(err, invite) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, invite);
    }
  });
}
inviteModel.findInvite = function(inviteId, callback) {
  inviteModel.find({
    _id: inviteId
  }, function(err, invite) {
    if (err) {
      callback(err, null);
    } else if (invite.length > 1) {
      callback("Multiple invitations found", null);
    } else {
      callback(null, invite[0]);
    }
  });
}

module.exports.inviteModel = inviteModel;