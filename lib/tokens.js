var cloudant = require('./db.js'),
  config = require('./config.js'),
  db = cloudant.db.use(config.TOKEN_DBNAME);

// save a token
var save = function(event, callback) {
  db.insert(event, callback);
};

// load a token
var load = function(id, callback) {
  db.get(id, callback);
};

var remove = function(id, callback) {
  load(id, function(err, data) {
    db.destroy(id, data._rev, callback);
  });
};

module.exports = {
  save: save,
  load: load,
  remove: remove
}