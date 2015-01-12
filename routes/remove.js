/** Remove address **/
var db = require('../functions/db.js');
var sm = require('../functions/sm.js');
var rs = require('random-string');

exports.removeAddress = function(req, res) {

	var config = req.app.set('config');
	
	if ( !req.body.email || req.body.email === '') {
		// TODO: Return error page. Check in webform as well.
	} else {
		
		// TODO: Check email address. Check in webform as well.
		
		var email = req.body.email;
		
		var randomString = rs();

		db.rmvfromDB( { email: email , rmvid: randomString, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				// Send message or not
				console.log( info );
				if ( info.msg ) {

					var emailconf =  config.email;
					emailconf.templates = req.app.set('mail');
				
					var rAddress = config.server + config.basepath + "/remove/" + email + "/" + randomString;

					if ( info.msg === 'To-remove' ) {
						
						sm.sendMail( emailconf , email, "remove", { "address": rAddress }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'remove.html',  { email: email, done: false, removed: true } );
						});
					} else {
						// we assume validated
						res.render( 'remove.html',  { email: email, done: false, removed: false } );
					}
				}
 			} else {
				// TODO: Process error registering
				console.log( err );
			}
		});

	}
}

exports.verifyAddress = function(req, res) {
	
	var config = req.app.set('config');
	
	if ( req.params.email && req.params.rmvid ) {
		
		email = req.params.email;
		rmvid = req.params.rmvid;
		
		db.checkRmvfromDB( { email: email, rmvid: rmvid, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				console.log( info );
				res.render( 'remove.html', { email: email, done: true } );
			} else {
				// TODO: Process error registering
				console.log( err );
			}
		});
		
	} else {
		console.log("Not!");
	}
	

};