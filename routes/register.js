/** Register module **/

var db = require('../functions/db.js');
var sm = require('../functions/sm.js');
var rs = require('random-string');

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
		
		var randomString = rs(); // TODO: Function for random string

		db.addinDB( { email: email , name: name, strid: randomString, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				// Send message or not
				console.log( info );
				if ( info.msg ) {

					var vAddress = config.server + config.basepath + "/register/" + email + "/" + randomString;
					
					var emailconf =  config.email;
					emailconf.templates = req.app.set('mail');
					
					if ( info.msg === 'Saved' ) {
						//code
						sm.sendMail( emailconf , email, "register", { "address": vAddress }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'register.html',  { email: email, done: false, verified: false, previous: false } );
						});
					} else if ( info.msg === 'Updated' ) {
						//code
						sm.sendMail( emailconf, email, "register", { "again": true, "address": vAddress }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'register.html',  { email: email, done: false, verified: false, previous: true } );
						});
					} else {
						// we assume validated
						res.render( 'register.html',  { email: email, done: false, verified: true } );
					}
				}
 			} else {
				// TODO: Process error registering
				console.log( err );
			}
		});

	}
	
};

exports.verifyAddress = function(req, res) {

	var config = req.app.set('config');
	
	if ( req.params.email && req.params.strid ) {
		
		email = req.params.email;
		strid = req.params.strid;
		
		db.checkinDB( { email: email, strid: strid, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				console.log( info );
				res.render( 'register.html',  { email: email, done: true } );
			} else {
				// TODO: Process error registering
				console.log( err );
			}
		});
		
	} else {
		console.log("Not!");
	}
	

};

function generateRandomString() {
	
	return 'XXXX';
}