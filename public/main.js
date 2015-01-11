$( document ).ready(function() {

	// TODO: handle basepath better here
	
	// http://stackoverflow.com/questions/5052543/how-to-fire-ajax-request-periodically
	(function worker() {
		$.ajax({
			url: '/list', 
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