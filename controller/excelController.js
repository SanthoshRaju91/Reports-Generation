var oracle = require('oracledb'); 
var nodeExcel=require('excel-export');
var config = require('../config.js');

function getBusTypeID (busType) {
	for(var i=0; i < config.busType.length; i++) {
		if(config.busType[i].name == busType) {
			return config.busType[i].value;
		}
	}
}

module.exports.ACHDecline = function(req, res) {
	console.log("/ACH/" + req.params.date);
	var conf = {};
	conf.cols = config.ACH;
	conf.rows = [];	    
    try {
        oracle.getConnection({
			user: config.ENV.user,
			password: config.ENV.password,
			connectString: config.ENV.connectString
		}, function(err, connection) {
			if(err) {
				console.log("Error: " + err);
                res.json({status: 500, message: "There is an error"});
			} else {                                
				connection.execute("SELECT P.ABA_NUMBER as \"ABA NUMBER\", P.ACCOUNT_NUMBER as \"ACCOUNT NUMBER\", P.ADDENDA_ADDRESS AS \"ADDENDA ADDRESS\", P.ADDENDA_INVOICE AS \"ADDENDA INVOICE\", P.ADDENDA_MEMO AS \"ADDENDA MEMO\" , P.ADDENDA_PHONE AS \"ADDENDA PHONE\" ,P.ADDENDA_ZIP_CODE AS \"ADDENDA ZIP CODE\", P.BATCH_NUMBER AS \"BATCH NUMBER\", P.CHECK_NUMBER AS \"CHECK NUMBER\", P.CHECKING_ACCOUNT_NO AS \"CHECKING ACCOUNT NUMBER\", P.COMPANY_CODE AS \"COMPANY CODE\", P.CURRENT_AMOUNT_DUE AS \"CURRENT AMOUNT DUE\", P.DESCRIPTION AS \"DESCRIPTION\", P.DISTRICT_CODE AS \"DISTRICT CODE\", P.FILE_ID AS \"FILE ID\", P.INVOICE_NUMBER AS \"INVOICE NUMBER\", P.REAL_TIME_PAYMENT AS \"REAL TIME PAYMENT\", P.REASON_CODE AS \"REASON CODE\", P.SEQUENCE_NUMBER AS \"SEQUENCE NUMBER\", P.TOTAL_AMOUNT_DUE AS \"TOTAL AMOUNT DUE\", P.TRACE_NUMBER AS \"TRACE NUMBER\", P.TRANS_DATE AS \"TRANS DATE\", P.TRANSACTION_AMOUNT AS \"TRANSACTION AMOUNT\", P.TRANSACTION_TYPE AS \"TRANSACTION TYPE\", P.WM_EZPAY_ID AS \"EZPAY ID\" FROM AR_FILE_BATCH_DETAIL p WHERE P.TRACE_NUMBER IN ( SELECT PR.PAY_RECONC_ID FROM PAY_RECONCILIATION pr WHERE TRUNC (PR.AUDIT_CREATE_DT) >= TO_DATE (:0, 'MM-DD-YYYY') AND PR.PAY_TYP = 'ACH' AND PR.PAY_ST = 5 AND PR.TXN_STATUS ='E' GROUP BY PR.PAY_RECONC_ID HAVING COUNT (PR.PAY_RECONC_ID) <= 1)", [req.params.date], {resultSet: true}, function(err1, result) {
					if(err1) {
                        res.json({status: 500, message: "There is an error"});
						console.log("Error in executing query : " + err1);                        
					} else {																			
						fetchRowAndPush(connection, result.resultSet);
					}				
				});
			}	
		});
        
        function fetchRowAndPush(connection, resultSet) {
            resultSet.getRow(function(err, row) {
               if(err) {
                    console.log("Error " + err);
                } else if(!row) {
                    console.log("No more rows.");														
                    var excelFile = new Buffer(nodeExcel.execute(conf), 'binary');
                    res.setHeader('Content-Type','application/vnd.openxmlformates');
                    res.setHeader("Content-Disposition","attachment;filename=" + "REPORT_ACH_DECLINE.xlsx");				
                    res.end(excelFile);
                } else {
                    conf.rows.push(row);
                    fetchRowAndPush(connection, resultSet);
                }
            });
        }
    }catch(error) {
        console.log(error);
    }		
}

