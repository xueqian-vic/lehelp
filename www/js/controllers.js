angular.module('starter.controllers', ['ngCookies'])

  //初始化数据
.run(function($rootScope,$cookieStore) {

    $rootScope.currentuser={
      id:$cookieStore.get('id'),
      username:$cookieStore.get('username'),
      nickname:$cookieStore.get('nickname'),
      password:$cookieStore.get('password'),
      tele:$cookieStore.get('tele'),
      avatar:$cookieStore.get('avatar'),
      createtime:$cookieStore.get('avatar'),
      coins:$cookieStore.get('coins')
    };

    $rootScope.setting = {shake:true,ring:true};
    $rootScope.commentCount = 2;
})

//parent控制器
  .controller('mainCtrl',function ($scope,$rootScope,$timeout,$interval) {   //监控实时刷新badge
    $interval(function () {
      $rootScope.commentCount = $rootScope.commentCount+1;
    },2000);

    $scope.$broadcast('to-child', $rootScope.commentCount);

  })

//注册登录控制器
  .controller('registerCtrl', function($scope,$ionicLoading,$cookieStore,$location,$rootScope,$http) {
    if($cookieStore.get('username') == undefined) {
      console.log('$cookieStore.username = ' + $cookieStore.get('username'));
      $scope.register = function () {
        var username = document.getElementById('username').value;
        var nickname = document.getElementById('nickname').value;
        var tele = document.getElementById('tele').value;
        var password = document.getElementById('password').value;
        var r_password = document.getElementById('r_password').value;

        if ((password.trim() == r_password.trim())&&(password.trim())) {
          var postData = {
            username: username,
            nickname:nickname,
            password: password,
            tele: tele,
            coins: 50
          };


          $http({
            method:'post',
            url:'http://120.27.97.21/lehelp/index.php/home/Login/register/session_id/111111',
            data:postData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }
          }).success(function(req){
            console.log('req=========');
            console.log(req);
            $ionicLoading.show({
              template: "评论成功",
              duration:1000
            });
          }).error(function (req) {
            console.log('errereq=========');
            console.log(req);
          });


          //
          // $http({
          //   method:'post',
          //   url:'http://120.27.97.21/lehelp/index.php/home/Login/register/session_id/111111',
          //   data:postData,
          //   headers:{'Content-Type': 'application/x-www-form-urlencoded'},
          //   transformRequest: function(obj) {
          //     var str = [];
          //     for(var p in obj){
          //       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          //     }
          //     return str.join("&");
          //   }
          // }).success(function(req){
          //   console.log('req=========');
          //   console.log(req);
          //   $cookieStore.put('id', req.user.id);
          //   $cookieStore.put('username', req.user.username);
          //   $cookieStore.put('nickname', req.user.nickname);
          //   $cookieStore.put('tele', req.user.tele);
          //   $cookieStore.put('coins', req.user.coins);
          //   $cookieStore.put('password', req.user.password);
          //   $cookieStore.put('avatar', req.user.avatar);
          //
          //   $rootScope.currentuser = {
          //     id:$cookieStore.get('id'),
          //     username:$cookieStore.get('username'),
          //     nickname:$cookieStore.get('nickname'),
          //     password:$cookieStore.get('password'),
          //     tele:$cookieStore.get('tele'),
          //     avatar:$cookieStore.get('avatar'),
          //     coins:$cookieStore.get('coins')
          //   };
          //
          //   $ionicLoading.show({
          //     template: "注册成功",
          //     duration:1000
          //   });
          //
          //   location.href='main.html#/tab/helps';
          //   console.log($location.absUrl());
          //
          // }).error(function (req) {
          //   console.log('errereq=========');
          //   console.log(req);
          // });

        } else {
          $ionicLoading.show({
            template: "两次密码不一致或为空",
            duration: 1000
          });
        }
      }
    }else{
      location.href='main.html#/tab/helps';
    }
  })

