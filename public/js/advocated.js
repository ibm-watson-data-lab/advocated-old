var clearForms = function() {
  $('form').trigger("reset");
};

var prefillPresented = function() {
  var req = {
    url: "/events",
    method: "get",
    dataType: "json"
  };
  $.ajax(req).done(function(msg) {
    console.log(msg);
    var html = "";
    html += '<option value="">-- choose an event --</option>\n';
    for (var i in msg.rows) {
      html += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].value + '</option>\n';
    }
    $('#sessionevent').html(html);
  });
};

var renderError = function(str) {
  $('#message').html("");
  var html = '<div class="alert alert-danger" role="alert">';  
  html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
  html += '<span aria-hidden="true">&times;</span>'
  html += '</button>';
  html += JSON.stringify(str);
  html += '</div>'
  $('#error').html(html);
};

var renderMessage = function(str) {
  $('#error').html("");
  var html = '<div class="alert alert-success" role="alert">';  
  html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
  html += '<span aria-hidden="true">&times;</span>'
  html += '</button>';
  html += JSON.stringify(str);
  html += '<div><a href="menu">MENU</a></div>'
  html += '</div>'
  $('#message').html(html);
};

var submitForm = function(data) {
  var req = {
    url: "doc",
    method: "post",
    data: data,
    dataType: "json"
  };
  $.ajax(req).done(function(msg) {
    console.log(msg);
    renderMessage(msg);
    clearForms();
  }).fail(function(msg) {
    console.log("fail",msg);
    renderError(msg);
  });
};


