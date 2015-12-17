// get Cloudant credentials
var services = process.env.VCAP_SERVICES
if (!services) {
  throw("Could not find a VCAP_SERVICES environment variable");
}
var opts = null;

// parse BlueMix config
if (typeof services != 'undefined') {
  services = JSON.parse(services);
  var service = null;
  if (!services || !services.cloudantNoSQLDB) {
    throw("Could not find any attached cloudantNoSQLDB services")
  }
  service = services.cloudantNoSQLDB[0];
  opts = service.credentials;
  opts.account = opts.username;
//  console.log(opts);
} 

var cloudant = require('cloudant')(opts);

module.exports = cloudant;