module.exports.SMB = function(req, res) {
	console.log("/SMB/" + req.params.bus);
	var conf = {};
	conf.cols = config.curbside;
	conf.rows = [];
	var busType = getBusTypeID(req.params.bus);	
	if(busType) {		
		oracle.getConnection({
			user: config.ENV.user,
			password: config.ENV.password,
			connectString: config.ENV.connectString
		}, function(err, connection) {
			if(err) {
				console.log("Error: " + err);
				throw err;
			} else {
				connection.execute("select STATE.COUNTRY as \"Country\",STATE.NAME as \"Area Name\", POST.STATE_PROVINCE_CODE as \"Market Area\", POST.POSTAL_CITY as \"City\", POST.POSTAL_CODE as \"Postal code\", QA.QA_DESC as \"Business Type\", BSKU.NAME as \"Product Description\", SKU.FLAT_RATE as \"Flat Rate\", SKU.ENVIRONMENT_FEE as \"Environment Fee\" , SKU.FUEL_FEE as \"Fuel Fee\", SKU.CONTAINER_FEE as \"Container Fee\", SKU.REGULATORY_FEE_PERCENTAGE as \"RCR Fee\", SKU.ADMINISTRATIVE_FEE as \"Admin Fee\", SKU.CONTRACT_PERIOD as \"Contract Period\", SKU.DELIVERY_FEE as \"Delivery Fee\" from COMMERCE_ADMIN.WM_POSTAL_CODE post join COMMERCE_ADMIN.BLC_STATE state on STATE.ABBREVIATION=POST.STATE_PROVINCE_CODE join COMMERCE_ADMIN.BLC_SKU_AVAILABILITY aval on AVAL.LOCATION_ID=POST.LOCATION_ID join COMMERCE_ADMIN.BLC_SKU bsku on BSKU.SKU_ID=AVAL.SKU_ID and BSKU.AVAILABLE_FLAG='Y' join COMMERCE_ADMIN.WM_SKU sku on SKU.SKU_ID=BSKU.SKU_ID and SKU.PRICING_ALGORITHM='SMB' and SKU.DUMPSTERPRODUCT_PRODUCT_ID in (501, 502, 503, 504) and SKU.BUS_TYPE_ID in (:0, :1, :2) join COMMERCE_ADMIN.WM_QUES_ANSWER_VALUES qa on QA.QA_VALUE_ID=SKU.BUS_TYPE_ID where POST.STATE_PROVINCE_CODE is not null order by POST.POSTAL_CODE", [busType[0], busType[1], busType[2]], {resultSet: true}	, function(err1, result) {
					if(err1) {
						console.log("Error in executing query : " + err1);
						throw err1;
					} else {
						config.rows = fetchRowAndPush(connection, result.resultSet);									
					}				
				});
			}	
		});
		
		function fetchRowAndPush(connection, resultSet) {
			resultSet.getRow(function(err, row) {
				if(err) {
					console.log("Error " + err);
				} else if(!row) {
					console.log("No more rows.");
					var excelFile = new Buffer(nodeExcel.execute(conf), 'binary');
					res.setHeader('Content-Type','application/vnd.openxmlformates');
					res.setHeader("Content-Disposition","attachment;filename=" + "REPORT_SMB_" + req.params.bus.toUpperCase() + ".xlsx");				
					res.end(excelFile);
				} else {
					conf.rows.push(row);
					fetchRowAndPush(connection, resultSet);
				}
			});
		}
	}
}

