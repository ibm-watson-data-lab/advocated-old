var cloudant = require('./db.js'),
  config = require('./config.js'),
  db = cloudant.db.use(config.DBNAME);




// search for a user by their identifier
var getByIdentifier = function(authtype, identifier, callback) {
  db.view('find', 'userbyidentifier', { key:[authtype, identifier], limit: 1, include_docs:true}, function(err, data) {
    callback(null, (data.rows)?data.rows[0]:null);
  });
};

var getOrSave = function(authtype, displayName, identifierObject, callback) {
  getByIdentifier(authtype, identifierObject.user_id, function(err, data) {
    if (data == null) {
      save(authtype, displayName, identifierObject, callback)
    } else {
      callback(err, data.doc);
    }
  });
};

// save a user
var save = function(authtype, displayName, identifierObject, callback) {
  var obj = {
    collection: 'user',
    display_name: displayName, 
    identifiers: {
      
    }
  };
  obj.identifiers[authtype] = identifierObject;
  db.insert(obj, function(err, data) {
    if (!err) {
      obj._id = data.id;
      obj._rev = data.rev;
    }
    callback(err, obj);
  });
};


module.exports = {
  getByIdentifier: getByIdentifier,
  save: save,
  getOrSave: getOrSave
}