/** Register module **/

var db = require('../functions/db.js');
var sm = require('../functions/sm.js');
var rs = require('random-string');

exports.registerAddress = function(req, res) {

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
		
		// TODO: Check name
		var name = null; // Rather checkbox in webform
		if ( req.body.name && req.body.name !== '' ) {
			name = req.body.name;
		}
		
		var email = req.body.email;
		options.email = email;
		
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
						sm.sendMail( emailconf , "register", { "address": vAddress, "to": email, "event": config.event, "contact": config.contact }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							
							options.done = false;
							options.verified = false;
							options.previous = false;
							
							res.render( 'register.html', options );
						});
					} else if ( info.msg === 'Updated' ) {
						//code
						sm.sendMail( emailconf, "register", { "again": true, "address": vAddress, "to": email, "event": config.event, "contact": config.contact }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							
							options.done = false;
							options.verified = false;
							options.previous = true;
							
							res.render( 'register.html', options );
						});
					} else {
						// we assume validated
						
						options.done = false;
						options.verified = true;
						
						res.render( 'register.html', options );
					}
				}
 			} else {
				options.msg = err;
				res.render( 'error.html', options );
			}
		});

	}
	
};

exports.verifyAddress = function(req, res) {

	var config = req.app.set('config');
	var options = {
		event: config.event, 
		contact: config.contact,
		basepath: config.basepath
	};
	
	if ( req.params.email && req.params.strid ) {
		
		email = req.params.email;
		strid = req.params.strid;
		options.email = email;
		
		db.checkinDB( { email: email, strid: strid, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome

				options.done = true;
				
				console.log( info );
				res.render( 'register.html', options );
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

