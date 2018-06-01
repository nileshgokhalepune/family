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
  imageSource: String,
  email: String
});

var memberModel = mongoose.model('member', memberSchema, 'member');

memberModel.auth = function (username, password) {
  return new Promise((resolve, reject) => {
    var user = memberModel.findOne({
      userName: username
    }, {
        password: 1,
        salt: 1,
        name: 1
      }, function (err, member) {
        if (err) {
          reject({
            code: 500,
            message: "Server Error"
          });
          console.bind(console, 'Error while trying to retrieve user!');
        } else if (!member) {
          reject({
            code: 404,
            message: "Not found"
          });
        } else {
          resolve(member);
        }
      });
  })

}

memberModel.findMember = function (objectId) {
  return new Promise((resolve, reject) => {
    var user = memberModel.findOne({
      _id: objectId
    }, {
        "password": 0,
        "salt": 0,
      }, function (err, member) {
        if (err) reject(err);
        resolve(member);
      });
  });
};

memberModel.findByMemberName = (userId, invite, relation) => {
  return new Promise((resolve, reject) => {
    memberModel.findOne({ _id: userId, firstName }, { _id: 1, family: 1 }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (result) {
        for (var i = 0; i < result.family.length; i++) {
          if (result.family[i]) {
            var found = memberModel.findOne({ _id: result.family[i].userId }).exec().then(found => {
              resolve(found);
            });
          }
        }
        reject("Not found");
      }
    });
  });
}

memberModel.findByName = function (name) {
  var input = name;
  return new Promise((resolve, reject) => {
    var name = input.split(' ');
    var firstName = name.length > 0 ? name[0] : '';
    var lastName = name.length > 1 ? name[1] : '';
    if (!(firstName + lastName)) reject('Not found');
    memberModel.findOne({ name: firstName, lastName: lastName }, { password: 0, salt: 0 }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result) {
          resolve(result);
        } else {
          reject('Not found');
        }
      }
    });
  });
}

memberModel.save = function (user, callback) {
  if (user) {
    user.save(function (err, doc) {
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


memberModel.addFamilyMember = function (user, familyMember, callback) {
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

inviteModel.save = function (data, callback) {
  var objectId = new mongoose.Types.ObjectId();
  var guest = new inviteModel({
    _id: objectId,
    guestName: data.memberName,
    guestEmail: data.memberEmail,
    guestRelation: data.memberrelation,
    userId: data.userId
  });
  guest.save(function (err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    console.log('Saved');
    callback(err, data);
  });
}

inviteModel.findInvites = function (userid, callback) {
  inviteModel.find({
    userId: userid
  }, function (err, invite) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, invite);
    }
  });
}
inviteModel.findInvite = function (inviteId, callback) {
  inviteModel.find({
    _id: inviteId
  }, function (err, invite) {
    if (err) {
      callback(err, null);
    } else if (invite.length > 1) {
      callback("Multiple invitations found", null);
    } else {
      callback(null, invite[0]);
    }
  });
}

inviteModel.deactivateInvite = function (inviteId, callback) {
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

relationLookupModel.lookup = function (relation, sourcegender, callback) {
  relationLookupModel.aggregate([{ $project: { maps: { $filter: { input: '$maps', as: 'map', cond: { $eq: ["$$map.from", "Daughter"] } } } } }],
    function (err, res) {
      if (err) {
        console.log("Relation not found");
        callback('Not Found', null);
      }
      if (!res || res.length <= 0 || res[0].maps.length <= 0) {
        relationLookupModel.aggregate([{ $project: { maps: { $filter: { input: '$maps', as: 'map', cond: { $eq: ["$$map.to", "Daughter"] } } } } }],
          (err1, res1) => {
            if (err1) {
              callback('Not found', null);
              return;
            }
            if (!res1 || res1.length <= 0 || res1[0].maps.length <= 0) {
              callback('Not found', null);
              return;
            } else {
              var relation;
              var relations = helper.getRelationFromGender(sourcegender);
              for (var i = 0; i < relations.length; i++) {
                for (var j = 0; j < res1[0].maps.length; j++) {
                  if (res1[0].maps[j].from === relations[i]) {
                    relation = relations[i];
                    break;
                  }
                }
              }
              callback(null, relation);
            }
          });
      } else {
        var relations = helper
      }
    });
}

module.exports.relationLookup = relationLookupModel;

var helper = {};
helper.peers = ["Wife", "Husband", "Brother", "Sister", "Friend"];
helper.children = ["Son", "Daughter", "StepSon", "StepDaughter"];
helper.parents = ["Father", "Mother", "Uncle", "Aunt"];

helper.findType = function (relation) {
  if (this.peers.find((p) => p === relation)) {
    return "peer";
  } else if (this.children.find((p) => p === relation)) {
    return "child";
  } else if (this.parents.find((p) => p === relation)) {
    return "parent";
  }
}

helper.findGender = function (relation) {
  var male = ["Husband", "Brother", "Nephew", "Father", "Son", "Uncle"];
  var female = ["Wife", "Sister", "Neice", "Mother", "Daughter", "Aunt"];
  if (male.find((g) => g === relation))
    return "Male";
  if (female.find((g) => g === relation))
    return "Female";
  return "Unspecified";
}

helper.getRelationFromGender = function (gender) {
  var male = ["Husband", "Brother", "Nephew", "Father", "Son", "Uncle"];
  var female = ["Wife", "Sister", "Neice", "Mother", "Daughter", "Aunt"];

  return gender === 'Male' ? male : gender === "Female" ? female : [];
}

helper.opposites = function (towhat) {
  var male = ["Husband", "Brother", "Nephew", "Father", "Son", "Uncle"];
  var female = ["Wife", "Sister", "Neice", "Mother", "Daughter", "Aunt"];
  var ml;
  var fm;
  for (var i = 0; i < male.length; i++) {
    if (male[i] === towhat) {
      ml = female[i];
      break;
    }
  }
  for (var i = 0; i < female.length; i++) {
    if (female[i] === towhat) {
      ml = male[i]
      break;
    }
  }
  //female.forEach(m => m === towhat);
  return ml;// ml ? ml : fm;
}

helper.getClientIP = function (request) {
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