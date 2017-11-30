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
  type: String,
  gender: String,
  imageSource: String
});

var memberModel = mongoose.model('member', memberSchema, 'member');

memberModel.auth = function(username, password, callback) {
  var user = memberModel.findOne({
    userName: username
  }, {
    password: 1,
    salt: 1,
    name: 1
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
      var member = doc.toObject();
      delete member.password;
      delete member.salt;
      callback(null, member);
    });
  } else {
    callback('User information cannot be empty', null);
  }
}

memberModel.addFamilyMember = function(user, familyMember, callback) {
  if (user && familyMember) {

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

inviteModel.deactivateInvite = function(inviteId, callback) {
  inviteModel.find({
    _id: inviteId
  }, fu)
}

module.exports.inviteModel = inviteModel;

var relationLookupSchema = new mongoose.Schema({
  from: String,
  to: String
});

var relationLookupModel = mongoose.model('relationmap', relationLookupSchema, 'relationmap');

relationLookupModel.lookup = function(relation, callback) {
  relationLookupModel.find({
    from: relation
  }, {
    to: 1,
    from: -1
  }, (err, res) => {
    if (err) {
      console.log("Relation not found");
      callback('Not found', null);
    }
    if (!res || res.length <= 0) {
      relationLookupModel.find({
        to: relation
      }, {
        from: 1,
        to: -1
      }, (err1, res1) => {
        if (err1) {
          callback('Not found', null);
          return;
        }
        if (!res1 || res1.length <= 0) {
          callback('Not found', null);
          return;
        } else {
          callback(null, res1[0].from);
          return;
        }
      });
    } else {
      callback(null, res[0].to);
    }
  });
}

module.exports.relationLookup = relationLookupModel;

var helper = {};
helper.peers = ["Wife", "Husband", "Brother", "Sister", "Friend"];
helper.children = ["Son", "Daughter", "StepSon", "StepDaughter"];
helper.parents = ["Father", "Mother","Uncle","Aunt"];

helper.findType = function(relation) {
  if (this.peers.find((p) => p === relation)) {
    return "peer";
  } else if (this.children.find((p) => p === relation)) {
    return "child";
  } else if (this.parents.find((p) => p === relation)) {
    return "parent";
  }
}

helper.findGender = function(relation) {
  var male = ["Husband", "Brother", "Nephew", "Father", "Son","Uncle"];
  var female = ["Wife", "Sister", "Neice", "Mother", "Daughter","Aunt"];
  if (male.find((g) => g === relation))
    return "Male";
  if (female.find((g) => g === relation))
    return "Female";
  return "Unspecified";
}

helper.getClientIP = function(request) {
  var ipAddr;
  var iplist = request.headers["x-forwarded-for"];
  if (iplist) {
    var list = iplist.split(",");
    ipAddr = list[list.length - 1];
  } else {
    ipAddr = request.connection.remoteAddress;
  }

  return ipAddr;
}

module.exports.helper = helper;