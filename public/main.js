$( document ).ready(function() {

	// TODO: handle basepath better here
	
	var current_url = window.location.href;
	
	var re = /\/\w+\.htm\S$/;
	if ( re.test( current_url ) ){
		current_url.replace( re , "/");
	}
	
	// http://stackoverflow.com/questions/5052543/how-to-fire-ajax-request-periodically
	(function worker() {
		$.ajax({
			url: current_url + '/list', 
			success: function(data) {
				if ( data.length > 0 ) {
					$( "#list ").empty();
					$( "#list ").append("<ul>");
					// TODO: Put a limit, show more, maybe, offset in get?
					$.each( data, function( index, value ) {
						if ( value.name && value.name !== '' ) {
							$( "#list ").append("<li>"+value.name+"</li>");
						}
					});
					$( "#list ").append("</ul>");
				}
				
			},
			complete: function() {
				// Schedule the next request when the current one's complete
				setTimeout(worker, 10000);
			}
		});
	})();

});