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
      callback(null,member);
    }
  });
}

module.exports = memberModel;