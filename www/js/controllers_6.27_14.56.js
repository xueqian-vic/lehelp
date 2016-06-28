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
      createtime:$cookieStore.get('createtime'),
      coins:$cookieStore.get('coins')
    };

    $rootScope.setting = {shake:true,ring:true};
    $rootScope.commentCount = 0;
})

//parent控制器
  .controller('mainCtrl',function ($scope,$rootScope,$timeout,$interval,$http) {   //监控实时刷新badge
    $interval(function () {
      var flag = true;
      $http.get('http://120.27.97.21/lehelp/index.php/home/User/msgcounts/session_id/111111',{params:{'userid':$rootScope.currentuser.id,'status':0}}).success(function(data) {
        $rootScope.commentCount = data.counts;

      });
    },2000);

    $scope.$broadcast('to-child', $rootScope.commentCount);

  })

  .controller('LoginCtrl',function ($scope,$ionicLoading,$cookieStore,$location,$rootScope,$http) {
    if($cookieStore.get('username') == undefined) {
      console.log('$cookieStore.username = ' + $cookieStore.get('username'));
      $scope.login = function () {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        if ((username.trim())&&(password.trim())) {
          var postData = {
            username: username,
            password: password
          };

          $http({
            method:'post',
            url:'http://120.27.97.21/lehelp/index.php/home/Login/dologin',
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
            if(req.status==-1){
              $ionicLoading.show({
                template: "用户名不存在",
                duration: 1000
              });
            }else if(req.status==1){
              $cookieStore.put('id', req.user.id);
              $cookieStore.put('username', req.user.username);
              $cookieStore.put('nickname', req.user.nickname);
              $cookieStore.put('tele', req.user.tele);
              $cookieStore.put('coins', req.user.coins);
              $cookieStore.put('avatar', req.user.avatar);
              console.log('req.user.avatar----'+req.user.avatar);

              $rootScope.currentuser = {
                id:$cookieStore.get('id'),
                username:$cookieStore.get('username'),
                nickname:$cookieStore.get('nickname'),
                tele:$cookieStore.get('tele'),
                avatar:$cookieStore.get('avatar'),
                coins:$cookieStore.get('coins')
              };

              console.log($rootScope.currentuser);
              $ionicLoading.show({
                template: "登陆成功",
                duration:1000
              });
              location.href='main.html#/tab/helps';
            }else{
              $ionicLoading.show({
                template: "密码错误",
                duration: 1000
              });
            }
          }).error(function (req) {
            console.log('=========post error=========');
          });
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

//注册登录控制器
  .controller('RegisterCtrl', function($scope,$ionicLoading,$cookieStore,$location,$rootScope,$http) {

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
              if(req.status==-2){
                $ionicLoading.show({
                  template: "当前用户名已被占用",
                  duration: 1000
                });
              }else if(req.status==1){
                $cookieStore.put('id', req.user.id);
                $cookieStore.put('username', req.user.username);
                $cookieStore.put('nickname', req.user.nickname);
                $cookieStore.put('tele', req.user.tele);
                $cookieStore.put('coins', req.user.coins);
                $cookieStore.put('avatar', +req.user.avatar);

                $rootScope.currentuser = {
                  id:$cookieStore.get('id'),
                  username:$cookieStore.get('username'),
                  nickname:$cookieStore.get('nickname'),
                  // password:$cookieStore.get('password'),
                  tele:$cookieStore.get('tele'),
                  avatar:$cookieStore.get('avatar'),
                  coins:$cookieStore.get('coins')
                };

                console.log($rootScope.currentuser);
                $ionicLoading.show({
                  template: "注册成功",
                  duration:1000
                });
                location.href='main.html#/tab/helps';
              }
            }).error(function (req) {
              console.log('=========post error=========');
            });
        } else {
          $ionicLoading.show({
            template: "两次密码不一致或为空",
            duration: 1000
          });
        }
      }
  })

  .controller('HelpDetailCtrl',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookieStore,$http) {
    //按id查找help
    $http.get('http://120.27.97.21/lehelp/index.php/home/Help/helpinfo',{params:{'helpid':$stateParams.helpid}}).success(function(data) {
      $scope.help = data.help;
      console.log('HelpDetailCtrl//按id查找help');
      console.log('$stateParams.helpid---'+$stateParams.helpid);
      console.log(data);
      $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments/session_id/111111', {params: {'helpid': $stateParams.helpid}}).success(function (responds) {
        $scope.comments = responds.comments;
      });
    });

    //提交评论
    $scope.submitComment = function (helpid,userid) {
      if(document.getElementById('detail_1')==null){
        var detail =document.getElementById('detail_2').value;
      }else{
        var detail =document.getElementById('detail_1').value;
      }
      var userid = userid;
      var commenterid =$rootScope.currentuser.id;
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

  })



  .controller('Tabhelp_Pushrefresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookieStore,$http) {
    //
    // var p = 1;
    // $scope.hasmore=true;
    // var run = false;
    // $scope.doRefresh = function(){
    //   console.log('执行下拉');
    //   //获取求助信息list
    //   $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/session_id/111111').success(function(data){
    //     $scope.helps =  data.helps;
    //     console.log('$scope.helps---');
    //     console.log($scope.helps);
    //     for (var i = 0; i < $scope.helps.length; i++) {
    //       if ($scope.helps[i].id == parseInt($stateParams.helpid)) {
    //         $scope.help = $scope.helps[i];
    //
    //         console.log(' $scope.help----');
    //         console.log($scope.help);
    //
    //         $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments/session_id/111111',{params:{'helpid':$stateParams.helpid}}).success(function(responds){
    //           $scope.comments =  responds.comments;
    //         });
    //       }
    //     }
    //   });
    //   $scope.hasmore=true;
    //   $scope.$broadcast('scroll.refreshComplete');
    // };
    //
    // $scope.loadMore = function(){
    //   console.log('执行上拉');
    //   if(!run) {
    //     console.log('进入run');
    //     run = true;
    //     if ($scope.helps != undefined) {
    //       $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index', {'p': p}).success(function (data) {
    //         run = false;
    //         console.log('p----' + p);
    //         console.log(data.helps);
    //         console.log($scope.helps);
    //         if (data.status == 1) {
    //           $scope.helps = $scope.helps.concat(data.helps);
    //           console.log($scope.helps);
    //           for (var i = 0; i < $scope.helps.length; i++) {
    //             if ($scope.helps[i].id == parseInt($stateParams.helpid)) {
    //               $scope.help = $scope.helps[i];
    //               $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments/session_id/111111', {params: {'helpid': $stateParams.helpid}}).success(function (responds) {
    //                 $scope.comments = responds.comments;
    //               });
    //             }
    //           }
    //         } else {
    //           console.log("结束");
    //           $scope.hasmore = false;
    //         }
    //       });
    //       p += 1;
    //     }
    //     $scope.$broadcast('scroll.infiniteScrollComplete');
    //   }
    //   // $scope.$broadcast('scroll.infiniteScrollComplete');
    // };


    $scope.hasmore=true;
    var run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
    var obj = {page:1};
    var results = chushihua(obj,1);

    $scope.doRefresh = function(){
      var obj_data = {page:1};
      var results = chushihua(obj_data,2);
      $scope.hasmore=true;
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function(){
      var old = $scope.helps;
      if(old!=undefined){
        var results = chushihua(obj,3);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    /* state:1初始化，2刷新，3加载更多 */
    function chushihua(obj_data,state){
      console.log('执行下拉');
      if(!run){
        run = true;
        $http({
          method:"POST",
          url:'http://120.27.97.21/lehelp/index.php/home/Help/index/p/'+obj_data.page+'/session_id/111111',
          data:obj_data,
          headers: {'Content-Type': 'application/json;charset=utf-8'},
          dataType:'JSON'
        }).success(function(data) {
          run = false;
          if (state==3) {
            if (data.status != 0){
              $scope.helps = $scope.helps.concat(data.helps);
              obj.page += 1;
            }else{
              console.log("结束");
              $scope.hasmore = false;
            }
          }else{
            $scope.helps = data.helps;
            obj.page = 2;
          }
        }).error(function(data, status) {

        });
      }
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
  };

  $scope.reply_hide=function () {
    $scope.show = true;
  };

  $scope.leftcoins = $rootScope.currentuser.coins;
  $scope.optData = [{text: '0乐币',value: 0},{text: '10乐币',value: 10},{text: '20乐币',value: 20},{text: '30乐币',value: 30},{text: '40乐币',value: 40},{text: '50乐币',value: 50}];

  //获取求助信息list
  $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/session_id/111111').success(function(data){
    $scope.helps =  data.helps;
    console.log('$scope.helps =  data.helps;');
    console.log($scope.helps );

  });

//按id查找help
  $http.get('http://120.27.97.21/lehelp/index.php/home/Help/helpinfo',{'helpid':$stateParams.helpid}).success(function(data) {
    console.log('//按id查找help');
    $scope.help = data.help;
    $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments/session_id/111111', {params: {'helpid': $stateParams.helpid}}).success(function (responds) {
      $scope.comments = responds.comments;
    });
  });



