angular.module('starter.controllers', [])

.controller('HelpsCtrl', function($scope,Helps) {
  $scope.items = [
    {id:0},
    {id:1},
    {id:2}
  ];
  $scope.helps = Helps.all();

})

.controller('HelpDetailCtrl',function ($scope,$stateParams,Helps) {
  $scope.help = Helps.get($stateParams.helpId);
})

.controller('HelpCommentsCtrl',function ($scope,Helps) {

})
.controller('SecondhandsCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MyCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
