/** Send Mail functions here **/

var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

exports.sendMail = function( params, to, subject, body, cb ) {

	if ( params.type === 'sendmail' ) {
		var options = {
			"path": params.path
		};
		var transporter = nodemailer.createTransport( sendmailTransport( options ) ) ;
	} else {
		var transporter = nodemailer.createTransport({
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
};
