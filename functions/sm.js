/** Send Mail functions here **/

var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');
var emailTemplates = require('email-templates');

exports.sendMail = function( params, to, options, cb ) {

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
		  
			var mailOptions = {
				from: params.from,
				to: to,
				subject: subject,
				text: body,
			};
		  
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(err, info){
				cb( err, info );
			});
		
		}
	});
};
