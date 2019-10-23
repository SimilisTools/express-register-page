/** Send Mail functions here **/

var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');
var ejs = require('ejs');

exports.sendMail = function( params, method, extra, cb ) {

	ejs.renderFile( params.templates + "/" + method + "/html.ejs", extra, function (err, data) {

		var transporter;
		if ( params.type === 'sendmail' ) {
			var options = {
				"path": params.path
			};
			transporter = nodemailer.createTransport( sendmailTransport( options ) ) ;
		} else {
			transporter = nodemailer.createTransport({
				type: params.type
			});
		}
		
		var subject = "["+extra.event.title+"] - "+method;
		
		console.log( subject );
	
		transporter.sendMail(  {
				from: params.from,
				to: extra.to,
				subject: subject,
				html: data,
				//text: text
				text: "Test msg"
		}, function(err, info){
			console.log( info );
			console.log( err );
			cb( err, info );
		});
	
	});

};