module.exports.onlineOrder = function(req, res) {
	console.log("/onlineOrder/" + req.params.startDate + "/" + req.params.endDate);
	var conf = {};
	conf.cols = config.onlineOrders;
	conf.rows = [];
	oracle.getConnection({
			user: config.ENV.user,
			password: config.ENV.password,
			connectString: config.ENV.connectString
		}, function(err, connection) {
			if(err) {
				console.log("Error: " + err);
				throw err;
			} else {
				connection.execute("select ORD.ORDER_ID as \"ORDER NUMBER\", FFG.TOTAL as \"AMOUNT\", ORD.SUBMIT_DATE  as \"DATE\", OI.QUANTITY as \"QUANTITY\", WFFG.DELIVERY_DATE as \"DELIVERY DATE REQUESTED\", WFFG.PICKUP_DATE as \"PICKUP DATE\",concat(substr(BSKU.NAME, 1, 2), 'YD') as \"TYPE OF CONTAINER\", ADDR.CITY as \"CITY\", ADDR.STATE_PROV_REGION as \"STATE\", ADDR.POSTAL_CODE as \"POSTAL CODE\", PRI.REFERENCE_NUMBER as \"BLUE PAY REFERENCE NUMBER\",PRI.AUTHORIZATION_CODE as \"BLUE PAY AUTH CODE\", WFFG.BUS_SIZE_ID as \"BUSINESS SIZE\", ADDR.FIRST_NAME as \"FIRST NAME\", ADDR.LAST_NAME as \"LAST NAME\", ADDR.ADDRESS_LINE1 as \"ADDRESS\", ADDR.PRIMARY_PHONE as \"PHONE NUMBER\",ORD.EMAIL_ADDRESS as \"EMAIL ADDRESS\", WBO.OFFER_CODE as \"OFFER CODE\", ORD.ORDER_TOTAL AS \"ORDER TOTAL\" FROM COMMERCE_ADMIN.BLC_ORDER ord join COMMERCE_ADMIN.BLC_ORDER_PAYMENT op on OP.ORDER_ID=ORD.ORDER_ID and ORD.ORDER_STATUS='SUBMITTED' and ORD.SUBMIT_DATE >= to_date(:0, 'mm-dd-yyyy') and ORD.SUBMIT_DATE <= to_date(:1, 'mm-dd-yyyy') join COMMERCE_ADMIN.BLC_PAYINFO_ADDITIONAL_FIELDS paf on PAF.PAYMENT_ID=OP.PAYMENT_ID and PAF.FIELD_VALUE='Dumpster' join COMMERCE_ADMIN.BLC_PAYMENT_RESPONSE_ITEM pri on PRI.ORDER_PAYMENT_ID=OP.PAYMENT_ID join COMMERCE_ADMIN.BLC_FULFILLMENT_GROUP ffg on FFG.ORDER_ID=ORD.ORDER_ID join COMMERCE_ADMIN.BLC_FULFILLMENT_GROUP_ITEM ffgi on FFGI.FULFILLMENT_GROUP_ID=FFG.FULFILLMENT_GROUP_ID join COMMERCE_ADMIN.BLC_DISCRETE_ORDER_ITEM doi on DOI.ORDER_ITEM_ID=FFGI.ORDER_ITEM_ID join COMMERCE_ADMIN.BLC_ORDER_ITEM oi on OI.ORDER_ITEM_ID=DOI.ORDER_ITEM_ID and OI.ORDER_ID=ORD.ORDER_ID join COMMERCE_ADMIN.WM_CATEGORY cat on CAT.CATEGORY_ID=OI.CATEGORY_ID and CAT.CATEGORY_GROUP='Dumpster' join COMMERCE_ADMIN.BLC_SKU bsku on BSKU.SKU_ID=DOI.SKU_ID join COMMERCE_ADMIN.WM_FULFILLMENT_GROUP wffg on WFFG.FULFILLMENT_GROUP_ID=FFG.FULFILLMENT_GROUP_ID join COMMERCE_ADMIN.BLC_CUSTOMER bc on BC.CUSTOMER_ID=ORD.CUSTOMER_ID left join COMMERCE_ADMIN.BLC_FG_ADJUSTMENT bfa on BFA.FULFILLMENT_GROUP_ID=FFG.FULFILLMENT_GROUP_ID left join COMMERCE_ADMIN.WM_BUNDLED_OFFER_CODE_XREF wbx on WBX.OFFER_ID=BFA.OFFER_ID left join COMMERCE_ADMIN.WM_BUNDLED_OFFER_CODE wbo on WBO.BUNDLED_OFFER_CODE_ID=WBX.BUNDLED_OFFER_CODE_ID join COMMERCE_ADMIN.BLC_ADDRESS addr on ADDR.ADDRESS_ID=OP.ADDRESS_ID order by submit_date", [req.params.startDate, req.params.endDate], {resultSet: true}, function(err1, result) {
					if(err1) {
						console.log("Error in executing query : " + err1);
						throw err1;
					} else {																			
						fetchRowAndPush(connection, result.resultSet);
					}				
				});
			}	
		});
	function fetchRowAndPush(connection, resultSet) {
		resultSet.getRow(function(err, row) {
			if(err) {
				console.log("Error " + err);
			} else if(!row) {
				console.log("No more rows.");
				var excelFile = new Buffer(nodeExcel.execute(conf), 'binary');
				res.setHeader('Content-Type','application/vnd.openxmlformates');
				res.setHeader("Content-Disposition","attachment;filename=" + "ONLINE_ORDER_FROM_" + req.params.startDate + "_" + req.params.endDate + ".xlsx");				
					res.end(excelFile);
				} else {
					conf.rows.push(row);
					fetchRowAndPush(connection, resultSet);
				}
			});
		}
}


