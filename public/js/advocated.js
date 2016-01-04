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

var init = function() {
  hideForms();

  $('#presented' ).on( "submit", function( event ) {
    event.preventDefault();
    console.log( $( this ).serialize() );
  });

  $('#attended').on( "submit", function( event ) {
    event.preventDefault();
    
    var req = {
      url: "doc",
      method: "post",
      data: $( this ).serialize(),
      dataType: "json"
    };
    $.ajax(req).done(function(msg) {
      renderMessage(msg);
      hideForms();
      clearForms();
    }).fail(function(msg) {
      renderError(msg);
    });
  });
}


