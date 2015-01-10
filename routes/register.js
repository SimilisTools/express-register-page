/** Register module **/

var db = require('../functions/db.js');
var sm = require('../functions/sm.js');

exports.registerAddress = function(req, res) {

	var config = req.app.set('config');
	
	if ( !req.body.email || req.body.email === '') {
		// TODO: Return error page. Check in webform as well.
	} else {
		
		// TODO: Check email address. Check in webform as well.
		
		// TODO: Check name
		var name = null; // Rather checkbox in webform
		if ( req.body.name && req.body.name !== '' ) {
			name = req.body.name;
		}
		
		var email = req.body.email;
		
		var randomString = generateRandomString(); // TODO: Function for random string

		db.addinDB( { email: email , name: name, strID: randomString, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				// Send message or not
				console.log( info );
				if ( info.msg ) {

					if ( info.msg === 'Saved' ) {
						//code
						var subject = "Registered";
						var body = "Registered! Verify tal " + randomString;
						sm.sendMail( config.email, email, subject, body, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'register.html',  { email: email, verified: false, previous: false } );
						});
					} else if ( info.msg === 'Updated' ) {
						//code
						var subject = "Registered";
						var body = "Registered again! Verify tal " + randomString;
						sm.sendMail( config.email, email, subject, body, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'register.html',  { email: email, verified: false, previous: true } );
						});
					} else {
						// we assume validated
						res.render( 'register.html',  { email: email, verified: true } );
					}
				}
 			} else {
				// TODO: Process error registering
				console.log( err );
			}
		});

	}
	
};

function generateRandomString() {
	
	return 'XXXX';
}