//上拉菜单：修改，取消，删除
      $scope.show1 = function (helpid) {
        var hideSheet = $ionicActionSheet.show({
          cancelOnStateChange: true,
          cssClass: 'action_s',
          // titleText: "操作当前",
          buttons: [{text: "修改"},{text: "取消求助"}],
          buttonClicked: function (index) {           //修改求助信息
            if(index==0){
              return true;
            }else if(index==1){
              var help = $scope.help;
              console.log('var help = $scope.help;');
              console.log($scope.help);
              help.status = 1;
              var postData = {
                userid: help.userid,
                helperId: help.helperId,
                detail: help.detail,
                coins: help.coins,
                image: help.image,
                status: '1'
              };

              $http({
                method: 'post',
                url: 'http://120.27.97.21/lehelp/index.php/home/Help/edit/session_id/111111',
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {'helpid': helpid},
                transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  }
                  return str.join("&");
                }
              }).success(function (req) {
                $ionicLoading.show({
                  template: "取消求助成功",
                  duration:1000
                });
              });

              return true;
            }
          },
          cancelText: "取消",
          cancel: function () {
            return true;
          },
        });
      };

//上拉菜单：帮助结束，帮助未完成，取消
      $scope.show2 = function (helpid) {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
          cancelOnStateChange: true,
          cssClass: 'action_s',
          // titleText: "操作当前",
          buttons: [
            {text: "帮助结束"},
            {text: "帮助未完成"}
          ],
          buttonClicked: function (index) {           //帮助完成，更新求助状态，账户余额增减
            if (index == 0) {
              var help = $scope.help;
              help.status = 1;
              var postData = {
                userid: help.userid,
                helperId: help.helperId,
                detail: help.detail,
                coins: help.coins,
                image: help.image,
                status: '1'
              };

              $http({
                method: 'post',
                url: 'http://120.27.97.21/lehelp/index.php/home/Help/edit/session_id/111111',
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {'helpid': helpid},
                transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  }
                  return str.join("&");
                }
              }).success(function (req) {
                //增加帮助者的金币数
                var postdata = {
                  userid: help.helperId,
                  usecoins: help.coins,
                  flag: 1
                };
                $http({
                  method: 'post',
                  url: 'http://120.27.97.21/lehelp/index.php/home/User/changecoins/session_id/111111',
                  data: postdata,
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj) {
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                  }
                }).success(function (req) {

                  $timeout(function () {
                    hideSheet();
                  }, 100);

                  $ionicLoading.show({
                    template: "帮助结束",
                    duration: 1000
                  });
                });

              });

            }else if(index==1){

              var postData = {
                userid: help.userid,
                helperId: help.helperId,
                detail: help.detail,
                coins: help.coins,
                image: help.image,
                status: '-1'
              };

              $http({
                method: 'post',
                url: 'http://120.27.97.21/lehelp/index.php/home/Help/edit/session_id/111111',
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {'helpid': helpid},
                transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  }
                  return str.join("&");
                }
              }).success(function (req) {
                $ionicLoading.show({
                  template: "请继续等待帮助",
                  duration: 1000
                });
              });
            }
          },
          cancelText: "取消",
          cancel: function () {
            console.log('执行了取消操作');
            return true;
          },
        });
      };


  //上拉菜单：删除，取消
  $scope.show3 = function (helpid) {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      cancelOnStateChange: true,
      cssClass: 'action_s',
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
              //修改help.status=1
              var postdata={'status':0,'helperid':$rootScope.currentuser.id,'helpid':helpid};
                $http({
                  method:'post',
                  url:'http://120.27.97.21/lehelp/index.php/home/Help/dohelp',
                  data:postdata,
                  headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj){
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                  }
                }).success(function(req){
                  if(req.status==1) {
                    var postData = {
                      detail: '愿意帮您',
                      userid: $scope.help.userid,
                      commenterid: $rootScope.currentuser.id,
                      helpid: helpid,
                      status: 0,
                      ishelper: 1
                    };
                    $http({
                      method: 'post',
                      url: 'http://120.27.97.21/lehelp/index.php/home/Message/add',
                      data: postData,
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                      transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                      }
                    }).success(function (req) {
                      if(req.status==1) {
                        console.log('评论成功');

                        $ionicLoading.show({
                          template: "感谢您的帮助，完成后请联系求助者！",
                          duration: 1000
                        });
                      }
                    });
                  }
                });
            }
          });
      };


      //发布求助
      $scope.addHelp = function () {
        var detail = document.getElementById('detail').value;
        var image = 'img/bike.jpg';
        // var image = document.getElementById('image').value;
        var coins = document.getElementById('coins').value;
        var userid = $rootScope.currentuser.id;
        var helperid = 0;
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
        console.log(postData);
        //添加求助
        $http({
          method:'post',
          url:'http://120.27.97.21/lehelp/index.php/home/Help/add',
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
          if(req.status==1) {
            console.log('addhelp is success');
            console.log(req);
            //减少求助者的金币数
            var postdata = {
              userid: $rootScope.currentuser.id,
              usecoins: coins,
              flag: -1
            };
            $http({
              method: 'post',
              url: 'http://120.27.97.21/lehelp/index.php/home/User/changecoins',
              data: postdata,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              transformRequest: function (obj) {
                var str = [];
                for (var p in obj) {
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
              }
            }).success(function (req) {
                if(req.status==1) {
                  console.log('subcoins is success');
                  console.log(req);
                  $rootScope.currentuser.coins = $rootScope.currentuser.coins - coins;
                  $ionicLoading.show({
                    template: "发布成功",
                    duration: 1000
                  });
                }
              });
          }
        });

        $location.path('/tab/helps');
      };

})


