var webhook = process.env.SLACK_WEBHOOK_URL || null,
  request = require('request');

/*
{ collection: 'event',
  title: 'woocon',
  dtstart: '2013-02-01',
  dtend: '2013-02-02',
  description: 'WooCon London',
  attendees: 22,
  leads: '33',
  categories: 'Meetup',
  sponsored: true,
  tags: [ 'a', 'b', 'c' ],
  comments: 'Woo ha ha',
  attendee: 'b7b12408c2b7059433eb0e87670038a3',
user: 
   { _id: 'b7b12408c2b7059433eb0e87670038a3',
     _rev: '1-d6cbf76d493d3d53430155717bc93ff0',
     collection: 'user',
     display_name: 'glynn',
     identifiers: { slack: [Object] } } }
   }
  
{ collection: 'session',
  event: '9db05d8e07a1b7aa789c366ff2003c08',
  title: 'Guitars are great',
  dtstart: '2015-04-03',
  description: 'Red ones are the best',
  attendees: 99,
  sponsored: true,
  categories: 'Meetup',
  tags: [ 'a', 'b', 'c' ],
  comments: 'ha ho yes',
  presenter: 'b7b12408c2b7059433eb0e87670038a3' }
  
*/

var formatPost = function(obj, callback) {
  var str = "";
  if (obj.collection == "session") {
    str += 'Hey! *' + obj.user.display_name + '* just `/advocated` with a presentation ';
    str += '*' + obj.title + '*';
    if (!isNaN(obj.attendees)) {
      str += ' to ' + obj.attendees + ' people.';
    }
  } else if (obj.collection == "event") {
    str += "Hey! *" + obj.user.display_name + "* just `/advocated` at ";
    str += '*' + obj.title + '*';
    if (!isNaN(obj.attendees)) {
      str += ' with ' + obj.attendees + ' people.';
    }
  }
  if (str.length >0) {
    post(str, callback); 
  } else {
    callback(true, null);
  }
}

// post to Slack
var post = function(str, callback) {
  if (!webhook) {
    return callback(true, null);
  }
  
  var opts = {
    method: 'post',
    url: webhook,
    form: {
     payload: JSON.stringify({text:str})
    },
    json: true
  };
  
  request(opts, function(error, response, body) {
    callback(error, {msg: body});
  });
}


module.exports = {
  post: post,
  formatPost: formatPost
}