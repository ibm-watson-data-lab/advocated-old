var request = require('request');

var post = function(webhook, obj, callback) {
  var str = "";
  if (obj.collection == "session") {
    str += 'Hey! *' + obj.userDisplayName + '* just `/advocated` with a presentation ';
    str += '*' + obj.title + '*';
    if (!isNaN(obj.attendees)) {
      str += ' to ' + obj.attendees + ' people.';
    }
  } else if (obj.collection == "event") {
    str += "Hey! *" + obj.userDisplayName + "* just `/advocated` at ";
    str += '*' + obj.title + '*';
    if (!isNaN(obj.attendees)) {
      str += ' with ' + obj.attendees + ' people.';
    }
  } else if (obj.collection == "blog") {
    str += "Hey! *" + obj.userDisplayName + "* just `/advocated` with a blog ";
    str += '*' + obj.title + '* --> ' + obj.url;
  } else if (obj.collection == "press") {
    str += "Hey! *" + obj.userDisplayName + "* just `/advocated` with the press @ *" + obj.outlet + "*";
    str += ' about *' + obj.title + '*';
    if (obj.url) {
      str += ' --> ' + obj.url;
    }
  }
  
  if (str.length > 0) {
    var opts = {
      method: 'post',
      url: webhook,
      form: {
        payload: JSON.stringify({
          text: str
        })
      },
      json: true
    };

    request(opts, function (error, response, body) {
      callback(error, body);
    });
    console.log('!!!!',str,'!!!!!');
    

  } else {
    callback(true, null);
  }
}

module.exports = {
  post: post
}