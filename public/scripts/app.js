var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate','ui.bootstrap']);

myApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/template/main.html',
			controller: 'MainController'
		})
		.when('/ACH', {
			templateUrl: 'views/template/ach.html',
			controller: 'ACHController'
		})
		.when('/commerce', {
			templateUrl: 'views/template/commerce.html',
			controller: 'CommerceController'
		})
		.when('/serviceRequest', {
			templateUrl: 'views/template/serviceRequest.html',
			controller: 'ServiceRequestController'
		})
		.when('/onlineOrder', {
			templateUrl: 'views/template/onlineOrder.html',
			controller: 'OnlineOrderController'
		})
		.when('/customReport', {
			templateUrl: 'views/template/customReportForm.html',
			controller: 'FormController'
		})
		.when('/successPage', {
			templateUrl: 'views/template/successPage.html'
		})
});

myApp.controller('MainController', ['$scope', '$log', function($scope, $log) {
	
}]);


myApp.controller('ACHController', ['$scope', '$log','$http', '$filter', '$q', function($scope, $log, $http, $filter, $q) {
	var defaultFileName = "";
	var deferred = $q.defer();
	
	$scope.today = function() {
		$scope.dt = $filter('date')(new Date(), 'MM-dd-yyyy');
	};
  	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};
	
	$scope.open = function($event) {
		$scope.status.opened = true;
	};	
	
	$scope.status = {
		opened: false
	};
	$scope.format = 'MM-dd-yyyy';
	
	$scope.generateACHReport = function(dt) {
		var selectedDate = $filter('date')(dt, $scope.format);	
		$scope.loading = true;	
		$http.get('http://localhost:3000/api/ACHDecline/' + selectedDate, {responseType: "arraybuffer"})
			.success(function(data, status, headers) {
				var type = headers('Content-Type');
				var disposition = headers('Content-Disposition');
				if (disposition) {
					var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
						if (match[1])
						defaultFileName = match[1];
					}
					defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
					var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
					saveAs(blob, defaultFileName);
					deferred.resolve(defaultFileName);
			})
			.finally(function() {
				$scope.loading = false;
			});			
	}
}]);

myApp.controller('ServiceRequestController', ['$scope', '$http', '$filter', '$q',function($scope, $http, $filter, $q) {
	var defaultFileName = "";
	var deferred = $q.defer();
	
	$scope.today = function() {
		$scope.startDate = new Date();
	};
  	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};
	
	$scope.openStart = function($event) {
		$scope.startStatus.opened = true;
	};	
	
	$scope.openEnd = function($event) {
		$scope.endStatus.opened = true;
	};
	
	$scope.format = 'MM-dd-yyyy';
	
	$scope.startStatus = {
		opened: false
	};
	
	
	$scope.endStatus = {
		opened: false
	};
	
	$scope.$watch('startDate', function(newValue) {
		$scope.minEndDate = newValue;	
	});
	
	$scope.generateServiceRequestReport = function() {
		var selectedStartDate = $filter('date')($scope.startDate, $scope.format);
		var selectedEndDate = $filter('date')($scope.endDate, $scope.format);
		
		$scope.loading = true;
		
		if(!$scope.startDate && !$scope.endDate) {
			alert("Please select from & to date");
			return;
		} else {
			$http.get('http://localhost:3000/api/serviceRequest/' + selectedStartDate + "/" + selectedEndDate, {responseType: "arraybuffer"})
				.success(function(data, status, headers) {
					var type = headers('Content-Type');
					var disposition = headers('Content-Disposition');
					if (disposition) {
						var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
						if (match[1])
							defaultFileName = match[1];
					}
					defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
					var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
					saveAs(blob, defaultFileName);
					deferred.resolve(defaultFileName);
				})
				.finally(function() {
					$scope.loading = false;
				});
		}
	}
	
}]);


