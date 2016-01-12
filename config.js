module.exports.ENV = {
	"user": "commerce_admin",
	"password":"commerce123",
	"connectString": "ecomdevdb:1521/ecomdev_srv",
	"port": process.env.PORT || 3000,
	"mailAddress": "santhosh_sagar48@ymail.com"
}

module.exports.businessType = {
	"Light": "Light",
	"Medium": "Medium",
	"Medium-Heavy": "Medium-Heavy",
	"Heavy": "Heavy"
}

module.exports.busType = [{
	"name" : "Light",
	"value" : [9,10]
}, {
	"name" : "Medium",
	"value" : [4,8,11]
}, {
	"name": "Medium-Heavy",
	"value": [5,6]
}, {
	"name": "Heavy",
	"value": [7,12]
}];


module.exports.curbside = [{
		caption: 'Country',
		type: 'string',
		width : 10
	}, {
		caption: 'Area Name',
		type: 'string',
		width: 50
	}, {
		caption: 'Market Area',
		type: 'string',
		width: 50
	}, {
		caption: 'City',
		type: 'string',
		width: 50
	}, {
		caption: 'Postal code',
		type: 'string',
		width: 15
	}, {
		caption: 'Business Type',
		type: 'string',
		width: 50
	}, {
		caption: 'Product Description',
		type: 'string',
		width: 50
	}, {
		caption: 'Flat Rate',
		type: 'number',
		width: 10
	}, {
		caption: 'Environment Fee',
		type: 'number',
		width: 18
	}, {
		caption: 'Fuel Fee',
		type: 'number',
		width: 10
	}, {
		caption: 'Container Fee',
		type: 'number',
		width: 15
	}, {
		caption: 'RCR Fee',
		type: 'number',
		width: 10
	}, {
		caption : 'Admin Fee',
		type: 'number',
		width: 15
	}, {
		caption: 'Contract Period',
		type: 'number',
		width: 15
	}, {
		caption: 'Delivery Fee',
		type: 'number',
		width: 15
	}];

module.exports.ACH = [{
	caption: 'ABA NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'ACCOUNT NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'ADDENDA ADDRESS',
	type: 'string',
	width: 15
}, {
	caption: 'ADDENDA INVOICE',
	type: 'number',
	width: 15
}, {
	caption: 'ADDENDA MEMO',
	type: 'string',
	width: 15
}, {
	caption: 'ADDENDA PHONE',
	type: 'number',
	width: 15
}, {
	caption: 'ADDENDA ZIP CODE',
	type: 'number',
	width: 15
}, {
	caption: 'BATCH NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'CHECK NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'CHECKING ACCOUNT NUMBER',
	type: 'number',
	width: 15
}, {	
	caption: 'COMPANY CODE',
	type: 'number',
	width: 15
}, {
	caption: 'CURRENT AMOUNT DUE',
	type: 'number',
	width: 15
}, {
	caption: 'DESCRIPTION',
	type: 'string',
	width: 15
}, {
	caption: 'DISTRICT CODE',
	type: 'number',
	width: 15
}, {
	caption: 'FILE ID',
	type: 'number',
	width: 15
}, {
	caption: 'INVOICE NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'REAL TIME PAYMENT',
	type: 'string',
	width: 15
}, {
	caption: 'REASON CODE',
	type: 'string',
	width: 15
}, {
	caption: 'SEQUENCE NUMBER',
	type: 'string',
	width: 15
}, {
	caption: 'TOTAL AMOUNT DUE',
	type: 'number',
	width: 15
}, {
	caption: 'TRACE NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'TRANS DATE',
	type: 'string',
	width: 15
}, {
	caption: 'TRANSACTION AMOUNT',
	type: 'number',
	width: 15
}, {
	caption: 'TRANSACTION TYPE',
	type: 'string',
	width: 15
}, {
	caption: 'EZPAY ID',
	type: 'string',
	width: 15
}];


module.exports.onlineOrders = [{
	caption: 'ORDER NUMBER',
	type: 'number',
	width: 15
}, {
	caption: 'AMOUNT',
	type: 'number',
	width: 15
}, {
	caption: 'DATE',
	type: 'date',
	width: 15
}, {
	caption: 'QUANTITY',
	type: 'number',
	width: 15
}, {
	caption: 'DELIVERY DATE REQUESTED',
	type: 'date',
	width: 15
}, {
	caption: 'PICKUP DATE',
	type: 'date',
	width: 15
}, {
	caption: 'TYPE OF CONTAINER',
	type: 'string',
	width: 15
},{
	caption: 'CITY',
	type: 'string',
	width: 15
},{
	caption: 'STATE',
	type: 'string',
	width: 15
},{
	caption: 'POSTAL CODE',
	type: 'string',
	width: 15
},{
	caption: 'BLUE PAY REFERENCE NUMBER',
	type: 'string',
	width: 15
},{
	caption: 'BLUE PAY AUTH CODE',
	type: 'string',
	width: 15
},{
	caption: 'BUSINESS SIZE',
	type: 'number',
	width: 15
},{
	caption: 'FIRST NAME',
	type: 'string',
	width: 15
},{
	caption: 'LAST NAME',
	type: 'string',
	width: 15
},{
	caption: 'ADDRESS',
	type: 'string',
	width: 15
},{
	caption: 'PHONE NUMBER',
	type: 'string',
	width: 15
},{
	caption: 'EMAIL ADDRESS',
	type: 'string',
	width: 15
},{
	caption: 'OFFER CODE',
	type: 'string',
	width: 15
},{
	caption: 'ORDER TOTAL',
	type: 'number',
	width: 15
}];

module.exports.serviceRequest = [{
	caption: 'Address 1',
	type: 'string',
	width: 15
}, {
	caption: 'Address 2',
	type: 'string',
	width: 15
}, {
	caption: 'City',
	type: 'string',
	width: 15
}, {
	caption: 'State',
	type: 'string',
	width: 15
}, {
	caption: 'Zip Code',
	type: 'string',
	width: 15
}, {
	caption: 'First Name',
	type: 'string',
	width: 15
}, {
	caption: 'Last Name',
	type: 'string',
	width: 15
}, {
	caption: 'Email Address',
	type: 'string',
	width: 15
}, {
	caption: 'Phone Number',
	type: 'string',
	width: 15
}, {
	caption: 'Contact Method',
	type: 'string',
	width: 15
}, {
	caption: 'Confirmation Number',
	type: 'number',
	width: 15
}, {
	caption: 'Request Date',
	type: 'string',
	width: 15
}, {
	caption: 'Request Type',
	type: 'string',
	width: 15
}, {
	caption: 'Is Existing Customer Flag',
	type: 'string',
	width: 15
}, {
	caption: 'Is Existing User Flag',
	type: 'string',
	width: 15
}, {
	caption: 'CSR Mailbox',
	type: 'string',
	width: 15
}, {
	caption: 'WM ezPay ID',
	type: 'string',
	width: 15
}]