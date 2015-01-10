/** Verify module **/

var db = require('../functions/db.js');


exports.verifyAddress = function(req, res) {

	var config = req.app.set('config');
	
	if ( req.params.email && req.params.strid ) {
		
		email = req.params.email;
		strid = req.params.strid;
		
		db.checkinDB( { email: email, strid: strid, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				console.log( info );
			} else {
				// TODO: Process error registering
			}
		});
		
	} else {
		
	}
	

};