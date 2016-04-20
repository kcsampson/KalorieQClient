
angular.module('app.controllers', ['ionic','ui.router','ionic-datepicker'])
.controller('main',function($scope,$state){
	
	var newState = $state.go('unauth');
	console.log('main going to unauth');
	//console.log( newState);

})
.controller('tabctrl',function($scope,$state){
	
	console.log('inside tab controller.');
	//console.log( newState);

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
				
				$state.go('mykalorieq');
				
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
		
		$scope.currentDate = new Date('2013-07-31 10:20');  // new Date();
		$scope.minDate = new Date(2010, 6, 1);
		$scope.maxDate = new Date(2016, 6, 31);
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
		$state.go('kqeditmeal');
		
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
			
			$state.go('mykalorieq',{},{reload : true });
		})
		.error( function(data, status, header, config){
			
			console.log("Error");
			console.log( data );
			console.log( status);
			
		});
			
			
		
	};
	
	
})
