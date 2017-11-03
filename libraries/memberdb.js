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
  family: Array
});

var memberModel = mongoose.model('member', memberSchema, 'member');

memberModel.auth = function(username, password, callback) {
  var user = memberModel.findOne({
    username: username
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

module.exports = memberModel;
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
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestRelation: data.relation,
    userId: data.userId
  });
  guest.save(function(err, data) {
    if (err) console.log(err)  ;
    console.log('Saved');
    callback(true);
  });

}