/** Remove address **/

exports.removeAddress = function(req, res) {

	var config = req.app.set('config');
	
	if ( !req.body.email || req.body.email === '') {
		// TODO: Return error page. Check in webform as well.
	} else {
		
		// TODO: Check email address. Check in webform as well.
		
		var email = req.body.email;
		
		var randomString = generateRandomString(); // TODO: Function for random string

		db.rmvfromDB( { email: email , rmvID: randomString, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				// Send message or not
				console.log( info );
				if ( info.msg ) {

					if ( info.msg === 'Removed' ) {
						//code
						var subject = "Registered";
						var body = "Removed! Confirm removal at " + randomString;
						sm.sendMail( config.email, email, subject, body, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'remove.html',  { email: email, removed: true } );
						});
					} else {
						// we assume validated
						res.render( 'remove.html',  { email: email, removed: false } );
					}
				}
 			} else {
				// TODO: Process error registering
				console.log( err );
			}
		});

	}

	exports.verifyAddress = function(req, res) {
	
		var config = req.app.set('config');
		
		if ( req.params.email && req.params.strid ) {
			
			email = req.params.email;
			rmvid = req.params.rmvid;
			
			db.checkRmvfromDB( { email: email, rmvid: rmvid, db: config.db }, function( err, info ) {
				if ( !err ) {
					// TODO: Depending on info outcome
					console.log( info );
				} else {
					// TODO: Process error registering
					console.log( err );
				}
			});
			
		} else {
			console.log("Not!");
		}
		

	};
};