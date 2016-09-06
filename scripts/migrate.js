var uuid = require('uuid');
var crypto = require('crypto');
var moment = require('moment');
var CryptoJS = require("crypto-js");
var thekey = 'bj0uSrR1WZtxIZ6thpMX';
var url = process.env.COUCH_URL;
var cloudant = require('cloudant')(url);
var advocateddb = cloudant.db.use('advocated');
var advocateddb2 = cloudant.db.use('advocated2');
var envoyusersdb = cloudant.db.use('envoyusers');
var docs = [];
var users = [];
var olduserslookup = {};

// returns the sha1 of a string
var sha1 = function(string) {
  return crypto.createHash('sha1').update(string).digest('hex');
};

var encrypt = function(str, key) {
  return CryptoJS.AES.encrypt(str, key).toString();
};

var convertUser = function (u) {
  var u2 = { };
  var password = uuid.v4();
  u2._id  = u.identifiers.slack.user_id;
  u2.type = 'user';
  u2.name = u2._id;
  u2.roles = [];
  u2.username = u2._id;
  u2.password_scheme = 'simple';
  u2.salt = uuid.v4();
  u2.password = sha1(u2.salt + password);
  u2.seq = null;
  u2.meta = {
    user_name: u.identifiers.slack.user_name,
    team_id: u.identifiers.slack.team_id,
    team_name: u.identifiers.slack.team_domain,
    password: encrypt(password, thekey)
  };
  return u2;
}

var convertDoc = function(doc, u) {
  delete doc._rev;
  doc.userid = u.username;
  doc.userDisplayName = u.meta.user_name;
  doc.userDomain = u.meta.team_name;
  doc.teamid = u.meta.team_id;
  var m = moment(doc.dtstart);
  doc.ts = m.valueOf();
  doc._id = sha1(doc.userid) + '-' + doc._id;
  return doc;
}




var olduser = {
  "_id": "6058f7b10129c964180b9fa053c40113",
  "_rev": "1-bd886bc519792c5e7b1db2e0e77529af",
  "collection": "user",
  "display_name": "bradley.holt",
  "identifiers": {
    "slack": {
      "token": "XuATzFjXCTa0BS6DuO2sbm0U",
      "team_id": "T03DL6QDC",
      "team_domain": "clouddataservices",
      "channel_id": "D041U6H8Z",
      "channel_name": "directmessage",
      "user_id": "U03DLCXPC",
      "user_name": "bradley.holt",
      "command": "/advocated",
      "text": "",
      "response_url": "https://hooks.slack.com/commands/T03DL6QDC/18208634324/e8mPpy4qSirYPmMQIDt0DDzn"
    }
  }
};

var newuser = {
  "_id": "U0J8WQW9G",
  "_rev": "5-52fdd374e92b1e8d06f032731b7fc01d",
  "type": "user",
  "name": "U0J8WQW9G",
  "roles": [],
  "username": "U0J8WQW9G",
  "password_scheme": "simple",
  "salt": "ef2c2e70-1139-4d91-8afc-c097f1abe9cc",
  "password": "63e7f843bbd22f235eb79abd36d7f15f129e850d",
  "seq": "1-g1AAAAFHeJyNjksOwjAMRA2thDgFN4j4JVVX9Cp2HGijkEqoWcPN4GbFoizaRQWbsWTNzJsAAHmdMWyYbHtzFZNW1FwoJKdsaBNj7FR0XRDjEoFOfd_7OsPFVR4ri1bvt-Xv-BRxmEdQJUr3LwU-FMIjloYZ1imyOzfR8bRvN98Xc1F4yJHKp0f4e8mQfA3J0RpTFMZoGq_xb7W2aEE",
  "meta": {
    "user_name": "glynn.bird",
    "team_id": "T08LVDR7Y",
    "team_name": "IBM Analytics",
    "password": "U2FsdGVkX1+e43yctdsliBFPEHCbBWflCrF0nQirXmo68cIhVxg14vRPWJZ0wlKhd6VZIVYsBO/9uiNRwhz1eA=="
  }
};

var olddoc = {
  "_id": "01fd74eee7edfb1fe86efab0032388ba",
  "_rev": "1-0ed350f2b519f0c9850859ccc51c850e",
  "collection": "blog",
  "title": "Master continuous integration and delivery with the IBM Devops Toolchain",
  "dtstart": "2016-08-09",
  "url": "https://developer.ibm.com/bluemix/2016/08/09/master-continuous-integration-delivery-ibm-devops-toolchain/",
  "tags": [
    "devops",
    " toolchain",
    " bluemix",
    " github",
    " travis-ci",
    " cloud",
    " continuous-integration",
    " continuous-delivery"
  ],
  "comments": "Part of the Logistics Wizard blog post series",
  "sponsored": false,
  "author": "acf9a3fee84222ea9183fe302a73049b"
};

var newdoc = 
{ collection: 'blog',
  title: 'PouchDB Replication',
  dtstart: '2016-09-01',
  url: 'https://pouchdb.com/api.html#filtered-changes',
  tags: 'pouchdb',
  comments: 'no comment',
  userid: 'U0J8WQW9G',
  userDisplayName: 'glynn.bird',
  userDomain: 'IBM Analytics',
  ts: 1472744282141,
  _id: 'B76ABFE4-8F71-49C5-9AD2-6CBFDBD2503D',
  _rev: '1-12cecec6b6f2a4308f0e3d3213ff60b8' };


var locateUser = function(uid) {
  for (var i = 0; i< users.length; i++) {
    var u = users[i];
    if (u._id === uid) {
      return u;
    }
  }
}

var loadDocsAndUsers = function(done) {
  advocateddb.list({include_docs:true}, function(err, data) {
    console.log(err, data.rows.length);

    for(var i in data.rows) {
      var d = data.rows[i].doc;
      delete d._rev;
      if (d.collection === 'user') { 
        if (d.identifiers && d.identifiers.slack && d.identifiers.slack.team_domain != 'clouddataservices') {
          olduserslookup[d._id] = d.identifiers.slack.user_id;
          users.push(convertUser(d));
        }
      }
    }
    for(var i in data.rows) {
      var d = data.rows[i].doc;
      if (d.collection != 'user') { 
         // find the new user record for this doc
         var uid = d.author || d.presenter || d.attendee || null;
         if (uid !== null) {
           var newuid = olduserslookup[uid];
           var newuser = locateUser(newuid);
           //console.log(JSON.stringify(newuser));
           var doc = convertDoc(d, newuser);
           docs.push(doc);
         }
      }
    }
    done();
  })
}
//console.log(convertUser(olduser));

loadDocsAndUsers(function() {
  console.log(users.length,'users and ',docs.length,'docs');
  advocateddb2.bulk({docs: docs}, function(err, data) {
    console.log('docs', err, data);
  });
  envoyusersdb.bulk({docs: users}, function(err, data) {
    console.log('users', err, data);
  });
});