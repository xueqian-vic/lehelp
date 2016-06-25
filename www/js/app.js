// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])    //注入starter这个模块，不然ng-app="starter"会报错，只能写""

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $cordovaPlugin.someFunction().then(success, error);
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {

  $httpProvider.defaults.transformRequest=function(obj){
    var str=[];
    for(var p in obj){
      str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
    }
    return str.join("&");
  };
  $httpProvider.defaults.headers.post={'Content-Type':'application/x-www-form-urlencoded'};

  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    // abstract: true,
    templateUrl: 'templates/tabs.html'
  })


  .state('tab.helps', {
    url: '/helps',
    views: {
      'tab-helps': {
        templateUrl: 'templates/helps/tab-helps.html',
        controller: 'HelpsCtrl'
      }
    }
  })

    .state('tab.help-detail', {
      url: '/helps/:helpId',
      views: {
        'tab-helps': {
          templateUrl: 'templates/helps/help-detail.html',
          controller: 'HelpsCtrl'
        }
      }
    })

    .state('tab.add-help', {
      url: '/add-help',
      views: {
        'tab-helps': {
          templateUrl: 'templates/helps/add-help.html',
          controller: 'HelpsCtrl'
        }
      }
    })

    .state('tab.secondhands', {
      url: '/secondhands',
      views: {
        'tab-secondhands': {
          templateUrl: 'templates/secondhands/tab-secondhands.html',
          controller: 'SecondhandsCtrl'
        }
      }
    })

    .state('tab.secondhands-detail', {
      url: '/secondhands/:secondhandId',
      views: {
        'tab-secondhands': {
          templateUrl: 'templates/secondhands/secondhand-detail.html',
          controller: 'SecondhandsCtrl'
        }
      }
    })

    .state('tab.add-secondhand', {
      url: '/add-secondhand',
      views: {
        'tab-secondhands': {
          templateUrl: 'templates/secondhands/add-secondhand.html',
          controller: 'SecondhandsCtrl'
        }
      }
    })

  .state('tab.messages', {
      url: '/messages',
      views: {
        'tab-messages': {
          templateUrl: 'templates/messages/tab-messages.html',
          controller: 'MessagesCtrl'
        }
      }
    })

    .state('tab.messageshelp-detail', {
      url: '/messages/:helpId',
      views: {
        'tab-messages': {
          templateUrl: 'templates/messages/help-detail.html',
          controller: 'HelpsCtrl'
        }
      }
    })

  .state('tab.my', {
    url: '/my',
    views: {
      'tab-my': {
        templateUrl: 'templates/my/tab-my.html',
        controller: 'MyCtrl'
      }
    }
  })

  .state('tab.myhelps', {
    url: '/myhelps',
    views: {
      'tab-my': {
        templateUrl: 'templates/my/my-helps.html',
        controller: 'HelpsCtrl'
      }
    }
  })
    .state('tab.myhelp-detail', {
      url: '/myhelps/:helpId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/myhelp-detail.html',
          controller: 'HelpsCtrl'
        }
      }
    })

  .state('tab.mysecondhands', {
    url: '/mysecondhands',
    views: {
      'tab-my': {
        templateUrl: 'templates/my/my-secondhands.html',
        controller: 'SecondhandsCtrl'
      }
    }
  })

    .state('tab.mysecondhands-detail', {
      url: '/mysecondhands/:secondhandId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/mysecondhand-detail.html',
          controller: 'SecondhandsCtrl'
        }
      }
    })

    .state('tab.setting', {
      url: '/setting',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/setting.html',
          controller: 'MyCtrl'
        }
      }
    })
    .state('tab.feedback', {
      url: '/feedback',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/feedback.html',
          controller: 'MyCtrl'
        }
      }
    })

    .state('tab.updatepwd', {
      url: '/updatepwd',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/updatepwd.html',
          controller: 'MyCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/helps');

})


  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function() {
          scope.$watch(attributes.hideTabs, function(value){
            $rootScope.hideTabs = value;
          });
        });

        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  });
