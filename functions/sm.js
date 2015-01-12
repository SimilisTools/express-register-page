/** Send Mail functions here **/

var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');
var emailTemplates = require('email-templates');

exports.sendMail = function( params, method, extra, cb ) {

	emailTemplates( params.templates, function(err, template ) {

		if (err) {
			console.log(err);
		} else {
		
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
			// Send a single email
			template( method, extra, function(err, html, text) {
				if (err) {
						console.log(err);
				} else {
				// send mail with defined transport object
					transporter.sendMail(  {
						from: params.from,
						to: extra.to,
						html: html,
						text: text
					}, function(err, info){
						cb( err, info );
					});
				}
			});
		}
	});
};
