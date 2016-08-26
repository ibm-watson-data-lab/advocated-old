var clearForms = function() {
  $('form').trigger("reset");
};

var prefillPresented = function(selectedEvent) {
  var req = {
    url: "/events",
    method: "get",
    dataType: "json"
  };
  $.ajax(req).done(function(msg) {
    console.log(msg);
    var html = "";
    html += '<option value="">-- Choose an event (Optional) --</option>\n';
    for (var i in msg.rows) {
      html += '<option ' + ((selectedEvent && selectedEvent == msg.rows[i].id) ? 'selected="selected"' : '') + ' value="' + msg.rows[i].id + '">' + msg.rows[i].value + '</option>\n';
    }
    $('#sessionevent').html(html);
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

var renderError = function(str) {
  $('#message').html("");
  var html = '<div class="alert-container warning">';  
  html += '<p>';
  html += JSON.stringify(str);
  html += '</p>';
  html += '</div>';
  $('#error').html(html);
};

var renderMessage = function(str) {
  $('#error').html("");
  var html = '<div class="alert-container warning">';  
  html += '<p>';
  html += JSON.stringify(str);
  html += '</p>';
  html += '<p><a class="type_link" href="menu">My Events</a></p>';
  html += '<div class="dialog_dismiss"><button class="button_primary" onclick="document.getElementById(\'message\').innerHTML=\'\';">Dismiss</button></div>';
  html += '</div>';
  $('#message').html(html);
};

var submitForm = function(data) {
  var req = {
    url: "doc",
    data: data,
    dataType: "json"
  };
  if (data.indexOf("_id=") == -1) {
	  req["method"] = "post";
  }
  else {
	  req["method"] = "put";
  }
  
  $.ajax(req).done(function(msg) {
    console.log(msg);
    renderMessage(msg);
    if (req.method === "post") {
    	clearForms();
    }
    resetFormButton();
  }).fail(function(msg) {
    console.log("fail",msg);
    renderError(msg);
    resetFormButton();
  });
};

var deleteEvent = function(id) {
	var req = {
		url: ("doc/"+id),
		method: "DELETE"
	};
	
	$.ajax(req).done(function(msg) {
		console.log(msg);
		$("#" + id + "_delete").remove();
		$("#" + id + "_detail").remove();
	}).fail(function(msg) {
		console.log("fail",msg);
		$("#" + id + "_delete").html(msg);
	});
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

var resetFormButton = function() {
  var btn = $('button[type="submit"]');
  btn.prop('disabled', false)
    .text(btn.text() === 'Updating...' ? 'Update' : 'Submit');
};

$(document).ready(function() {
  $('form').on('submit', function(event) {
    event.preventDefault();
    var btn = $('button[type="submit"]');
    btn.prop('disabled', true)
      .text(btn.text() === 'Update' ? 'Updating...' : 'Submitting...');

    submitForm($(this).serialize());
  });
});