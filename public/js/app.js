if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js', { scope: '/' }).then(function(reg) {
    
    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
    }
    
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

// ET phone home
var envoy = window.location.origin;
var db = new PouchDB('advocated');
var loggedinuser = null;
var degrees = 0;

var setupDesignDocs = function() {
  var thingsByMonth = function(doc) {
    var bits = doc.dtstart.split('-');
    var year = parseInt(bits[0]);
    var month = parseInt(bits[1]);
    emit([year,month,doc.collection], 1);
  };
  var audienceByMonth = function(doc) {
    if (doc.collection === 'session') {
      var bits = doc.dtstart.split('-');
      var year = parseInt(bits[0]);
      var month = parseInt(bits[1]);
      emit([year,month], (doc.attendees || 0));
    }
  };
  var ddoc = {
    _id: '_design/index',
    views: {
      thingsByMonth: {
        map: thingsByMonth.toString(),
        reduce: '_count'
      },
      audienceByMonth: {
        map: audienceByMonth.toString(),
        reduce: '_sum'
      }
    }
  };
  db.get(ddoc._id, function(err, currentDoc) {
    if (err || JSON.stringify(currentDoc.views) != JSON.stringify(ddoc.views)) {
      console.log('Installing design docs');
      if (currentDoc) {
        ddoc._rev = currentDoc._rev;
      }
      return db.put(ddoc);
    }
  });

};

// get milliseconds
var ms = function() {
  return new Date().getTime();
}

// perform a sync
var sync = function() {
  var url = window.location.origin.replace('//', '//' + loggedinuser.username + ':' + loggedinuser.meta.password + '@');
  var remote = new PouchDB(url + '/advocated2');

  // don't replicate design documents
  var filter = function(doc) {
    return doc._id.indexOf('_design') !== 0;
  };

  // sync live with retry, animating the icon when there's a change'
  db.sync(remote, {live: true, retry: true, filter: filter}).on('change', function(c) {
    degrees += 10;
    console.log('change',c)
    $('#syncviz').css({'transform' : 'rotate('+ degrees +'deg)'});
    updatePage();
  }).on('complete', function() {
    updatePage();
  });
}

// form submitter
var submitForm = function (id) {

  var o = {};
  var elements = $(id + ' :input')
  for(var i in elements) {
    var a = elements[i];
    if (a.type && a.name && a.id) {
      var val = a.value;
      var step = $(a).attr('step');
      var float = (step==='any' || step ==='0.0001')?true:false;
      var grouped = ($(a).attr('data-meta') === 'grouped')? true: false;

      switch (a.type) {
        case 'number':
          if (float) {
            val = parseFloat(val)
          } else {
            val = parseInt(val);
          }
        break;

        case 'checkbox':
          if (grouped) {
            if (!a.checked) {
              val = null;
            }
            // use text value
          } else {
            // use boolean
            val = a.checked;
          }
        break;

        case 'text':
          if (grouped) {
            val = val.split(',');
          }
        break;

        case 'url':
        case 'hidden':
        default:
        break;
      }

      if (val != null) {
        if (o[a.name] !== undefined) {
          if (!o[a.name].push) {
            o[a.name] = [o[a.name]];
          }
          o[a.name].push(val);
        } else {
          o[a.name] = val;
        }
      }

    }
    else if (a.name === '_id' && a.value) {
      o._id = a.value;
    }
    else if (a.name === '_rev' && a.value) {
      o._rev = a.value;
    }
    
  };

  // add user data into the mix
  o.userid = loggedinuser.username
  o.userDisplayName = loggedinuser.meta.user_name;
  o.userDomain = loggedinuser.meta.team_name;
  o.teamid = loggedinuser.meta.team_id;
  o.ts = ms();

  // write to the database
  if (o._id) {
    db.put(o).then(function() {
      Materialize.toast('Updated', 1500, '', function() {
        renderEvents();
      });
    });
  }
  else {
    db.post(o).then(function() {
      Materialize.toast('Saved', 1500, '', function() {
        renderEvents();
      });
    });
  }
}

var initForm = function() {
  $('form').on('submit', function(event) {
    event.preventDefault();
    var btn = $('button[type="submit"]');
    btn.prop('disabled', true)
      .addClass('disabled')
      .text(btn.text() === 'Update' ? 'Updating...' : 'Submitting...');

    submitForm('#' + $(this).attr('id'));
  });
};

