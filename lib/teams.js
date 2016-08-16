var cloudant = require('./db.js'),
  config = require('./config.js'),
  db = cloudant.db.use(config.TEAM_DBNAME);

// load team where id=team_id
var load = function (id, callback) {
  db.get(id, callback);
};

module.exports = {
  load: load,
}
