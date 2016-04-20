// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kalorieq', ['ionic','ui.router','ionic-datepicker' ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.service('dataShare',function(){
	var data = {kqRoot : 
					'/kalorieq'
	  //'http://www.kalorieq.com/kalorieq.php5' 
	};
	
	data.getDateTimeFormat = function(){
		
	
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;

		
	};
	
	
	return data;
})
 
.controller('ChatsCtrl', function($scope) {

})  

.controller('AccountCtrl', function($scope) {

})

.controller('ChatDetailCtrl', function($scope) {

}) 
.controller('kqmain',function($scope,$http,$state,dataShare){
	console.log('kqmain top');
	if( !$scope.data){
		$scope.data = dataShare;
	}
	$scope.kqstats = '';
	
	
	$scope.data.userName = 'ksampson';
	$scope.data.userPassword = 'marker';
	
	$scope.login = function() {

		// Here we would login...
		
		var kreq = dataShare.kqRoot+'?kimbonic=kalorieqlogin&action=login'
					+'&username='+$scope.data.userName
					+'&userpass='+$scope.data.userPassword;
					
		$scope.kqstatus = 'Logging in...';  //kreq;
		$scope.kqtitle = 'KalorieQ Login';
		
		
		$http.get( kreq,
					{ responseType : "text"	}
		)
		.success(function (response ){
			console.log("KQ Login http success")
			$scope.kqstatus = 'Logged in';
			var x2js = new X2JS();
			var jsonData = x2js.xml_str2json(response);
			
			console.log('as json');
			console.log(jsonData);
			if ( !jsonData.kalorieq.error ){
				$scope.kqstatus = 'Logged in: '+jsonData.kalorieq.cookie.cookievalue;
				
				$scope.data.kalorieqcook = jsonData.kalorieq.cookie.cookievalue;
				
				$state.go('tab.mykalorieq');
				
				console.log('logged in... going to mykalorieqstate');
				
				
			} else {
				$scope.kqstatus = 'Login error: '+ jsonData.kalorieq.error
	
			}

		})
		.error( function (data, status, header, config) {
			
			console.log("KQ login error data:");
			console.log(data);
			console.log("KQ login error status:");
			console.log(status);
			console.log("KQ Login error header");
			console.log(header);
			
			$scope.kqstatus = 'Not Logged In';
		});
					
	
    };
	
})
 .controller('mykalorieq',function($scope,$state,$http,dataShare
									){
	$scope.data = dataShare;
	console.log('setting up mykalorieq ctrl');
	console.log($scope.data);
	$scope.kqstatus = 'inside mykalorieq';
	
	
	if ( !dataShare.selectedDateChanged ){
		
		dataShare.selectedDateChanged = function(){
			
			$scope.kalorieqExpandDay( dataShare.currentDate );
			
		}
		
		
	}
	
	if ( !$scope.currentDate  && !dataShare.currentDate ){
		
		$scope.currentDate = new Date(); //new Date('2013-07-31 10:20');  // new Date();
		$scope.minDate = new Date(2010, 6, 1);
		$scope.maxDate = new Date(2018, 6, 31);
	}
		
	if ( dataShare.currentDate ){
		
		$scope.currentDate = dataShare.currentDate;
	}
	
	

	$scope.datePickerCallback = function (val) {
		if (!val) {	
			console.log('Date not selected');
		} else {
			var simpleDate=val.getFullYear()+'-'+(val.getMonth() + 1) + '-' + val.getDate();
			$scope.kalorieqExpandDay(simpleDate);
		}
	};
	
	$scope.clickFoodPic = function(foodpic){
		
		console.log("meal selected");
		console.log(foodpic);
		dataShare.foodpic = foodpic;
		$state.go('tab.kqeditmeal');
		
	};
	

	$scope.takePhoto = function(foodpic){
		
		console.log("Going to camera");
	    console.log( navigator );
		var options = {
		  quality: 90,
		  destinationType: Camera.DestinationType.DATA_URL,
		  sourceType: Camera.PictureSourceType.CAMERA,
		  allowEdit: true,
		  encodingType: Camera.EncodingType.JPEG,
		  //targetWidth: 100,
		  //targetHeight: 100,
		 // popoverOptions: CameraPopoverOptions,
		  saveToPhotoAlbum: false,
		  correctOrientation:true
		};

		navigator.camera.getPicture(function(imageData) {
		 console.log("got a picture");
		 console.log(imageData);
		 
		 //fileKey, fileName, mimeType, params, headers, httpMethod
		 var fop = new FileUploadOptions("foodpicupload"
						 , imageData.split('\\').pop().split('/').pop()
						 ,"image/jpeg"
						 ,{  action       : 'upload'
						   , kalorieqcook : $scope.data.kalorieqcook 
						   , username     : $scope.data.userName
						   , userpass     : $scope.data.userPassword
						   , uploadguess  : '0'
						   , uploadtitle  : 'untitled' 
						   , uploaddatetime : dataShare.getDateTimeFormat() 
						   }
						 ,{}
						,'POST' );
						
		dataShare.currentDate = new Date();			
		
		var ft = new FileTransfer();
		 console.log("Upload Starting...");
		 
		 ft.upload(   imageData
					, dataShare.kqRoot
					, function( success){
						
						console.log("success uploading file");

						var x2js = new X2JS();
						var jsonData = x2js.xml_str2json(success.response);
						
						var kqmain = jsonData.kalorieq.kalorieqmain;

						dataShare.foodpic = kqmain;
						$state.go('kqeditmeal');
						
						navigator.camera.cleanup();
						
					}
					, function( error ){
						console.log("error uploading file");
						console.log(error);
					}
					, fop
					, true );
		 
		});
		
		console.log("upload started");
	
	};
	$scope.kalorieqExpandDay = function(day){
		
		if (!day ){
			
			day = $scope.currentDate.getFullYear()+'-'+($scope.currentDate.getMonth() + 1) + '-' + $scope.currentDate.getDate();
			
		}
		console.log("Loading date:"+day);
		var kreq = dataShare.kqRoot+'?kimbonic=kalorieqmyfood&action=expandDay'
					+'&exdate='+day
					+'&this=yes'
					+'&kalorieqcook='+$scope.data.kalorieqcook
					+'&username='+$scope.data.userName
					+'&userpass='+$scope.data.userPassword;
					
		$scope.kqstatus = 'Loading in...';  //kreq;
		$scope.kqtitle = 'KalorieQ';
		
		console.log( "requesting: "+kreq);
		$http.get( kreq,
					{ responseType : "text"
					}
		)
		.success(function (response ){
		
			console.log("kalorieqday total success");
			//console.log(response);
			
			var x2js = new X2JS();
			var jsonData = x2js.xml_str2json(response);
			
			console.log(jsonData);
			
			$scope.foodpics = jsonData.kalorieq.foodpic;
			
			if ( !$scope.foodpics.length ){
				
				$scope.foodpics = [];
				$scope.foodpics[0] = jsonData.kalorieq.foodpic;
			}
			
			console.log("loaded "+$scope.foodpics.length + " meals");

		}
		).error( function(data, status, header, config) {
			
			console.log("kalorieqday total error");
			console.log(data);
		});
		
	};
	$scope.kalorieqExpandDay();
    

})
.controller('kqeditmeal',function($scope,$state,$http,dataShare){
	
	$scope.foodpic = dataShare.foodpic;
	
	$scope.data = dataShare;
	
	$scope.currentDate = Date.parse( dataShare.foodpic.consumed_date);
	
	console.log("kqeditmeal currentDate="+$scope.currentDate );
	
	$scope.consumedDatePickerCallback = function (val) {
		if (!val) {	
			console.log('Date not selected');
		} else {
			var simpleDate=val.getFullYear()+'-'+(val.getMonth() + 1) + '-' + val.getDate();
			$scope.foodpic.consumed_date = simpleDate;
			console.log("editing date to: "+simpleDate );
		}
	};
	
	
	$scope.mealSave = function(){
		console.log('building kq http request');
		var kreq = dataShare.kqRoot+'/?kimbonic=kalorieqmyfood&action=saveUserFoodCrud'
		    +'&estimate='+$scope.foodpic.asserted_cals
			+'&descript='+encodeURIComponent($scope.foodpic.descript)
			+'&consumed_date='+$scope.foodpic.consumed_date
			+'&kalorieqid='+$scope.foodpic.kalorieqid
			+'&controlled=0'
			+'&kalorieqcook='+$scope.data.kalorieqcook
			+'&username='+$scope.data.userName
			+'&userpass='+$scope.data.userPassword;
			
		
		console.log( 'mealEditCrud call: '+kreq );
		
		$http.get( kreq, { responseType : "text"} )
		.success(function (response ){
			
			
			dataShare.selectedDateChanged( );
			
			$state.go('tab.mykalorieq',{},{reload : true });
		})
		.error( function(data, status, header, config){
			
			console.log("Error");
			console.log( data );
			console.log( status);
			
		});
			
			
		
	};
	
	
})

