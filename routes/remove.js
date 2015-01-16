/** Remove address **/
var db = require('../functions/db.js');
var sm = require('../functions/sm.js');
var rs = require('random-string');

exports.removeAddress = function(req, res) {

	var config = req.app.set('config');
	var options = {
		event: config.event, 
		contact: config.contact,
		basepath: config.basepath
	};
	
	if ( !req.body.email || req.body.email === '') {
		options.msg = config.msg.error.emailneeded;
		res.render( 'error.html', options );
	} else {
		
		// TODO: Check email address. Check in webform as well.
		
		var email = req.body.email;
		options.email = email;
		
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
					
						options.done = false;
						options.removed = true;
						
						sm.sendMail( emailconf, "remove", { "address": rAddress, "to": email, "event": config.event, "contact": config.contact }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							res.render( 'remove.html', options );
						});
					} else {
					
						options.done = false;
						options.removed = false;
						
						// we assume validated
						res.render( 'remove.html', options );
					}
				}
 			} else {
				options.msg = err;
				res.render( 'error.html', options );
			}
		});

	}
}

exports.verifyAddress = function(req, res) {
	
	var config = req.app.set('config');
	var options = {
		event: config.event, 
		contact: config.contact,
		basepath: config.basepath
	};
				
	if ( req.params.email && req.params.rmvid ) {
		
		email = req.params.email;
		rmvid = req.params.rmvid;
		options.email = email;
		
		db.checkRmvfromDB( { email: email, rmvid: rmvid, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome
				console.log( info );
				

				options.done = true;
				
				res.render( 'remove.html', options );
			} else {
				options.msg = err;
				res.render( 'error.html', options );
			}
		});
		
	} else {
		options.msg = config.msg.error.emailnotprovided;
		res.render( 'error.html', options );
	}
	

};
