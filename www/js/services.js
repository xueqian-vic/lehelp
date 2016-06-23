angular.module('starter.services', [])
  // .factory(
  //   'Media',
  //   [
  //     '$rootScope',
  //     '$resource',
  //     '$location',
  //     '$http',
  //     function($rootScope, $resource, $location, $http) {
  //       var mediaServices = {};
  //       mediaServices.getAllMedia = function(media) {
  //         var path = $rootScope.host + '/services/api/media/' + media;
  //         return $resource(path, {},
  //           {
  //             get : {
  //               method : 'GET',
  //               isArray : false
  //             }
  //           });
  //       };
  //       return mediaServices;
  //
  //     } ])
  .factory('User',function () {
    var users=[{
      id:'123',
      username:'信息学院-薛倩',
      password:'xq',
      avatar:'img/mike.png',
      tele:'18859271251',
      coins:230,
      createtime:'2016-05-21',
    },{
      id:'100',
      username:'管理学院-张三',
      password:'111',
      avatar:'img/mike.png',
      tele:'18859271251',
      coins:258,
      createtime:'2016-05-24',
    }];

    return {
      all: function() {
        return users;
      },
      get: function(userId) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === parseInt(userId)) {
            return users[i];
          }
        }
        return null;
      },
      add:function (user) {
        users.push(user);
        console.log(users);
      }
    };

  })
.factory('Messages', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var messages = [{
    id: 0,
    detail: '具体是在哪儿啊',
    commenter:{
      id:'100',
      username:'管理学院-张三',
      avatar:'img/ben.png',
      tele:'18859271251',
    },
    help:{
      id: 0,
      userId:'123',
      detail: '地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
      image:'img/bike.jpg',
    },
    status:false,    //是否已被查看
    createtime:'2016-05-21',
    isHelper:false,  //是否为帮助者。true/false:帮助者/评论者
  }, {
    id: 1,
    detail: '我正好在这边，能帮你哦！加你微信了',
    commenter:{
      id:'101',
      username:'经济学院-李四',
      avatar:'img/ben.png',
      tele:'18859271251',
    },
    help:{
      id: 1,
      userId:'123',
      detail: '地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
      image:null,
    },
    status:false,
    createtime:'2016-05-21',
    isHelper:false,
  },{
    id: 2,
    detail: '愿意帮您',
    commenter:{
      id:'102',
      username:'数学学院-王五',
      avatar:'img/ben.png',
      tele:'18859271251',
    },
    help:{
      id: 4,
      userId:'123',
      detail: '地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
      image:null,
    },
    status:false,
    createtime:'2016-05-21',
    isHelper:true,
  }];

  return {
    all: function() {
      return messages;
    },
    remove: function(message) {
      chats.splice(messages.indexOf(message), 1);
    },
    get: function(messageId) {
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].id === parseInt(messageId)) {
          return messages[i];
        }
      }
      return null;
    }
  };
})

.factory('myHelps', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var helps = [{
    id: 0,
    user:{
      id:'101',
      username:'信息学院-101',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:null,
    detail: '0地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    createtime:'2016-05-21',
    coins:20,
    status:-1,    //    true/false:已解决/未解决
    image:'img/bike.jpg',
    helptime:null,   //被帮助时间
  },{
    id: 1,
    user:{
      id:'102',
      username:'信息学院-102',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:null,
    detail: '1地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    createtime:'2016-05-22',
    coins:20,
    status:-1,
    image:'img/bike.jpg',
    helptime:null,
  },{
    id: 2,
    user:{
      id:'123',
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:'111',
    detail: '2地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    createtime:'2016-05-21',
    coins:20,
    status:0,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 3,
    user:{
      id:'100',
      username:'管理学院-张三',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:'123',
    detail: '3地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    createtime:'2016-05-22',
    coins:20,
    status:0,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 4,
    user:{
      id:'123',
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:null,
    detail: '4地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    createtime:'2016-05-21',
    coins:20,
    status:-1,
    image:null,
    helptime:null,
  },{
    id: 5,
    user:{
      id:'103',
      username:'信息学院-103',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:'111',
    detail: '5地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    createtime:'2016-05-22',
    coins:20,
    status:1,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 6,
    user:{
      id:'123',
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:'111',
    detail: '6地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    createtime:'2016-05-21',
    coins:20,
    status:1,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 7,
    user:{
      id:'123',
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      tele: '18859271251',
    },
    helperId:'111',
    detail: '7地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    createtime:'2016-05-22',
    coins:20,
    status:1,
    image:null,
    helptime:'2016-05-22',
  }];

  return {
    all: function() {
      console.log(helps);
      return helps;
    },
    get: function(helpId) {
      for (var i = 0; i < helps.length; i++) {
        if (helps[i].id === parseInt(helpId)) {
          return helps[i];
        }
      }
      return null;
    },
    update:function (help) {
      for (var i = 0; i < helps.length; i++) {
        if (helps[i].id === parseInt(help.id)) {
          helps[i].helperId = help.helperId;
          helps[i].detail = help.detail;
          helps[i].coins = help.coins;
          helps[i].status = help.status;
          helps[i].helptime = help.helptime;
          console.log(helps[i]);
        }
      }
      return null;
    }
  };
})

  .factory('mySecondhands', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var secondhands = [{
      id: 0,
      user:{
        id:'123',
        username:'信息学院-薛倩',
        avatar:'img/mike.png',
      },
      // header:'转让女士二手一辆',
      detail:'地点：学生公寓海韵5。15年买的，8成新，价格200左右，可议价。微信号：smile1578',
      image:'img/bike.jpg',
      createtime:'2016-05-21',
      status:true,   //     true/false  :  已下架/未下架
      flag:1,        //     0/1  :  想要/我有
    },{
      id: 1,
      user:{
        id:'100',
        username:'管理学院-张三',
        avatar:'img/mike.png',
      },
      // header:'转让女士二手一辆',
      detail: '地点：学生公寓海韵7。转让洗衣机一台，用了1年半，低价转让，价格300，原价600。微信号：25485967',
      image:'img/bike.jpg',
      createtime:'2016-05-22',
      status:false,
      flag:1,
    },{
      id: 2,
      user:{
        id:'101',
        username:'经济学院-李四',
        avatar:'img/mike.png',
      },
      // header:'转让女士二手一辆',
      detail: '地点：本部芙蓉宿舍2号。求购小音箱一个，价格150以内。tele:15507485256',
      image:null,
      createtime:'2016-05-21',
      status:false,
      flag:0,
    },{
      id: 3,
      user:{
        id:'102',
        username:'数学学院-王五',
        avatar:'img/mike.png',
      },
      // header:'转让女士二手一辆',
      detail: '地点：学生公寓海韵17。求购电脑桌一个。微信号：ssq784514',
      image:null,
      createtime:'2016-05-22',
      status:false,
      flag:0,
    },{
      id: 4,
      user:{
        id:'103',
        username:'信息学院-陈晨',
        avatar:'img/mike.png',
      },
      // header:'转让女士二手一辆',
      detail: '地点：本部凌云宿舍3号。转让台式机主机加显示屏，价格500，不议价。微信：1257854693',
      image:'img/bike.jpg',
      createtime:'2016-05-21',
      status:false,
      flag:1,
    }];

    return {
      all: function() {
        return secondhands;
      },
      get: function(secondhandId) {
        for (var i = 0; i < secondhands.length; i++) {
          if (secondhands[i].id === parseInt(secondhandId)) {
            return secondhands[i];
          }
        }
        return null;
      }
    };
  });