.controller('kqfavorites',function($scope,$state,$http,dataShare){
	
	$scope.foodpic = dataShare.foodpic;
	
	$scope.data = dataShare;
	
	$scope.clickToEatAgain = function( encore ){
		
	
		dataShare.taggedmeal = encore;
		
		dataShare.taggedmeal.Description = encore.descript + " ("+encore.finalized+" cals)";
		
		dataShare.taggedmeal.portion = 1;


/*		{
			  kalorieqid : encore.kalorieqid
			, portion : 1
			, descript : encore.descript
			, calories : ''
			, finalized : encore.finalized
			
		}; */
		
		$state.go('tab.kqeatagain',{},{reload : true });
		
		
	}
	
	
	$scope.loadFavorites = function(){
		
			console.log("Loading favorites");
		var kreq = dataShare.kqRoot+'?kimbonic=kalorieqencore&action=getTags'
					+'&kalorieqcook='+$scope.data.kalorieqcook
					+'&username='+$scope.data.userName
					+'&userpass='+$scope.data.userPassword;
					
		$scope.kqstatus = 'Loading encores..';  //kreq;
		$scope.kqtitle = 'KalorieQ';
		
		console.log( "requesting: "+kreq);
		$http.get( kreq,
					{ responseType : "text"
					}
		)
		.success(function (response ){
		
			console.log("kalorieqday total success");
			
			
			var x2js = new X2JS();
			var jsonData = x2js.xml_str2json(response);
			
			//console.log(jsonData);
			
			$scope.encores = jsonData.kalorieq.taggedmeal;
			
			console.log( "encore count="+$scope.encores.length );

		}
		).error( function(data, status, header, config) {
			
			console.log("kalorieqencore error");
			console.log(data);
		});
	
	};
	
	$scope.loadFavorites();
	
	
})
.controller('kqeatagain',function($scope,$state,$http,dataShare){
	
	$scope.taggedmeal = dataShare.taggedmeal;
	
	$scope.data = dataShare;
	
	console.log( $scope.taggedmeal);
	
	$scope.calculateCalories = function(){
		console.log("calculating cals portion="+$scope.taggedmeal.portion+"  x "+$scope.taggedmeal.finalized );
		$scope.taggedmeal.calories = $scope.taggedmeal.portion * $scope.taggedmeal.finalized;
	};
	
	$scope.mealSave = function(){
		// Save it through kimbonics...
		
		console.log("would be saving at this point...");
		
		
		
		var kreq = dataShare.kqRoot+'?kimbonic=kalorieqencore&action=eatMeal'
					+'&kalorieqcook='+$scope.data.kalorieqcook
					+'&username='+$scope.data.userName
					+'&userpass='+$scope.data.userPassword
					+'&portion='+$scope.taggedmeal.portion
					+'&consumed_datetime='+dataShare.getDateTimeFormat();
					
		
		console.log( "requesting: "+kreq);
		$http.get( kreq,
					{ responseType : "text"
					}
		)
		.success(function (response ){
		
		
			$state.go('tab.mykalorieq',{},{reload : true });
		});
		
	}
	
})
.config(function($stateProvider, $urlRouterProvider) {
$stateProvider

 // Set up an abstract state for the tabs directive.
   .state('tab', {
   url: "/tab",
   abstract: true,
   templateUrl: "templates/tabs.html"
 })
 // Each tab has its own nav history stack:
 .state('tab.login', {
   url: '/login',
   views: {
     'tab-login': {
       templateUrl: 'templates/tab-login.html',
       controller: 'kqmain'
     }
   }
 })
  .state('tab.mykalorieq', {
   url: '/mykalorieq',
   views: {
     'tab-mykalorieq': {
       templateUrl: 'templates/tab-mykalorieq.html',
       controller: 'mykalorieq'
     }
   }
 })
.state('tab.kqeditmeal', {
   url: '/kqeditmeal',
   views: {
     'tab-mykalorieq': {
       templateUrl: 'templates/tab-kqeditmeal.html',
       controller: 'kqeditmeal'
     }
   }
 })
  .state('tab.favorites', {
   url: '/favorites',
   views: {
     'tab-favorites': {
       templateUrl: 'templates/tab-favorites.html',
       controller: 'kqfavorites'
     }
   }
 })
  .state('tab.kqeatagain', {
   url: '/eatagain',
   views: {
     'tab-favorites': {
       templateUrl: 'templates/tab-kqeatagain.html',
       controller: 'kqeatagain'
     }
   }
 })
 .state('tab.chats', {
     url: '/chats',
     views: {
       'tab-chats': {
         templateUrl: 'templates/tab-chats.html',
         controller: 'ChatsCtrl'
       }
     }
   })

 .state('tab.account', {
   url: '/account',
   views: {
     'tab-account': {
       templateUrl: 'templates/tab-account.html',
       controller: 'AccountCtrl'
     }
   }
 });

 // If none of the above states are matched, use this as the fallback:
 $urlRouterProvider.otherwise('/tab/login');
})

