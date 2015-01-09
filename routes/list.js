/** Listing module **/

var db = require('../functions/db.js');


exports.listAddresses = function(req, res) {

	var config = req.app.set('config');
	
	db.listinDB( { db: config.db }, function( err, info ) {
		if ( !err ) {
			// TODO: Depending on info outcome
			// Send message or not
			console.log( info );
		} else {
			// TODO: Process error registering
		}
	});
};