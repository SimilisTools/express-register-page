/** Listing module **/

var db = require('../functions/db.js');


exports.listAddresses = function(req, res) {

	var config = req.app.set('config');
	
	db.listinDB( { db: config.db }, function( err, info ) {
		if ( !err ) {
			// TODO: Depending on info outcome
			// Send message or not
			res.send( info );
		} else {
			// TODO: Process error registering
			res.send();
		}
	});
};

exports.listAllAddresses = function(req, res) {

	var config = req.app.set('config');
	var admin = config.admin;
	
	if ( req.body.admin ) {
		
		if ( admin && admin === req.body.admin ) {
			
				db.listAllinDB( { db: config.db }, function( err, info ) {
				if ( !err ) {
					res.send( info );
				} else {
					// TODO: Process error registering
					res.send();
				}
			});
		} else {
			// TODO: Handle error here
			res.send();
		}
		
	} else {
		
		// TODO: Handle error here
		res.send();
	}

};