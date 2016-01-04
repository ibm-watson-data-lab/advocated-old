var clearForms = function() {
  $('#presented').trigger("reset");
  $('#attended').trigger("reset");
};

var hideForms = function() {
  $('#attendedorpresented').show();
  $('#presented').hide();
  $('#attended').hide();
};

var selectPresented = function() {
  console.log("Presented");
  $('#attendedorpresented').hide();
  $('#attended').hide();
  $('#presented').show();
  var req = {
    url: "/events",
    method: "get",
    dataType: "json"
  };
  $.ajax(req).done(function(msg) {
    console.log(msg);
    var html = "";
    for (var i in msg.rows) {
      html += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].value + '</option>\n';
    }
    $('#sessionevent').html(html);
  });
}

var selectAttended = function() {
  console.log("Attended");
  $('#attendedorpresented').hide();
  $('#presented').hide();
  $('#attended').show();
}

var renderError = function(str) {
  $('#message').html("");
  var html = '<div class="alert alert-danger" role="alert">';  
  html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
  html += '<span aria-hidden="true">&times;</span>'
  html += '</button>';
  html += JSON.stringify(str);
  html += '</div>'
  $('#error').html(html);
}

var renderMessage = function(str) {
  $('#error').html("");
  var html = '<div class="alert alert-success" role="alert">';  
  html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
  html += '<span aria-hidden="true">&times;</span>'
  html += '</button>';
  html += JSON.stringify(str);
  html += '</div>'
  $('#message').html(html);
}

var submitForm = function(data) {
  var req = {
    url: "doc",
    method: "post",
    data: data,
    dataType: "json"
  };
  $.ajax(req).done(function(msg) {
    renderMessage(msg);
    hideForms();
    clearForms();
  }).fail(function(msg) {
    renderError(msg);
  });
}

var init = function() {
  hideForms();

  $('#presented' ).on( "submit", function( event ) {
    event.preventDefault();
    submitForm($( this ).serialize());
  });

  $('#attended').on( "submit", function( event ) {
    event.preventDefault();
    submitForm($( this ).serialize());
  });
}


$( document ).ready(function() {
  init();
});