//求助专区控制器
.controller('HelpsCtrl', function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookieStore,$http) {

  $scope.show_1 = true;
  $scope.show_2 = false;
  $scope.showOrHide=function (commenterid,commenternickname) {
    $scope.show_1 =  !$scope.show_1;
    $scope.show_2 =  !$scope.show_2;
    $scope.replyto={
      commenterid:commenterid,
      commenternickname:commenternickname
    };
  }

  $scope.reply_hide=function () {
    $scope.show = true;
    console.log(' $scope.show='+ $scope.show);
  }

  $scope.leftcoins = $rootScope.currentuser.coins;
  $scope.optData = [{
    text: '0乐币',
    value: 0
  },{
    text: '10乐币',
    value: 10
  },{
    text: '20乐币',
    value: 20
  },{
    text: '30乐币',
    value: 30
  },{
    text: '40乐币',
    value: 40
  },{
    text: '50乐币',
    value: 50
  }];
//获取求助信息list
      $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/session_id/111111').success(function(data){
        $scope.helps =  data.helps;
        for (var i = 0; i < $scope.helps.length; i++) {
          if ($scope.helps[i].id == parseInt($stateParams.helpid)) {
            $scope.help = $scope.helps[i];
            $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments/session_id/111111',{params:{'helpid':$stateParams.helpid}}).success(function(data){
              console.log('$stateParams.helpid----------'+$stateParams.helpid);
              $scope.comments =  data.comments;
              console.log($scope.comments);
            });
          }
        }
      });

  //提交评论
  $scope.submitComment = function (helpid,userid) {
    console.log('document.getElementById(1)-------------'+document.getElementById('detail_1'));
    if(document.getElementById('detail_1')==null){
      var detail =document.getElementById('detail_2').value;
    }else{
      var detail =document.getElementById('detail_1').value;
    }
    var userid = userid;
    // var commenterid =$rootScope.currentuser.id;
    var commenterid =1;
    var helpid = helpid;
    var status = 0;
    var ishelper = 0;
    var postData={
      detail:detail,
      userid :userid,
      commenterid:commenterid,
      helpid : helpid,
      status:status,
      ishelper:ishelper
    };

    $http({
      method:'post',
      url:'http://120.27.97.21/lehelp/index.php/home/Message/add/session_id/111111',
      data:postData,
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      params:{'helpid':helpid},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj){
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).success(function(req){
      console.log(req);
      $ionicLoading.show({
        template: "评论成功",
        duration:1000
      });
    });
  }

//上拉菜单：修改，下架，取消，删除
      $scope.show = function (helpid) {
        var hideSheet = $ionicActionSheet.show({
          cancelOnStateChange: true,
          cssClass: 'action_s',
          // titleText: "操作当前",
          buttons: [{text: "修改"},{text: "下架"}],
          buttonClicked: function (index) {           //修改求助信息
            return true;
          },
          cancelText: "取消",
          cancel: function () {
            return true;
          },
          destructiveText: "删除",
          destructiveButtonClicked: function () {    //删除求助信息

            $http.get('http://120.27.97.21/lehelp/index.php/home/Help/delete/session_id/111111',{params:{'helpid':helpid}}).success(function(data){
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

//上拉菜单：帮助结束，取消
      $scope.show2 = function (helpid) {

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

            $http({
              method:'post',
              url:'http://120.27.97.21/lehelp/index.php/home/Help/edit/session_id/111111',
              data:postData,
              headers:{'Content-Type': 'application/x-www-form-urlencoded'},
              params:{'helpid':helpid},
              transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
              }
            }).success(function(req){

              $timeout(function () {
                hideSheet();
              },100);

              $ionicLoading.show({
                template: "帮助成功",
                duration:1000
              });
            });


          },
          cancelText: "取消",
          cancel: function () {
            console.log('执行了取消操作');
            return true;
          },
        });
      };

      //点击帮他按钮，求助条目状态更新
      $scope.helpHim=function (helpid) {
        $ionicPopup.confirm({
            title: "帮助提示",
            template: "你确定能帮他吗？",
            okText:"确定",
            cancelText:'取消',
          })
          .then(function(res) {
            if(res) {
              $http.get('http://120.27.97.21/lehelp/index.php/home/Help/dohelp/session_id /helpId/1/session_id/111111',{params:{'helpid':helpid,'helper':$rootScope.currentuser.id}}).success(function(data){
                console.log(data.status);
                if(data.status=='1'){
                  $ionicLoading.show({
                    template: "感谢您的帮助，完成后请联系求助者！",
                    duration:1000
                  });
                }
              });
            }
          });
      };

      //发布求助
      $scope.addHelp = function () {
        var detail = document.getElementById('detail').value;
        var image = document.getElementById('image').value;
        var coins = document.getElementById('coins').value;
        var userid = $rootScope.currentuser.id;
        var helperid = null;
        var helptime = null;
        var status = '-1';

        var postData = {
          userid:userid,
          helperid:helperid,
          helptime:helptime,
          detail:detail,
          image:image,
          coins:coins,
          status:status
        }

        $http({
          method:'post',
          url:'http://120.27.97.21/lehelp/index.php/home/Help/add/session_id/111111',
          data:postData,
          headers:{'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }
        }).success(function(req){
          $ionicLoading.show({
            template: "发布成功",
            duration:1000
          });
        });

        $location.path('/tab/helps');
      };

  $scope.hasmore=true;
  var run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
  console.log($scope.hasmore+"是否加载更多");
  var obj = {page:1};
  var results = chushihua(obj,1);
  console.log(results);

  $scope.doRefresh = function(){
    var obj_data = {page:1};
    var results = chushihua(obj_data,2);
    console.log(results);
    $scope.hasmore=true;
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMore = function(){
    console.log(obj.page);
    var old = $scope.helps;
    if(old!=undefined){
      var results = chushihua(obj,3);
      console.log(results);
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  /* state:1初始化，2刷新，3加载更多 */
  function chushihua(obj_data,state){
    if(!run){
      run = true;
      $http({
        method:"POST",
        url:'http://120.27.97.21/lehelp/index.php/home/Help/index/p/'+obj_data.page+'/session_id/111111',
        data:obj_data,
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType:'JSON'
      }).success(function(data, status) {
        console.log(status);
        run = false;
        if (state==3) {
          if (data.status != 0){
            $scope.helps = $scope.helps.concat(data.helps);
            for (var i = 0; i < $scope.helps.length; i++) {
              if ($scope.helps[i].id == parseInt($stateParams.helpId)) {
                $scope.help = $scope.helps[i];
                console.log($scope.help);
              }
            }
            obj.page += 1;
          }else{
            console.log("结束");
            $scope.hasmore = false;
          }
        }else{
          $scope.helps = data.helps;
          for (var i = 0; i < $scope.helps.length; i++) {
            if ($scope.helps[i].id == parseInt($stateParams.helpId)) {
              $scope.help = $scope.helps[i];
              console.log($scope.help);
            }
          }
          console.log($scope.helps);
          obj.page = 2;
        }
      }).error(function(data, status) {

      });
    }
  }
})


//二手专区控制器
.controller('SecondhandsCtrl', function($scope,$stateParams,$ionicLoading,$ionicActionSheet,$location,$rootScope,$http) {
  $scope.hasmore=true;
  var run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
  console.log($scope.hasmore+"是否加载更多");
  var obj = {page:1};
  var results = chushihua(obj,1);
  console.log(results);

  $scope.doRefresh = function(){
    var obj_data = {page:1};
    var results = chushihua(obj_data,2);
    console.log(results);
    $scope.hasmore=true;
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMore = function(){
    console.log(obj.page);
    var old = $scope.secondhands;
    if(old!=undefined){
      var results = chushihua(obj,3);
      console.log(results);
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  /* state:1初始化，2刷新，3加载更多 */
  function chushihua(obj_data,state){
    if(!run){
      run = true;
      $http({
        method:"POST",
        url:'http://120.27.97.21/lehelp/index.php/home/SecondHand/index/p/'+obj_data.page+'/session_id/111111',
        data:obj_data,
        // headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType:'JSON'
      }).success(function(data, status) {
        console.log(status);
        run = false;
        if (state==3) {
          if (data.status != 0){
            $scope.secondhands = $scope.secondhands.concat(data.secondhands);
            for (var i = 0; i < $scope.secondhands.length; i++) {
              if ($scope.secondhands[i].id == parseInt($stateParams.secondhandId)) {
                $scope.secondhand = $scope.secondhands[i];
                console.log($scope.secondhand);
              }
            }
            obj.page += 1;
          }else{
            console.log("结束");
            $scope.hasmore = false;
          }
        }else{
          $scope.secondhands = data.secondhands;
          for (var i = 0; i < $scope.secondhands.length; i++) {
            if ($scope.secondhands[i].id == parseInt($stateParams.secondhandId)) {
              $scope.secondhand = $scope.secondhands[i];
              console.log($scope.secondhand);
            }
          }
          console.log($scope.secondhands);
          obj.page = 2;
        }
      }).error(function(data, status) {

      });
    }
  };



  $scope.serverSideList = [
    { text: "我有", value: "1" },
    { text: "想要", value: "0" }
  ];
$scope.defaultselect='1';
  //发布求助
  $scope.addSecondhand = function () {

    var detail = document.getElementById('detail').value;
    var image = document.getElementById('image').value;
    var flag = null;
    var userid = $rootScope.currentuser.id;
    var status = '0';

    var temp = document.getElementsByName("group");
    for(var i=0;i<temp.length;i++)
    {
      if(temp[i].checked){
        flag = temp[i].value;
      }
    }
    var postData = {
      userid:userid,
      detail:detail,
      image:image,
      flag:flag,
      status:status
    };

    $http({
      method:'post',
      url:'http://120.27.97.21/lehelp/index.php/home/SecondHand/add/session_id/111111',
      data:postData,
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj){
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).success(function(req){
      $ionicLoading.show({
        template: "发布成功",
        duration:1000
      });
    });

    $location.path('/tab/secondhands');
  };



  $scope.show = function (secondhandid) {
    var hideSheet = $ionicActionSheet.show({
      cancelOnStateChange: true,
      cssClass: 'action_s',
      // titleText: "操作当前",
      buttons: [{text: "修改"},{text: "下架"}],
      buttonClicked: function (index) {           //修改求助信息
        if(index==0){
          return true;
        }else if(index==1){
          var secondhand = $scope.secondhand;
          console.log('---------------');
          console.log(secondhand);
          secondhand.status = 1;
          var postData={
              id:secondhand.id,
              detail:secondhand.detail,
              userid:secondhand.userid,
              image:secondhand.image,
              status:1,
              flag:secondhand.flag
        };

          $http({
            method:'post',
            url:'http://120.27.97.21/lehelp/index.php/home/SecondHand/edit/session_id/111111',
            data:postData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            params:{'secondhandid':secondhandid},
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }
          }).success(function(req){
            $ionicLoading.show({
              template: "下架成功",
              duration:1000
            });
          });
        }
        return true;
      },
      cancelText: "取消",
      cancel: function () {
        return true;
      },
      destructiveText: "删除",
      destructiveButtonClicked: function () {    //删除求助信息

        $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/delete/session_id/111111',{params:{'secondhandid ':secondhandid }}).success(function(data){
          console.log(data.status);
          if(data.status=='1'){
            $ionicLoading.show({
              template: "删除成功",
              duration:1000
            });
          }
        });

        //想实现，删除后help立即消失？
        $scope.secondhands.splice($scope.secondhands.indexOf($scope.secondhand), 1);
        console.log($scope.secondhands);

        $location.path('/tab/myhelps');
        return true;
      }
    });
  };

})



.controller('MessagesCtrl', function($scope,$location, $ionicPopup,$ionicLoading,$rootScope,$http) {

  $http.get('http://120.27.97.21/lehelp/index.php/home/Message/index/session_id/111111',{params:{'userid':$rootScope.currentuser.id}}).success(function(data){
    $scope.messages =  data.messages;
    console.log($scope.messages);
  });

  // setTimeout(function () {
  //   $scope.$apply(function () {
  //     $rootScope.commentCount = $rootScope.commentCount+1;
  //
  //   });
  // },2000);


  // $scope.commentstatus = true;
  //
  // $scope.$watch($scope.commentstatus,function (newVal,oldVal) {
  //   $rootScope.commentCount = $scope.commentstatus==true? $rootScope.commentCount+1:$rootScope.commentCount;
  // });

  // $scope.$on('to-child', function(e, d) {
  //   console.log('关我毛事');
  //   console.log('关我毛事'+d);
  // });

  // $timeout(function () {
  //   $rootScope.commentCount = $rootScope.commentCount+2;
  // },3000);
  // $scope.$emit('to-parent', $rootScope.commentCount);

  $scope.jump=function (helpid,ishelper,username,tele) {
    if(ishelper){
      $scope.showAlert = function() {
        $ionicPopup.alert({
          title: "帮助者信息",
          template: "<p>姓名："+username+"</p><p>联系方式："+tele+"</p>",
        });
      }
      $scope.showAlert();

    }else{

      $location.path('/tab/messages/'+helpid);
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
        }else{
          $ionicLoading.show({
            template: "原密码错误",
            duration:1000
          });
        }
      });
  }

  //修改密码
  $scope.submitnewpwd=function () {
    var newpwd = document.getElementById('newpwd').value.trim();
    var newpwd_r = document.getElementById('newpwd_r').value.trim();
    if((newpwd==newpwd_r) && (newpwd)){
      $rootScope.currentuser.password = newpwd;


      //修改密码



      $ionicLoading.show({
        template: "密码设置成功",
        duration:1000
      });
      $location.path('/tab/setting');  //是 /tab/updatepwd 而不是 #/tab/updatepwd
    }else{
      $ionicLoading.show({
        template: "两次密码不一致或为空",
        duration:1000
      });
    }




  }

});
