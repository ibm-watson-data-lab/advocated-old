var cloudant = require('./db.js'),
  config = require('./config.js'),
  db = cloudant.db.use(config.DBNAME);

// save an event
var save = function(event, callback) {
  db.insert(event, callback);
};

//update an event
var update = function(id, event, callback) {
  db.insert(event, id, callback);
};

//delete an event
var destroy = function(id, rev, callback) {
db.destroy(id, rev, callback);
};

var load = function(id, callback) {
  db.get(id, callback);
};

var list = function(userid, callback) {
  db.view('find', 'eventslist', {descending:true, limit:50, endkey: [userid], startkey:[userid + "z"]}, function(err, data) {
    callback(err, data);
  });
};

var mystuff = function(userid, callback) {
  db.view('find', 'mystuff', { descending:true, endkey: [userid], startkey: [userid + "z"]}, function(err, data) {
    callback(err, data);
  });
}

module.exports = {
  save: save,
  load: load,
  list: list,
  mystuff: mystuff,
  update: update,
  destroy: destroy
}