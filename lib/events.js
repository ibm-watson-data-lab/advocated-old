var cloudant = require('./db.js'),
  config = require('./config.js'),
  db = cloudant.db.use(config.DBNAME);



// save a user
var save = function(event, callback) {
  db.insert(event, callback);
};

var load = function(id, callback) {
  db.get(id, callback);
};

module.exports = {
  save: save,
  load: load
}