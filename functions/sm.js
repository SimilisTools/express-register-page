/** Send Mail functions here **/

var nodemailer = require('nodemailer');

exports.sendMail = function( params, to, subject, body, cb ) {

	var transporter = nodemailer.createTransport({
		type: params.type
	});

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