//二手专区控制器
.controller('SecondhandsCtrl', function($scope,$stateParams,$ionicLoading,$ionicActionSheet,$location,$rootScope,$http) {


  //获取二手信息list
  $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/index/session_id/111111').success(function(data){

    $scope.secondhands =  data.secondhands;
    console.log('进入我的函数----');
    for (var i = 0; i < $scope.secondhands.length; i++) {
      console.log('进入我的子--函数----');

      if ($scope.secondhands[i].id == parseInt($stateParams.secondhandid)) {
        $scope.secondhand = $scope.secondhands[i];

        console.log('$scope.secondhand----');
        console.log($scope.secondhand);
      }
    }

  });







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
              if ($scope.secondhands[i].id == parseInt($stateParams.secondhandid)) {
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
            if ($scope.secondhands[i].id == parseInt($stateParams.secondhandid)) {
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
  //发布二手
  $scope.addSecondhand = function () {

    var detail = document.getElementById('detail').value;
    // var image = document.getElementById('image').value;
    var image = 'img/bike.jpg';
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
    $scope.messages = data.messages;
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
  $scope.show = true;
  $scope.jump=function (id,helpid,ishelper,username,tele) {
  $scope.show = false;

  //消息被查看,message的status改为1
    $http.get('http://120.27.97.21/lehelp/index.php/home/Message/edit',{params:{'msgid':id,'status':1}}).success(function(data){});
    if(ishelper==1){
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

    $http.get('http://120.27.97.21/lehelp/index.php/home/Message/index/session_id/111111',{params:{'userid':$rootScope.currentuser.id}}).success(function(data){
      $scope.messages = data.messages;
    });

  }
})

.controller('MyCtrl', function($scope,$ionicPopup,$location,$rootScope,$ionicLoading,$http,$cookieStore) {
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

  $scope.logout = function () {
    $cookieStore.remove('username');
    $cookieStore.remove('nickname');
    $cookieStore.remove('tele');
    $cookieStore.remove('avatar');
    $cookieStore.remove('coins');
    location.href = 'index.html';
  }

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
          //验证密码
          $http({
            method:'post',
            url:'http://120.27.97.21/lehelp/index.php/home/User/checkpwd',
            data:{'userid':$rootScope.currentuser.id,'oldpassword':res.trim()},
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }
          }).success(function(req){
            if(req.status){
              console.log('success req.status true-----'+req.status);
              $location.path('/tab/updatepwd');  //是 /tab/updatepwd 而不是 #/tab/updatepwd



            }else{
              console.log('success req.status false-----'+req.status);
              $ionicLoading.show({
                template: "原密码错误",
                duration:1000
              });
            }
          }).error(function (req) {
            console.log('error req-----');
          });

      });
  }

  //修改密码
  $scope.submitnewpwd=function () {
    var newpwd = document.getElementById('newpwd').value.trim();
    var newpwd_r = document.getElementById('newpwd_r').value.trim();
    if((newpwd==newpwd_r) && (newpwd)){
      //修改密码
      $http({
        method:'post',
        url:'http://120.27.97.21/lehelp/index.php/home/User/editPwd/session_id/111111',
        data:{'newpassword':newpwd,'userid':$rootScope.currentuser.id},
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).success(function(req){

        console.log('修改密码req----'+req);

        if(req.status){
          $rootScope.currentuser.password = newpwd;
          $ionicLoading.show({
            template: "密码设置成功",
            duration:1000
          });
          $location.path('/tab/setting');  //是 /tab/updatepwd 而不是 #/tab/updatepwd
        }else {
          $ionicLoading.show({
            template: "success密码设置失败",
            duration:1000
          });
        }
      }).error(function (req) {
        $ionicLoading.show({
          template: "error密码设置失败",
          duration:1000
        });
      });
    }else{
      $ionicLoading.show({
        template: "两次密码不一致或为空",
        duration:1000
      });
    }




  }

});
