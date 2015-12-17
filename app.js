var express = require('express'),
  cfenv = require('cfenv'),
  cloudant = require('./lib/db.js'),
  couchmigrate = require('./lib/couchmigrate.js'), 
  config = require('./lib/config.js'),
  moment = require('moment'),
  users = require('./lib/users.js'),
  events = require('./lib/events.js'),
  app = express(),
  appEnv = cfenv.getAppEnv(),
  appurl = (appEnv.app.application_uris)?appEnv.app.application_uris[0]:"localhost:"+appEnv.port;

// body parsing
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// CouchDB Design document
var ddoc = { _id: "_design/find", 
             views: {
                userbyidentifier: {
                  map: "function (doc) {\n if(doc.collection=='user') { for(var i in doc.identifiers) { emit([i, doc.identifiers[i].user_id ], null);}}\n}"
                }
              }};

// look for incoming requests from Slack
app.post('/slack', function(req,res) {
  
  // ensure that the incoming request has the correct token
  if (req.body.token && req.body.token == process.env.SLACK_TOKEN) {
    var obj = { 
                collection: 'provisional',
                attendee: null,
                title: req.body.text || '',
                dstart: moment().format('YYYY-MM-DD'),
                dend: moment().format('YYYY-MM-DD'),
                description: '',   
                attendees: 0,
                categories:[],
                sponsored: false,
                tags: [],
                comments: ''   
              };
    
    
    users.getOrSave('slack', req.body.user_name, req.body, function(err, data) {
      obj.attendee = data._id;
      events.save(obj, function(err, data) {
        res.send("Thanks for adbocating. Please visit this URL to enter the details https://" + appurl  + "/doc?id="+data.id);
      });
    });
  } else {
    res.send("Invalid request.");   
  }
});


// set up the database
cloudant.db.create(config.DBNAME, function(e, d) {
  
  // make sure design documents are in place
  couchmigrate.migrate(config.DBNAME, ddoc, function(e, d) {
    
    // start server on the specified port and binding host
    app.listen(appEnv.port, '0.0.0.0', function() {

    	// print a message when the server starts listening
      console.log("server starting on " + appEnv.url);
    });
    
  });
});