var updatePage = function() {
  var docid = null,
    token = null;
  if (location.hash && location.hash.indexOf('id=') != -1) {
    var idx = location.hash.indexOf('id=');
    console.log(idx);
    var h = location.hash.indexOf('#', idx) != -1 ? location.hash.indexOf('#', idx) : location.hash.length;
    var a = location.hash.indexOf('&', idx) != -1 ? location.hash.indexOf('&', idx) : location.hash.length;
    docid = location.hash.substring(idx+3, Math.min(h, a));
  }
  if (location.hash && location.hash.indexOf('token=') != -1) {
    var idx = location.hash.indexOf('token=');
    var h = location.hash.indexOf('#', idx) != -1 ? location.hash.indexOf('#', idx) : location.hash.length;
    var a = location.hash.indexOf('&', idx) != -1 ? location.hash.indexOf('&', idx) : location.hash.length;
    token = location.hash.substring(idx+6, Math.min(h, a));
  }
  console.log('docid',docid)
  if (docid) {
    db.get(docid)
      .then(function(doc) {
        var page = '/templates/';
        if (doc.collection == 'session') {
          page += 'presented.html';
        } else if (doc.collection == 'event') {
          page += 'attended.html';
        } else if (doc.collection == 'blog') {
          page += 'blogged.html';
        } else if (doc.collection == 'press') {
          page += 'pr.html';
        } else if (doc.collection == 'expense') {
          page += 'expense.html';
        }
        $.get(page, function(template) {
          var rendered = Mustache.render(template, doc);
          $('#main').html(rendered);
          initForm();
          $(window).scrollTop(0);
        });
      })
      .catch(function(err) {
        console.error(err);
        renderEvents();
      });
  }
  else {
    var page = location.hash ? location.hash.substring(1) : null;
    if (page) {
      $.get(('/templates/' + page), function(template) {
        var rendered = Mustache.render(template, { token: token, loggedinuser: loggedinuser });
        $('#main').html(rendered);
        initForm();
      });
    }
    else {
      renderEvents();
    }
  }
};

var renderEvents = function() {
  var map = function(doc) {
    emit(doc.ts, null);
  }
  db.query(map, {include_docs:true, descending:true, limit: 50})
    .then(function(data) {
      var template = $('#frontpage').html();
      var rendered = Mustache.render(template, data);
      $('#main').html(rendered);
    });
};

var deleteEvent = function(id, rev) {
  if (id) {
    db.remove(id, rev)
      .then(function(result) {
        $("#" + id + "_delete").remove();
        $("#" + id + "_detail").remove();
      })
      .catch(function(err) {
        console.error(err);
      });
  }
};

var toggle = function(domNodeId, parentId) {
	var expanded = $("#" + domNodeId).is(":visible");
	if (!expanded && parentId) {
		$("#" + parentId).toggleClass("active");
	}
	$("#" + domNodeId).slideToggle(500, function() {
		if (expanded && parentId) {
			$("#" + parentId).toggleClass("active");
		}
	});
};

var initCheckboxes = function(sponsored, categories) {
	if (sponsored == true || sponsored.toLowerCase() === "true") {
		$('input[name="sponsored"][value="Sponsored"]').prop('checked', true);
	}
	if (categories) {
		var c = [];
		if ($.isArray(categories)) {
			c = categories;
		}
		else {
			c = categories.split(',');
		}
		
		for (var i in c) {
			$('input[name="categories"][value="' + c[i] + '"]').prop('checked', true);
		}
	}
};

var getCurrencyOptions = function(currency) {
  var currencies = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };
  var html = '';
  for (var i in currencies) {
    var selected = (i === currency )?'selected="selected"':''
    html +=  '<option value="' + i + '" ' + selected + ' ">' + currencies[i] + '</option>\n'; 
  }
  return html;
}

var renderGeoJSON = function(L, map, obj, style, label) {
  var opts = {
    style: style
  }
  var l = L.geoJson(obj, opts).addTo(map);
};

$(document).ready(function(){
  // materialize special
  $(".button-collapse").sideNav({
    closeOnClick: true
  });

  db.get('_local/user').then(function(data) {
    loggedinuser = data;
    var msg = 'Welcome back, ' + data.meta.user_name + ' (' + data.meta.team_name + ')';
    Materialize.toast(msg, 4000);
    sync();
  }).catch(function(e) {
    $('#themenu').hide();
    $('#main').hide();
    $('#notloggedin').removeClass('hide');
  });
  
  // install any design docs
  setupDesignDocs();

  // render the page
  updatePage();
  

  
});

