angular.module('app.routes', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
 $stateProvider
   .state('unauth', {
	   name: 'unauth',
		   cache : false,
     url: "/kalorieqlogin",
	 views: { 'tab-login' : {
				 templateUrl: "templates/tab-kalorieqlogin.html"
				, controller: 'kqmain' } }
   })
   .state('mykalorieq', { 
       name : 'mykalorieq',
		   cache : false,
	   url: "/mykalorieq",
	   views: { 'tab-mykalorieq' : {
				   templateUrl: "templates/tab-mykalorieq.html",
				   controller: 'mykalorieq'
	   } }
		})
	.state('kqeditmeal',{
		name : 'kqeditmeal',
		   cache : false,
		url  : '/kqeditmeal',
		views : { 'tab-kqeditmeal' : {
		templateUrl : 'templates/tab-kqeditmeal.html',
		controller : 'kqeditmeal' } }
	})
	.state('tab', {
	   url: "/tab",
	   cache : false,
	   abstract: true,
	   templateUrl: "templates/tabs.html"
	 });
 console.log('setting up states');
  var xxx = $urlRouterProvider.otherwise('/tab/kalorieqlogin');
  //console.log(xxx);
}
 );