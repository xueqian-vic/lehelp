angular.module('starter.controllers', ['ngCookies'])

.run(function($rootScope) {
    $rootScope.currentuser = {id:'1',username:'xueqian123',nickname:'薛倩',password:'xq',avatar:'img/mike.png',coins:230,tele:'18859271251',createtime:'2016-05-21'};
    $rootScope.setting = {shake:true,ring:true};
  })

  .controller('registerCtrl', function($scope,$ionicLoading,$cookieStore,$location,User) {
    if($cookieStore.get('username') == undefined) {
      console.log('$cookieStore.username = ' + $cookieStore.get('username'));
      $scope.register = function () {
        var username = document.getElementById('username').value;
        var nickname = document.getElementById('nickname').value;
        var tele = document.getElementById('tele').value;
        var password = document.getElementById('password').value;
        var r_password = document.getElementById('r_password').value;
        var createtime = new Date();
        var newuser = {
          id: '111',
          username: username,
          password: password,
          avatar: '',
          tele: tele,
          coins: 10,
          createtime: createtime
        };

        $cookieStore.put('username', username);
        $cookieStore.put('nickname', nickname);
        $cookieStore.put('password', password);
        $cookieStore.put('avatar', 'img/mike.png');

        console.log($cookieStore.get('username'));
        console.log($cookieStore.get('nickname'));
        console.log($cookieStore.get('password'));
        console.log($cookieStore.get('avatar'));

        if (password.trim() == r_password.trim()) {
          // $scope.flag = User.add(newuser);

          $ionicLoading.show({
            template: "注册成功",
            duration: 1000
          });
          //
          location.href='index.html#/tab/helps';
          // $location.path('/tab/helps');
          // console.log($location.absUrl());
        } else {
          $ionicLoading.show({
            template: "两次密码不一致",
            duration: 1000
          });
        }
      }
    }else{
      location.href='index.html#/tab/helps';
      console.log($location.absUrl());
    }
  })


