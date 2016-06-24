angular.module('starter.controllers', ['ngResource'])

.run(function($rootScope) {
    $rootScope.currentuser = {id:'123',username:'信息学院-薛倩',password:'xq',avatar:'img/mike.png',coins:230,tele:'18859271251',createtime:'2016-05-21'};
    $rootScope.setting = {shake:true,ring:true};
  })

  .controller('registerCtrl', function($scope,$ionicLoading,$location,User) {
    $scope.register = function () {
      var username = document.getElementById('username').value;
      var tele = document.getElementById('tele').value;
      var password = document.getElementById('password').value;
      var r_password = document.getElementById('r_password').value;
      var createtime = new Date();
      var newuser = {id:'111',username:username,password:password,avatar:'',tele:tele,coins:10,createtime:createtime};

      if(password.trim()==r_password.trim()){
        $scope.flag = User.add(newuser);


        // var expireDate = new Date();
        // expireDate.setDate(expireDate.getDate() + 1);
        // Setting a cookie

        // $cookieStore.put('newuser', {id:'111',username:username,password:password,avatar:'',tele:tele,coins:10,createtime:createtime});
        // $cookieStore.put('name', 'xueqian');
        //
        // var xx = $cookieStore.get('name');
        // console.log('昵称是'+xx);


        $ionicLoading.show({
          template: "注册成功",
          duration:1000
        });
        location.href='index.html#/tab/helps';
        // $location.path('/tab/helps');
        console.log($location.absUrl());
      }else{
          $ionicLoading.show({
            template: "两次密码不一致",
            duration:1000
          });
      }
    }
  })

.controller('HelpsCtrl', function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$rootScope,$http,myHelps,Helps) {

  // $scope.helps = myHelps.all();
  // $scope.help = myHelps.get($stateParams.helpId);


  // console.log('2------'+Helps.all());
  // $scope.d = Helps.all();

  // $scope.help = Helps.get($stateParams.helpId);


  $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/p/1/session_id/111111',{ cache: true }).success(function(data){
    var hps =  data.helps;

    // var helps = {
    //   id:hps.id,
    //   detail:hps.detail,
    //   coins:hps.coins,
    //   helperId:hps.helperId,
    //   createtime:'2016-05-22',
    //   status:1,
    //   image:null,
    //   helptime:'2016-05-22',
    //   user:{
    //     id:'103',
    //     username:'信息学院-103',
    //     avatar:'img/mike.png',
    //     tele: '18859271251',
    //   },
    // }

    $scope.helps = hps;

    for (var i = 0; i < helps.length; i++) {
      if (helps[i].id == parseInt($stateParams.helpId)) {
        $scope.help = helps[i];
        console.log($scope.help);
      }
    }

  });





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


    // var obj = $resource('http://120.27.97.21/lehelp/index.php/home/Help/add/session_id/111111');
    // $scope.data=obj.save({userId:userId,detail:detail,image:image,coins:coins},function(data){
    //
    //   console.log(data);
    //
    //   console.log(data.name);
    //
    //
    // },function(error){
    //
    //   console.log(error);
    //
    // });

    // $scope.addHelp = function(detail,image,coins,userId){
    //   addhelp.save(
    //     {
    //       detail:detail,
    //       image:image,
    //       coins:coins,
    //       userId:userId,
    //     },
    //     function(){
    //       console.log('post sent');
    //     }
    //   );
    // };

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

.controller('SecondhandsCtrl', function($scope,$stateParams,$ionicLoading,$location,mySecondhands) {
  $scope.secondhands = mySecondhands.all();
  $scope.secondhand = mySecondhands.get($stateParams.secondhandId);

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
  $scope.messages = Messages.all();
  // $scope.help = myHelps.get($stateParams.helpId);
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

})
.controller('MyHelpsCtrl', function($scope,$stateParams,$ionicActionSheet,$ionicLoading,$location, myHelps,User) {
  $scope.helps = myHelps.all();

  $scope.help = myHelps.get($stateParams.helpId);
  // $scope.userId='123';
  $scope.helpOrcancel = function (helpId, userId) {
    // console.log(helperId);
  };
  $scope.show = function (helpId) {

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
        myHelps.delete($scope.help);
        $ionicLoading.show({
          template: "删除成功",
          duration:1000
        });
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
        var help = myHelps.get(helpId);
        help.status = 1;
        myHelps.update(help);
        console.log(help);


        var user = User.get(help.user.id);
        User.update(user);
        user.coins =user.coins - help.coins;
        User.update(user);
        console.log(user);



        var helper = User.get(help.helperId);
        helper.coins =helper.coins + help.coins;
        User.update(helper);
        console.log(helper);


        return true;
      },
      cancelText: "取消",
      cancel: function () {
        console.log('执行了取消操作');
        return true;
      },
    });
  };


})
.controller('MySecondhandsCtrl', function($scope,$stateParams,$ionicLoading,$ionicActionSheet,$location,mySecondhands) {
  $scope.secondhands = mySecondhands.all();
  $scope.secondhand = mySecondhands.get($stateParams.secondhandId);
  $scope.withdraw=function (secondhandId) {
    var sh = mySecondhands.get(secondhandId);
    sh.status = 1;
    mySecondhands.update(sh);
  };
  $scope.show = function (secondhandId) {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      cancelOnStateChange: true,
      cssClass: 'action_s',
      // titleText: "操作当前",
      buttons: [
        {text: "下架"},
        // {text: "修改"},
      ],
      buttonClicked: function (index) {           //下架
        console.log('操作了第' + index + '个按钮');
        if(index==0){
          $scope.withdraw(secondhandId);
          $ionicLoading.show({
            template: "下架成功",
            duration:1000
          });
        }
        // else if(index==1){  //修改
        //   // mySecondhands.update($scope.secondhand);
        // }

        return true;
      },

      cancelText: "取消",
      cancel: function () {
        // console.log('执行了取消操作');
        return true;
      },
      destructiveText: "删除",
      destructiveButtonClicked: function () {    //删除求助信息
        mySecondhands.delete($scope.secondhand);
        $ionicLoading.show({
          template: "删除成功",
          duration:1000
        });
        $location.path('/tab/mysecondhands');
        return true;
      }
    });
  };


});
