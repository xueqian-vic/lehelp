angular.module('starter.controllers', ['ngCookies'])

  //初始化数据
.run(function($rootScope,$cookies) {

    $rootScope.currentuser={
      id:$cookies.get('id'),
      username:$cookies.get('username'),
      nickname:$cookies.get('nickname'),
      tele:$cookies.get('tele'),
      avatar:$cookies.get('avatar'),
      createtime:$cookies.get('createtime'),
      coins:$cookies.get('coins')
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
//登录
  .controller('LoginCtrl',function ($scope,$ionicLoading,$cookies,$location,$rootScope,$http) {
    if($cookies.get('username') == undefined) {
      console.log('$cookies.username = ' + $cookies.get('username'));
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

              var expireDate = new Date();
              expireDate.setDate(expireDate.getDate() + 10);
              // Setting a cookie

              $cookies.put('id', req.user.id ,{'expires': expireDate});
              $cookies.put('username', req.user.username,{'expires': expireDate});
              $cookies.put('nickname', req.user.nickname,{'expires': expireDate});
              $cookies.put('tele', req.user.tele,{'expires': expireDate});
              $cookies.put('coins', req.user.coins,{'expires': expireDate});
              $cookies.put('avatar', req.user.avatar,{'expires': expireDate});

              $rootScope.currentuser = {
                id:$cookies.get('id'),
                username:$cookies.get('username'),
                nickname:$cookies.get('nickname'),
                tele:$cookies.get('tele'),
                avatar:$cookies.get('avatar'),
                coins:$cookies.get('coins')
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
//注册
  .controller('RegisterCtrl', function($scope,$ionicLoading,$cookies,$location,$rootScope,$http) {

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
                $cookies.put('id', req.user.id);
                $cookies.put('username', req.user.username);
                $cookies.put('nickname', req.user.nickname);
                $cookies.put('tele', req.user.tele);
                $cookies.put('coins', req.user.coins);
                $cookies.put('avatar', +req.user.avatar);

                $rootScope.currentuser = {
                  id:$cookies.get('id'),
                  username:$cookies.get('username'),
                  nickname:$cookies.get('nickname'),
                  // password:$cookies.get('password'),
                  tele:$cookies.get('tele'),
                  avatar:$cookies.get('avatar'),
                  coins:$cookies.get('coins')
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

  .controller('HelpDetailCtrl',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {

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

    //按id查找help
    $http.get('http://120.27.97.21/lehelp/index.php/home/Help/helpinfo',{params:{'helpid':$stateParams.helpid}}).success(function(data) {
      if(data.status==1) {
        $scope.help = data.help;
        $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments', {params: {'helpid': $stateParams.helpid}}).success(function (responds) {
          if(responds.status==1){
            $scope.comments = responds.comments;
          }

        });
      }else{
        $ionicLoading.show({
          template: "该求助不存在，请刷新",
          duration:1000
        });
      }
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

  })
  .controller('HelpDetail_Refresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {

    $scope.doRefresh = function () {
      $http.get('http://120.27.97.21/lehelp/index.php/home/Help/helpinfo',{params:{'helpid':$scope.help.id}}).success(function(data) {
        if (data.status==1){
          $scope.help = data.help;
          $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments', {params: {'helpid': $scope.help.id}}).success(function (responds) {
            if (responds.status == 1) {
              $scope.comments = responds.comments;
              $scope.$broadcast('scroll.refreshComplete');
            }
          });
        }
      });

    }
  })
  .controller('Helps_Refresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {
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

          $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/p/'+obj_data.page).success(function(data){
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
          });
        }
      }
    })
  //求助专区控制器
  .controller('HelpsCtrl', function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http,$ionicHistory) {
    console.log($rootScope.currentuser);
  $scope.optData = [{text: '0乐币',value: 0},{text: '10乐币',value: 10},{text: '20乐币',value: 20},{text: '30乐币',value: 30},{text: '40乐币',value: 40},{text: '50乐币',value: 50}];

      //获取求助信息list
    $http.get('http://120.27.97.21/lehelp/index.php/home/Help/index/session_id/111111').success(function(data){
    $scope.helps =  data.helps;
  });

    //修改求助
    $scope.oldhelp = $cookies.get('oldhelp');

    $rootScope.currentuser.coins = parseInt($rootScope.currentuser.coins) + parseInt($scope.oldhelp.coins);
    $cookies.put('coins', $rootScope.currentuser.coins);
console.log('$cookies.get()-------'+$cookies.get('coins'));

    $scope.flagcoins = null;
    $scope.leftcoins = $rootScope.currentuser.coins;
    $scope.test=function(usecoins){
      $scope.leftcoins = ($rootScope.currentuser.coins-usecoins)>0?($rootScope.currentuser.coins-usecoins):'账户余额不足';
      document.getElementById('yue').innerHTML = "余额："+ $scope.leftcoins;
      $scope.flagcoins = usecoins;
    };

    $scope.updateHelp = function () {
      if($scope.leftcoins!='账户余额不足') {
        var detail = document.getElementById('detail').value;
        var image = 'Public/Images/bike01.jpg';
        var coins = $scope.flagcoins;
        var userid = $cookies.get('oldhelp').userid;
        var helperid = $cookies.get('oldhelp').helperid;
        var helptime = $cookies.get('oldhelp').helptime;
        var status = $cookies.get('oldhelp').status;
        if (coins) {
          var postData = {
            userid: userid,
            helperid: helperid,
            helptime: helptime,
            detail: detail,
            image: image,
            coins: coins,
            status: status
          }
          //修改求助
          $http({
            method: 'post',
            url: 'http://120.27.97.21/lehelp/index.php/home/Help/edit',
            data: postData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            params: {'helpid': $cookies.get('oldhelp').id},
            transformRequest: function (obj) {
              var str = [];
              for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }
          }).success(function (req) {
            if (req.status == 1) {
              console.log('updatehelp is success');
              console.log(req);
              //增加或减少求助者的金币数
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
                if (req.status == 1) {
                  console.log('subcoins is success ' + coins);
                  console.log(req);
                  $rootScope.currentuser.coins = parseInt($rootScope.currentuser.coins)  - parseInt(coins);
                  $cookies.put('coins', $rootScope.currentuser.coins);
                  $ionicLoading.show({
                    template: "修改成功",
                    duration: 1000
                  });
                  $ionicHistory.goBack();
                }
              });
            }
          });
        } else {
          $ionicLoading.show({
            template: "请选择悬赏额",
            duration: 1000
          });
        }
      }
    };
  //发布求助
    $scope.addHelp = function () {
        var detail = document.getElementById('detail').value;
        var image = 'img/bike.jpg';
        // var image = document.getElementById('image').value;
        var coins = $scope.flagcoins;
        var userid = $rootScope.currentuser.id;
        var helperid = 0;
        var helptime = 0;
        var status = '-1';
      if(coins) {
          var postData = {
            userid: userid,
            helperid: helperid,
            helptime: helptime,
            detail: detail,
            image: image,
            coins: coins,
            status: status
          }

          //添加求助
          $http({
            method: 'post',
            url: 'http://120.27.97.21/lehelp/index.php/home/Help/add',
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
            if (req.status == 1) {
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
                if (req.status == 1) {
                  console.log('subcoins is success ' + coins);
                  console.log(req);
                  $rootScope.currentuser.coins = $rootScope.currentuser.coins - coins;
                  $cookies.put('coins', $rootScope.currentuser.coins);
                  $ionicLoading.show({
                    template: "发布成功",
                    duration: 1000
                  });
                  $location.path('/tab/helps');
                }
              });
            }
          });
        }else{
        $ionicLoading.show({
          template: "请选择悬赏额",
          duration: 1000
        });
      }
    };
})