.controller('HelpsCtrl', function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookieStore,$http) {

  // $scope.helps = myHelps.all();
  // $scope.help = myHelps.get($stateParams.helpId);
  // $scope.help = Helps.get($stateParams.helpId);


      $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/p/1/session_id/111111').success(function(data){
        $scope.helps =  data.helps;
        // console.log($scope.helps);

        for (var i = 0; i < $scope.helps.length; i++) {
          if ($scope.helps[i].id == parseInt($stateParams.helpId)) {
            $scope.help = $scope.helps[i];
            console.log($scope.help);
          }
        }

      });

      $scope.show = function (helpId) {
        var hideSheet = $ionicActionSheet.show({
          cancelOnStateChange: true,
          cssClass: 'action_s',
          // titleText: "操作当前",
          buttons: [{text: "修改"}],
          buttonClicked: function (index) {           //修改求助信息
            return true;
          },
          cancelText: "取消",
          cancel: function () {
            return true;
          },
          destructiveText: "删除",
          destructiveButtonClicked: function () {    //删除求助信息

            $http.get('http://120.27.97.21/lehelp/index.php/home/Help/delete/session_id/111111',{params:{'helpId':helpId}}).success(function(data){
              console.log(data.status);
              if(data.status=='1'){
                $ionicLoading.show({
                  template: "删除成功",
                  duration:1000
                });
              }
            });

            //想实现，删除后help立即消失？
            $scope.helps.splice($scope.helps.indexOf($scope.help), 1);
            console.log($scope.helps);

            $location.path('/tab/myhelps');
            return true;
          }
        });
      };

      $scope.show2 = function (helpId) {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
          cancelOnStateChange: true,
          cssClass: 'action_s',
          // titleText: "操作当前",
          buttons: [
            {text: "帮助结束"},
          ],
          buttonClicked: function (index) {           //帮助完成，更新求助状态，账户余额增减
            var help = $scope.help;
            console.log('---------------');
            console.log(help);
            help.status = 1;
            var postData={
              userid:help.userid,
              helperId : help.helperId,
              detail : help.detail,
              coins : help.coins,
              image:help.image,
              status : '1'
            };
            $http.post('http://120.27.97.21/lehelp/index.php/home/Help/edit/session_id/111111',postData,{params:{'helpId':helpId}}).success(function(data){
              console.log(data);
              console.log(data.status);
              console.log('helpid---------'+helpId);
              if(data.status=='1'){
                $ionicLoading.show({
                  template: "求助已结束",
                  duration:1000
                });
              }
            });

            $timeout(function () {
              hideSheet();
            },1000);
          },
          cancelText: "取消",
          cancel: function () {
            console.log('执行了取消操作');
            return true;
          },

        });


      };

      //点击帮他按钮，求助条目状态更新
      $scope.helpHim=function (helpId,currentuserid) {
        $ionicPopup.confirm({
            title: "帮助提示",
            template: "你确定要帮他吗？",
            okText:"确定",
            cancelText:'取消',
          })
          .then(function(res) {
            if(res) {
              var help = myHelps.get(helpId);
              help.helperId = currentuserid;
              help.helptime = new Date();
              help.status = 0;
              myHelps.update(help);
              $ionicLoading.show({
                template: "感谢您的帮助，完成后请联系求助者！",
                duration:2000
              });
            } else {

            }
          });
      };

      //发布求助
      $scope.addHelp = function () {
        var detail = document.getElementById('detail').value;
        var image = document.getElementById('image').value;
        var coins = document.getElementById('coins').value;
        var userId = $rootScope.currentuser.id;

        $http.get('http://120.27.97.21/lehelp/index.php/home/Help/add/session_id/111111',{ cache: true }).success(function(data){
          $scope.secondhands =  data.secondhands;
          console.log($scope.secondhands);

          for (var i = 0; i < $scope.secondhands.length; i++) {
            if ($scope.secondhands[i].id == parseInt($stateParams.secondhandId)) {
              $scope.secondhand = $scope.secondhands[i];
              console.log($scope.secondhand);
            }
          }

        });

        $location.path('/tab/helps');
      };

      //下拉刷新
      var base = 1;
      $scope.doRefresh = function() {
        for(var i=0;i<10;i++,base++)
          $scope.helps.unshift();
          $scope.$broadcast("scroll.refreshComplete");
      };
})



.controller('SecondhandsCtrl', function($scope,$stateParams,$ionicLoading,$location,$http) {

  $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/index/p/1/session_id/111111',{ cache: true }).success(function(data){
    $scope.secondhands =  data.secondhands;
    console.log($scope.secondhands);

    for (var i = 0; i < $scope.secondhands.length; i++) {
      if ($scope.secondhands[i].id == parseInt($stateParams.secondhandId)) {
        $scope.secondhand = $scope.secondhands[i];
        console.log($scope.secondhand);
      }
    }

  });

  $scope.addSecondhand = function () {
    var detail = document.getElementById('detail').value;
    var image = document.getElementById('image').value;
    $ionicLoading.show({
      template: ""+detail+"",
      duration:1000
    });
    $location.path('/tab/secondhands');
  };
})



.controller('MessagesCtrl', function($scope,$location, $ionicPopup,$ionicLoading,Messages) {
  $http.get('http://120.27.97.21/lehelp/index.php/home/Message/index/session_id/111111',{params:{'userId':'1'}}).success(function(data){
    $scope.messages =  data.messages;
    console.log($scope.messages);

    // for (var i = 0; i < $scope.messages.length; i++) {
    //   if ($scope.messages[i].id == parseInt($stateParams.helpId)) {
    //     $scope.message = $scope.messages[i];
    //     console.log($scope.message);
    //   }
    // }

  });
  $scope.jump=function (helpId,isHelper,username,tele) {
    if(isHelper){
      $scope.showAlert = function() {
        $ionicPopup.alert({
          title: "帮助者信息",
          template: "<p>姓名："+username+"</p><p>联系方式："+tele+"</p>",
        });
      }
      $scope.showAlert();

    }else{

      $location.path('/tab/messages/'+helpId);
      console.log($location.absUrl());
    }
  }
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

});
