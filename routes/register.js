/** Register module **/

var db = require('../functions/db.js');
var fn = require('../functions/index.js');

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
		
		var randomString = fn.generateRandomString(); // TODO: Function for random string
		
		db.addinDB( { email: email , name: name }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				// Send message or not
 			} else {
				// TODO: Process error registering
			}
		});

	}
	
};