myApp.controller('OnlineOrderController', ['$scope', '$http', '$filter', '$q', function($scope, $http, $filter, $q) {
	var defaultFileName = "";
	var deferred = $q.defer();
	
	$scope.today = function() {
		$scope.startDate = new Date();
	};
  	$scope.today();

	$scope.clear = function () {
		$scope.startDate = null;
		$scope.endDate = null;
	};
	
	$scope.openStart = function($event) {
		$scope.startStatus.opened = true;
	};	
	
	$scope.openEnd = function($event) {
		$scope.endStatus.opened = true;
	};
	
	$scope.format = 'MM-dd-yyyy';
	
	$scope.startStatus = {
		opened: false
	};
		
	$scope.endStatus = {
		opened: false
	};
	
	$scope.$watch('startDate', function(newValue) {
		$scope.minEndDate = newValue;	
	});
	
	$scope.generateOnlineOrderReport = function() {
		var selectedStartDate = $filter('date')($scope.startDate, $scope.format);
		var selectedEndDate = $filter('date')($scope.endDate, $scope.format);
		
		$scope.loading = true;
		
		if(!$scope.startDate || !$scope.endDate) {
			alert("Please select the from & to date");
			return;
		} else {
			$http.get('http://localhost:3000/api/onlineOrders/' + selectedStartDate + "/" + selectedEndDate, {responseType: "arraybuffer"})
				.success(function(data, status, headers) {
					var type = headers('Content-Type');
					var disposition = headers('Content-Disposition');
					if (disposition) {
						var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
						if (match[1])
							defaultFileName = match[1];
					}
					defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
					var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
					saveAs(blob, defaultFileName);
					deferred.resolve(defaultFileName);
				})
				.finally(function() {
					$scope.loading = false;
				});
		}
	}
}]);


myApp.controller('CommerceController', ['$scope', '$http', '$filter', '$q', function($scope, $http, $filter, $q) {
	$scope.commerceOptions = {
		"SMB": "SMB",
		"Curbside": "Curbside"
	}
		
	$scope.select = function(value) {
		$scope.category = value;		
	}
	
	$scope.selectSub = function(value) {
		$scope.subCategory = value;
	}
	$scope.$watch('category', function(value) {
		if(value) {
			$http.get('http://localhost:3000/api/commerceOptions/' + value)
				.success(function(response) {
					$scope.subCategories = response;
				})	
		}
	});	
	
	$scope.error = false;
	
	$scope.message = {};
	
	$scope.generateCommerceReport = function() {
		var defaultFileName = "";
		var deferred = $q.defer();
		$scope.loading = true;
		if(!$scope.category) {
			$scope.loading = false;
			$scope.error = true;
			$scope.message = "Please select category";
			return;
		}
		if($scope.category === 'SMB') {			
			if(!$scope.subCategory) {
				$scope.loading = false;
				$scope.error = true;
				$scope.message = "Please select Sub Category";
				return;
			}
			$http.get('http://localhost:3000/api/SMB/' + $scope.subCategory, {responseType: "arraybuffer"})
				.success(function(data, status, headers) {
					var type = headers('Content-Type');
					var disposition = headers('Content-Disposition');
					if (disposition) {
						var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
							if (match[1])
								defaultFileName = match[1];
						}
						defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
						var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
						saveAs(blob, defaultFileName);
						deferred.resolve(defaultFileName);
					})
					.finally(function() {
						$scope.loading = false;
					});
		}
	}
}]);


myApp.controller('FormController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.error = "";	
	
	$scope.submitRequest = function() {
		$http.post('http://localhost:3000/api/sendRequest', JSON.stringify($scope.request))
			.success(function(response) {console.log(response);
				if(response.status === 200) {
					console.log(" In response status");
					$location.path('/successPage');	
				} else if(response.status === 403) {
					$scope.error = "Error";
					$scope.errorMessage = response.message;
				}				
			}).error(function(response){
				$scope.error = "Error";				
			});
	}	
}]);

myApp.directive('modalResult', function() {	
	return {
		restrict: 'AE',
		templateUrl: 'views/template/modal.html',
		replace: true,
		scope: {
			errorMessage: "@",
			errorStatus: "="	
		},
		controller: ['$scope', function($scope) {
			$scope.close = function() {
				$scope.errorStatus = false;
			};
		}]
	}
});