//二手专区控制器
  .controller('SecondhandsCtrl', function($scope,$stateParams,$cookies,$ionicLoading,$ionicActionSheet,$location,$rootScope,$http,$ionicHistory) {
    //获取二手信息list
    $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/index').success(function(data){
      $scope.secondhands =  data.secondhands;
     });

    $scope.serverSideList = [
      { text: "我有", value: "1" },
      { text: "想要", value: "0" }
    ];
    $scope.defaultselect='1';

    //修改二手
    $scope.oldsecondhand= $cookies.get('oldsecondhand');
    console.log('$scope.oldsecondhand----');
    console.log($scope.oldsecondhand);
    $scope.updateSecondhand = function () {
      var newflag;
      var temp = document.getElementsByName("group");
      for(var i=0;i<temp.length;i++)
      {
        if(temp[i].checked){
          newflag = temp[i].value;
          $scope.defaultselect = newflag;
        }
      }
      var detail = document.getElementById('detail').value;
      var image = 'Public/Images/bike01.jpg';
      var userid = $cookies.get('oldsecondhand').userid;
      var flag = newflag;
      var status = $cookies.get('oldsecondhand').status;

      if(newflag) {
        var postData = {
          userid: userid,
          flag:flag,
          detail: detail,
          image: image,
          status: status
        };
        $http({
          method: 'post',
          url: 'http://120.27.97.21/lehelp/index.php/home/SecondHand/edit',
          data: postData,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          params:{'secondhandid':$cookies.get('oldsecondhand').id},
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }
        }).success(function (req) {
          if (req.status == 1) {
              $ionicLoading.show({
                template: "发布成功",
                duration: 1000
              });
            $ionicHistory.goBack();
          }
        });
      }else{
        $ionicLoading.show({
          template: "请选择二手类型",
          duration: 1000
        });
      }
    };

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
        $location.path('/tab/secondhands');
      });
    };
})
  .controller('SecondhandDetailCtrl',function ($scope,$stateParams,$ionicLoading,$ionicActionSheet,$location,$rootScope,$http) {
    $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/secondhandinfo',{params:{'secondhandid':$stateParams.secondhandid}}).success(function(data){
      if(data.status==1){
        $scope.secondhand =  data.secondhand;
      }else{
        $ionicLoading.show({
          template: "该二手不存在，请刷新",
          duration:1000
        });
      }

    });
  })
  .controller('SecondhandDetail_Refresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {

    $scope.doRefresh = function () {
      $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/secondhandinfo',{params:{'secondhandid':$scope.secondhand.id}}).success(function(data){
        if(data.status==1) {
          $scope.secondhand = data.secondhand;
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
    }
  })
  .controller('Secondhands_Refresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {
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
      var old = $scope.secondhands;
      if(old!=undefined){
        var results = chushihua(obj,3);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    /* state:1初始化，2刷新，3加载更多 */
    function chushihua(obj_data,state){
      console.log('执行拉');
      if(!run){
        run = true;

        $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/index/p/'+obj_data.page).success(function(data){
          run = false;
          if (state==3) {
            if (data.status != 0){
              $scope.secondhands = $scope.secondhands.concat(data.secondhands);
              obj.page += 1;
            }else{
              console.log("结束");
              $scope.hasmore = false;
            }
          }else{
            $scope.secondhands = data.secondhands;
            obj.page = 2;
          }
        });
      }
    }
  })

  .controller('MessagesCtrl', function($scope,$location, $ionicPopup,$ionicLoading,$rootScope,$http) {

    $http.get('http://120.27.97.21/lehelp/index.php/home/Message/index',{params:{'userid':$rootScope.currentuser.id}}).success(function(data){
      $scope.messages = data.messages;
    });
    $scope.show = true;
    $scope.jump=function (id,helpid,ishelper,nickname,tele,status) {
    $scope.show = false;
    //消息被查看,message的status改为1
      $http.get('http://120.27.97.21/lehelp/index.php/home/Message/edit',{params:{'msgid':id,'status':1}}).success(function(data){
        if(data.status==1){
          console.log('消息已被查看');
        }

      });
      if(ishelper==1){
        $scope.showAlert = function() {
          $ionicPopup.alert({
            title: "帮助者信息",
            template: "<p>姓名："+nickname+"</p><p>联系方式："+tele+"</p>",
          });
        }
        $scope.showAlert();
      }else{
        $location.path('/tab/messages/'+helpid);
        console.log($location.absUrl());
      }
    }
  })
  .controller('Message_Refresh',function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {


    $scope.hasmore=true;
    var run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
    var obj = {page:1,userid:$rootScope.currentuser.id};
    var results = chushihua(obj,1);

    $scope.doRefresh = function(){
      var obj_data = {page:1,userid:$rootScope.currentuser.id};
      var results = chushihua(obj_data,2);
      $scope.hasmore=true;
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function(){
      var old = $scope.messages;
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
        $http.get('http://120.27.97.21/lehelp/index.php/home/Message/index',{params:{'p':obj_data.page,'userid':$rootScope.currentuser.id}}).success(function(data){

          run = false;
          if (state==3) {
            if (data.status != 0){
              $scope.messages = $scope.messages.concat(data.messages);
              obj.page += 1;
            }else{
              console.log("结束");
              $scope.hasmore = false;
            }
          }else{
            $scope.messages = data.messages;
            obj.page = 2;
          }
        });
      }
    }
  })

  .controller('MyCtrl', function($scope,$ionicPopup,$location,$rootScope,$ionicLoading,$http,$cookies) {

    $scope.showCoins = function () {
      $ionicPopup.alert({
        title: "您的余额",
        template: $cookies.get('coins')+'    '+$rootScope.currentuser.coins,
        // template: $rootScope.currentuser.coins,
      });
    }
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
      $cookies.remove('username');
      $cookies.remove('nickname');
      $cookies.remove('tele');
      $cookies.remove('avatar');
      $cookies.remove('coins');
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
  })

  .controller('MyHelps_Refresh',function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {
    $scope.hasmore=true;
    var run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
    var obj = {page:1,userid:$rootScope.currentuser.id};
    var results = chushihua(obj,1);

    $scope.doRefresh = function(){
      var obj_data = {page:1,userid:$rootScope.currentuser.id};
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
        $http.get('http://120.27.97.21/lehelp/index.php/home/User/myhelps',{params:{'p':obj_data.page,'userid':$rootScope.currentuser.id}}).success(function(data){
          run = false;
          if (state==3) {
            if (data.status != 0){
              $scope.helps = $scope.helps.concat(data.myhelps);
              obj.page += 1;
            }else{
              console.log("结束");
              $scope.hasmore = false;
            }
          }else{
            $scope.helps = data.myhelps;
            obj.page = 2;
          }
        });
      }
    }
  })
  .controller('MyHelpsCtrl',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {
    //获取求助信息list
    $http.get('http://120.27.97.21/lehelp/index.php/home/User/myhelps',{params:{'userid':$rootScope.currentuser.id}}).success(function(data){
      $scope.helps =  data.myhelps;
      console.log($scope.helps);

    });
  })
  .controller('MyHelpDetailCtrl',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http,$ionicHistory) {

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

      //按id查找help
      $http.get('http://120.27.97.21/lehelp/index.php/home/Help/helpinfo',{params:{'helpid':$stateParams.helpid}}).success(function(data) {
        if(data.status==1) {
          $scope.help = data.help;
          $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments', {params: {'helpid': $stateParams.helpid}}).success(function (responds) {
            $scope.comments = responds.comments;
          });
        }else{
          $ionicLoading.show({
            template: "该求助不存在，请刷新",
            duration:1000
          });
        }
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
      };
  //上拉菜单：修改，取消，删除
      $scope.show1 = function (helpid) {
        var hideSheet = $ionicActionSheet.show({
          cancelOnStateChange: true,
          cssClass: 'action_s',
          // titleText: "操作当前",
          buttons: [{text: "修改"},{text: "取消求助"}],
          buttonClicked: function (index) {           //修改求助信息
            if(index==0){
              var oldhelp = {
                id:$scope.help.id,
                userid:$scope.help.userid,
                helperid:$scope.help.helperId,
                detail:$scope.help.detail,
                image:$scope.help.image,
                coins:$scope.help.coins,
                status:$scope.help.status,
                helptime:$scope.help.helptime
              };
              $cookies.put('oldhelp',oldhelp);
              location.href = 'main.html#/tab/update-help';
            }else if(index==1){
              $http.get('http://120.27.97.21/lehelp/index.php/home/Help/edithelpstatus',{params:{'helpid':helpid,'status':1}}).success(function(data){
                if(data.status==1) {
                  $ionicLoading.show({
                    template: "取消求助成功",
                    duration: 1000
                  });
                  console.log('before --'+$rootScope.currentuser.coins);
                  console.log('before --'+$rootScope.currentuser.coins);
                  $rootScope.currentuser.coins = parseInt($rootScope.currentuser.coins) + parseInt($scope.help.coins);
                  console.log('after --'+$rootScope.currentuser.coins);
                  $cookies.put('coins',$rootScope.currentuser.coins);
                }
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
                $http.get('http://120.27.97.21/lehelp/index.php/home/Help/edithelpstatus',{params:{'helpid':helpid,'status':1}}).success(function(data){
                if(data.status==1) {
                  //增加帮助者的金币数
                  var postdata = {
                    userid: $scope.help.helperid,
                    usecoins: $scope.help.coins,
                    flag: 1
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
                      $timeout(function () {
                        hideSheet();
                      }, 100);

                      $ionicLoading.show({
                        template: "帮助结束",
                        duration: 1000
                      });
                    }else{
                      $ionicLoading.show({
                        template: "fail",
                        duration: 1000
                      });
                    }
                  });
                }else{
                  $ionicLoading.show({
                    template: "操作失败",
                    duration: 1000
                  });
                }
              });

            }else if(index==1){
              $http.get('http://120.27.97.21/lehelp/index.php/home/Help/edithelpstatus',{params:{'helpid':helpid,'status':-1}}).success(function(data) {
                if (data.status == 1) {
                  $ionicLoading.show({
                    template: "请继续等待帮助",
                    duration: 1000
                  });
                  $timeout(function () {
                    hideSheet();
                  }, 100);
                }
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

            $http.get('http://120.27.97.21/lehelp/index.php/home/Help/delete',{params:{'helpid':helpid}}).success(function(data){
              console.log(data.status);
              if(data.status=='1'){
                $ionicLoading.show({
                  template: "删除成功",
                  duration:1000
                });
                $timeout(function () {
                  hideSheet();
                }, 100);
                $ionicHistory.goBack();
              }else{
                $ionicLoading.show({
                  template: "删除失败",
                  duration:1000
                });
              }

            });

          }
        });
      };

    })
  .controller('MyHelpDetail_Refresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {

    $scope.doRefresh = function () {
      $http.get('http://120.27.97.21/lehelp/index.php/home/Help/helpinfo',{params:{'helpid':$scope.help.id}}).success(function(data) {
        $scope.help = data.help;
        $http.get('http://120.27.97.21/lehelp/index.php/home/Help/comments/session_id/111111', {params: {'helpid': $scope.help.id}}).success(function (responds) {
          $scope.comments = responds.comments;
          $scope.$broadcast('scroll.refreshComplete');
        });
      });
    }
  })

  .controller('MySecondhands_Refresh',function($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {
    $scope.hasmore=true;
    var run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
    var obj = {page:1,userid:$rootScope.currentuser.id};
    var results = chushihua(obj,1);

    $scope.doRefresh = function(){
      var obj_data = {page:1,userid:$rootScope.currentuser.id};
      var results = chushihua(obj_data,2);
      $scope.hasmore=true;
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function(){
      var old = $scope.secondhands;
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

        $http.get('http://120.27.97.21/lehelp/index.php/home/User/mysecondhands',{params:{'p':obj_data.page,'userid':$rootScope.currentuser.id}}).success(function(data){
          run = false;
          if (state==3) {
            if (data.status != 0){
              $scope.secondhands = $scope.secondhands.concat(data.mysecondhands);
              obj.page += 1;
            }else{
              console.log("结束");
              $scope.hasmore = false;
            }
          }else{
            $scope.secondhands = data.mysecondhands;
            obj.page = 2;
          }
        });
      }
    }
  })
  .controller('MySecondhandDetailCtrl',function ($scope,$stateParams,$cookies,$ionicLoading,$ionicActionSheet,$location,$rootScope,$http,$ionicHistory,$timeout) {
    $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/secondhandinfo',{params:{'secondhandid':$stateParams.secondhandid}}).success(function(data){
      if(data.status==1){
        $scope.secondhand =  data.secondhand;
      }else{
        $ionicLoading.show({
          template: "该二手不存在，请刷新",
          duration:1000
        });
      }

    });

    $scope.show1 = function (secondhandid) {
      var hideSheet = $ionicActionSheet.show({
        cancelOnStateChange: true,
        cssClass: 'action_s',
        // titleText: "操作当前",
        buttons: [{text: "修改"},{text: "下架"}],
        buttonClicked: function (index) {           //修改求助信息
          if(index==0){
            var oldsecondhand = {
              id:$scope.secondhand.id,
              userid:$scope.secondhand.userid,
              flag:$scope.secondhand.flag,
              detail:$scope.secondhand.detail,
              image:$scope.secondhand.image,
              status:$scope.secondhand.status
            };
            $cookies.put('oldsecondhand',oldsecondhand);
            location.href = 'main.html#/tab/update-secondhand';

          }else if(index==1){
            $http.get('http://120.27.97.21/lehelp/index.php/home/Secondhand/editsecondhandstatus',{params:{'secondhandid ':secondhandid ,'status':1}}).success(function(data){
              console.log(data.status);
              if(data.status=='1'){
                $ionicLoading.show({
                  template: "下架成功",
                  duration:1000
                });
                $timeout(function () {
                  hideSheet();
                }, 100);
              }
            });
          }
        },
        cancelText: "取消",
        cancel: function () {
          return true;
        },
        destructiveText: "删除",
        destructiveButtonClicked: function () {    //删除二手信息
        console.log('secondhandid1--');
        console.log(secondhandid);


          $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/delete',{params:{'secondhandid':secondhandid}}).success(function(data){
            if(data.status=='1'){
              $ionicLoading.show({
                template: "删除成功",
                duration:1000
              });
              $timeout(function () {
                hideSheet();
              }, 100);
              $ionicHistory.goBack();
            }else{
              $ionicLoading.show({
                template: "删除失败",
                duration:1000
              });
            }
          });



          // $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/delete',{params:{'secondhandid ':secondhandid}}).success(function(data){
          //   console.log(data.status);
          //   if(data.status=='1'){
          //     $ionicLoading.show({
          //       template: "删除成功",
          //       duration:1000
          //     });
          //     $timeout(function () {
          //       hideSheet();
          //     }, 100);
          //     $ionicHistory.goBack();
          //   }
          // });
        }
      });
    };
    $scope.show2 = function (secondhandid) {
      var hideSheet = $ionicActionSheet.show({
        cancelOnStateChange: true,
        cssClass: 'action_s',
        // titleText: "操作当前",
        cancelText: "取消",
        cancel: function () {
          return true;
        },
        destructiveText: "删除",
        destructiveButtonClicked: function () {    //删除二手信息
          console.log('secondhandid2--');
          console.log(secondhandid);

          $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/delete',{params:{'secondhandid':secondhandid}}).success(function(data){
            if(data.status=='1'){
              $ionicLoading.show({
                template: "删除成功",
                duration:1000
              });
              $timeout(function () {
                hideSheet();
              }, 100);
              $ionicHistory.goBack();
            }else{
              $ionicLoading.show({
                template: "删除失败",
                duration:1000
              });
            }
          });
        }
      });
    };
  })
  .controller('MySecondhandDetail_Refresh',function ($scope,$stateParams,$ionicLoading,$location,$ionicPopup,$ionicActionSheet,$rootScope,$timeout,$cookies,$http) {

    $scope.doRefresh = function () {
      $http.get('http://120.27.97.21/lehelp/index.php/home/SecondHand/secondhandinfo',{params:{'secondhandid':$scope.secondhand.id}}).success(function(data){
        if(data.status==1) {
          $scope.secondhand = data.secondhand;
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
    }
  })
  .controller('MySecondhandsCtrl', function($scope,$stateParams,$ionicLoading,$ionicActionSheet,$location,$rootScope,$http) {
  //获取二手信息list
    $http.get('http://120.27.97.21/lehelp/index.php/home/User/mysecondhands',{params:{'userid':$rootScope.currentuser.id}}).success(function(data){
      $scope.secondhands =  data.mysecondhands;
    });

    $scope.serverSideList = [
      { text: "我有", value: "1" },
      { text: "想要", value: "0" }
    ];
    $scope.defaultselect='1';


});

