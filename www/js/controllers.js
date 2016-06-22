angular.module('starter.controllers', [])

.run(function($rootScope) {
    $rootScope.currentuser = {id:'123',username:'信息学院-薛倩',password:'xq',avatar:'img/mike.png',coins:230,tele:'18859271251',createtime:'2016-05-21'};
    $rootScope.setting = {shake:true,ring:true};
  })

.controller('HelpsCtrl', function($scope,$stateParams,myHelps) {
  $scope.helps = myHelps.all();
  $scope.help = myHelps.get($stateParams.helpId);
  $scope.helpOrcancel = function (helpId,userId) {
    // console.log(helperId);
  }
})

.controller('SecondhandsCtrl', function($scope,$stateParams,mySecondhands) {
  $scope.secondhands = mySecondhands.all();
  $scope.secondhand = mySecondhands.get($stateParams.secondhandId);
  $scope.withdraw=function () {
  }
})

.controller('MessagesCtrl', function($scope, Messages) {
  $scope.messages = Messages.all();
})

.controller('MyCtrl', function($scope,$ionicPopup,$location,$rootScope,$ionicLoading) {
  //提交反馈
  $scope.submitfeedback=function(feedbacktext,feedbacktele) {
    var feedbacktext = document.getElementById('feedbacktext').value;
    var feedbacktele = document.getElementById('feedbacktele').value;
    console.log(feedbacktext);
    console.log(feedbacktele);
    $ionicLoading.show({
      template: "感谢您的反馈",
      duration:1000
    });
    $location.path('/tab/my');

  };

  //查看本地相册
  $scope.getAllImages= function(){
    // Media.getAllMedia('image').get().$promise.then(
    //   function success(resp, headers) {
    //     $scope.allImages = resp;
    //     $scope.images = $scope.allImages.images;
    //   }, function err(httpResponse) {
    //     $scope.errorMsg = httpResponse.status;
    //   });
  };
  // $ionicModal.fromTemplateUrl("templates/my/oldpwd-modal.html", {
  //   scope: $scope,
  //   animation: "slide-in-up"
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  // $scope.openModal = function() {
  //   $scope.modal.show();
  // };
  // $scope.closeModal = function() {
  //   $scope.modal.hide();
  // };
  // $scope.updatepwd = function($oldpwd) {
  //   if(oldpwd==user.password){
  //     $location.path('#/tab/updatepwd');
  //   }else{
  //
  //   }
  // }

  //弹出输入提示框，验证原密码
  $scope.showPrompt = function(){
    $ionicPopup.prompt({
        title: "验证原密码",
        inputType:'password',
        inputPlaceholder:'输入您的原密码',
      cancelText:'取消',
      okText:'确定'
      })
      .then(function(res) {
        if(res.trim()==$rootScope.currentuser.password){
          $location.path('/tab/updatepwd');  //是 /tab/updatepwd 而不是 #/tab/updatepwd
          console.log($location.absUrl());
        }else{
          $ionicLoading.show({
            template: "原密码错误",
            duration:1000
          });
        }
      })
  }

  //修改密码
  $scope.submitnewpwd=function () {
    var newpwd = document.getElementById('newpwd').value;
    $rootScope.currentuser.password = newpwd;
    console.log($rootScope.currentuser.password);
    $ionicLoading.show({
      template: "密码设置成功",
      duration:1000
    });
    $location.path('/tab/setting');  //是 /tab/updatepwd 而不是 #/tab/updatepwd
  }

})
.controller('MyHelpsCtrl', function($scope,$stateParams,$ionicActionSheet, myHelps) {
  $scope.helps = myHelps.all();

  $scope.help = myHelps.get($stateParams.helpId);
  // $scope.userId='123';
  $scope.helpOrcancel = function (helpId, userId) {
    // console.log(helperId);
  };
  $scope.show = function () {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      cancelOnStateChange: true,
      cssClass: 'action_s',
      // titleText: "操作当前",
      buttons: [
        {text: "修改"},
      ],
      buttonClicked: function (index) {           //修改求助信息
        console.log('操作了第' + index + '个按钮');
        return true;
      },
      cancelText: "取消",
      cancel: function () {
        console.log('执行了取消操作');
        return true;
      },
      destructiveText: "删除",
      destructiveButtonClicked: function () {    //删除求助信息
        console.log('执行了删除操作');
        return true;
      }
    });
  };


})
.controller('MySecondhandsCtrl', function($scope,$stateParams,$ionicActionSheet,mySecondhands) {
  $scope.secondhands = mySecondhands.all();
  $scope.secondhand = mySecondhands.get($stateParams.secondhandId);
  $scope.withdraw=function (secondhandId) {};
  $scope.show = function () {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      cancelOnStateChange: true,
      cssClass: 'action_s',
      // titleText: "操作当前",
      buttons: [
        {text: "修改"},
        {text: "下架"},
      ],
      buttonClicked: function (index) {           //修改求助信息
        console.log('操作了第' + index + '个按钮');
        return true;
      },

      cancelText: "取消",
      cancel: function () {
        console.log('执行了取消操作');
        return true;
      },
      destructiveText: "删除",
      destructiveButtonClicked: function () {    //删除求助信息
        console.log('执行了删除操作');
        return true;
      }
    });
  };


});