module.exports.serviceRequests = function(req, res) {
	console.log("/serviceRequest/" + req.params.startDate + "/" + req.params.endDate);
	var conf = {};
	conf.cols = config.serviceRequest;
	conf.rows = [];
	oracle.getConnection({
			user: config.ENV.user,
			password: config.ENV.password,
			connectString: config.ENV.connectString
		}, function(err, connection) {
			if(err) {
				console.log("Error: " + err);
				throw err;
			} else {
				connection.execute("select SR.ADDR_LINE1 as \"Address 1\", SR.ADDR_LINE2 as \"Address 2\", SR.CITY as \"City\",SR.STATE as \"State\", SR.ZIP_CODE as \"Zip Code\", SR.FIRST_NAME as \"First Name\", SR.LAST_NAME as \"Last Name\", SR.CONTACT_EMAIL as \"Email Address\", SR.CONTACT_PHONE as \"Phone Number\", DECODE(SR.CONTACT_METHOD, 'E', 'E-Mail', 'P', 'Phone', SR.CONTACT_METHOD) as \"Contact Method\", SR.REQ_CONFIRMATION_NO as \"Confirmation Number\",SR.REQUEST_DATE as \"Request Date\",SR.REQUEST_TYPE as \"Request Type\",SR.ISEXISTINGCUSTOMER as \"Is Existing Customer Flag\",SR.ISEXISTINGUSER as \"Is Existing User Flag\",SR.CSR_MAILBOX as \"CSR Mailbox\",SR.WM_ACCT_ID as \"WM ezPay ID\" from SERVICE_REQUEST sr where SR.AUDIT_CREATE_DT>to_date(:0,'mm-dd-yyyy') and  SR.AUDIT_CREATE_DT<to_date(:1,'mm-dd-yyyy') order by SR.AUDIT_CREATE_DT asc", [req.params.startDate, req.params.endDate], {resultSet: true}, function(err1, result) {
					if(err1) {
						console.log("Error in executing query : " + err1);
						throw err1;
					} else {																			
						fetchRowAndPush(connection, result.resultSet);
					}				
				});
			}	
		});
	function fetchRowAndPush(connection, resultSet) {
		resultSet.getRow(function(err, row) {
			if(err) {
				console.log("Error " + err);
			} else if(!row) {
				console.log("No more rows.");
				var excelFile = new Buffer(nodeExcel.execute(conf), 'binary');
				res.setHeader('Content-Type','application/vnd.openxmlformates');
				res.setHeader("Content-Disposition","attachment;filename=" + "SERVICE_REQUEST_FROM_" + req.params.startDate + "_" + req.params.endDate + ".xlsx");				
					res.end(excelFile);
				} else {
					conf.rows.push(row);
					fetchRowAndPush(connection, resultSet);
				}
			});
		}
}