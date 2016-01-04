var express = require('express'),
  cfenv = require('cfenv'),
  cloudant = require('./lib/db.js'),
  couchmigrate = require('./lib/couchmigrate.js'), 
  config = require('./lib/config.js'),
  moment = require('moment'),
  users = require('./lib/users.js'),
  tokens = require('./lib/tokens.js'),
  events = require('./lib/events.js'),
  app = express(),
  appEnv = cfenv.getAppEnv(),
  session = require('express-session'),
  appurl = (appEnv.app.application_uris)?appEnv.app.application_uris[0]:"localhost:"+appEnv.port;

// initialise session support
app.use(session({
  secret: appurl, cookie: { }
}));

// body parsing
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// use the jade templating engine
app.set('view engine', 'jade');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// CouchDB Design document
var ddoc = { _id: "_design/find", 
             views: {
                userbyidentifier: {
                  map: "function (doc) {\n if(doc.collection=='user') { for(var i in doc.identifiers) { emit([i, doc.identifiers[i].user_id ], null);}}\n}"
                },
                eventslist: {
                  map: "function (doc) {\n if(doc.collection=='event') { emit(doc.dtstart, doc.title); }}"
                }
              }};

// look for incoming requests from Slack
app.post('/slack', function(req,res) {
  
  // ensure that the incoming request has the correct token
  if (req.body.token && req.body.token == process.env.SLACK_TOKEN) {
    
    users.getOrSave('slack', req.body.user_name, req.body, function(err, data) {
      tokens.save({user: data, title: req.body.text}, function(err, data) {
        res.send("Thanks for advocating. Please visit this URL to enter the details <https://" + appurl  + "/auth/"+data.id+">");
      })

    });
  } else {
    res.send("Invalid request.");   
  }
});


// authenticate
app.get("/auth/:id", function(req,res) {
  
  // extract the token
  var id = req.params.id;
  if (!id) {
    return res.status(403).send("Invalid token");
  }
  
  tokens.load(id, function(err, data) {
    if (err) {
      return res.status(403).send("Missing or unknown token");
    }
    
    // kill the token - single use only
    tokens.remove(id, function(e,d) {
      
    });
    
    // extract the user object from the token
    req.session.user = data.user;
    req.session.title = data.title
    res.redirect("/menu");
   
  })
});

app.get("/menu", function(req,res) {
  if (!req.session.user) {
    return res.status(403).send("Not logged in");
  }
  res.render("doc", { doc: { title: req.session.title || "" }})
});


// create a new event
app.post("/doc", function(req,res) {
  if (!req.session.user) {
    return res.status(403).send("Not logged in");
  }
  
  var doc = req.body;
  doc.sponsored = (doc.sponsored)?true:false;
  doc.tags = doc.tags.split(",");
  doc.attendees = parseInt(doc.attendees);
  if(doc.collection == "session") {
    doc.attendee = req.session.user._id;    
  } else {
    doc.presenter = req.session.user._id;
  }
  events.save(doc, function(err, data) {
    console.log("err,data",err, data);
    if (err) {
      res.status(400).send( {ok: false, error: err.message});
    } else {
      res.status(200).send( data );
    }
  });
});

app.get("/events", function(req, res) {
  if (!req.session.user) {
    return res.status(403).send("Not logged in");
  }
  events.list(function(err,data) {
    console.log(err,data);
    res.send(data);
  });
})

// set up the databases
cloudant.db.create(config.TOKEN_DBNAME, function(e,d) {
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
});




