var sendgrid = require('sendgrid')('LFS Quinnox','lfsQuinnox_2015');
var hogan = require('hogan.js');
var fs = require('fs');
var config = require('../config.js');

module.exports.sendRequest = function(req, res) {
	if(req.body.name && req.body.email && req.body.text) {
		var template = fs.readFileSync('./newRequest.hjs', 'utf-8');
		var compiledTemplate = hogan.compile(template);
		console.log("Mailing Address " + config.ENV.mailAddress);
		sendgrid.send({
			to: config.ENV.mailAddress,
			from: 'noreply@reports.com',
			subject: 'New Report Request Arrived',
			html: compiledTemplate.render({Name: req.body.name, Email: req.body.email, Requirement: req.body.text})
		}, function(err, response) {
			if(err) {
				console.log(err);
				res.json({status: 500, error: err});
			} else {
				res.json({status: 200, message: 'Message sent'});
			}
		});			
	} else {
		res.json({status: 403, message: 'Please fill the form with all the details.'})
	}
}