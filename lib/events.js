var cloudant = require('./db.js'),
  config = require('./config.js'),
  db = cloudant.db.use(config.DBNAME);



// save a user
var save = function(event, callback) {
  db.insert(event, callback);
};

module.exports = {
  save: save
}