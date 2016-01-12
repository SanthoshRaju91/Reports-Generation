var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var oracle = require('oracledb'); 
var config = require('./config.js');
var nodeExcel=require('excel-export');
var controller = require('./controller/excelController.js');
var mailController = require('./controller/mailController.js');


//application server
var app = express();


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/api/commerceOptions/:category', function(req, res) {
	if(req.params.category === 'SMB') {
		res.json(config.businessType);
	} else {
		res.json(null);	
	}	
});

app.get('/api/ACHDecline/:date', controller.ACHDecline);

app.get('/api/onlineOrders/:startDate/:endDate', controller.onlineOrder);

app.get('/api/serviceRequest/:startDate/:endDate', controller.serviceRequests);

app.get('/api/SMB/:bus', controller.SMB);

app.post('/api/sendRequest', mailController.sendRequest);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(config.ENV.port, function(err) {
	if(err) {
		console.log("Error on port " + config.ENV.port + "\n Error: " + err);
	} else {
		console.log("Listening on port " + config.ENV.port);
	}
});