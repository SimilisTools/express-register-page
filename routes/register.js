/** Register module **/

var db = require('../functions/db.js');
var sm = require('../functions/sm.js');
var rs = require('random-string');

exports.registerAddress = function(req, res) {

	var config = req.app.set('config');
	var params = {
		event: config.event, 
		contact: config.contact,
		basepath: config.basepath
	};
	
	if ( !req.body.email || req.body.email === '') {
		params.msg = config.msg.error.emailneeded;
		res.render( 'error.html', params );
		
	} else {
		params.email = email;
		
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
						sm.sendMail( emailconf , "register", { "address": vAddress, "to": email, "event": config.event, "contact": config.contact }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							
							params.done = false;
							params.verified = false;
							params.previous = false;
							
							res.render( 'register.html', params );
						});
					} else if ( info.msg === 'Updated' ) {
						//code
						sm.sendMail( emailconf, "register", { "again": true, "address": vAddress, "to": email, "event": config.event, "contact": config.contact }, function( err, info ) {
							console.log( "ERR " + err );
							console.log( info );
							
							params.done = false;
							params.verified = false;
							params.previous = true;
							
							res.render( 'register.html', params );
						});
					} else {
						// we assume validated
						
						params.done = false;
						params.verified = true;
						
						res.render( 'register.html', params );
					}
				}
 			} else {
				params.msg = err;
				res.render( 'error.html', params );
			}
		});

	}
	
};

exports.verifyAddress = function(req, res) {

	var config = req.app.set('config');
	var params = {
		event: config.event, 
		contact: config.contact,
		basepath: config.basepath
	};
	
	if ( req.params.email && req.params.strid ) {
		
		params.email = email;
		
		email = req.params.email;
		strid = req.params.strid;
		
		
		db.checkinDB( { email: email, strid: strid, db: config.db }, function( err, info ) {
			if ( !err ) {
				// TODO: Depending on info outcome

				params.done = true;
				
				console.log( info );
				res.render( 'register.html',  params );
			} else {
				params.msg = err;
				res.render( 'error.html', params );
			}
		});
		
	} else {
		params.msg = config.msg.error.emailnotprovided;
		res.render( 'error.html', params );
	}
	

};

