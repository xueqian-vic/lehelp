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
.factory('Messages', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var messages = [{
    id: 0,
    detail: '具体是在哪儿啊',
    helper:{
      userId:'100',
      username:'管理学院-张三',
      avatar:'img/ben.png',
    },
    help:{
      id: 0,
      userId:'123',
      helperId:null,
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      detail: '地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
      tele: '18859271251',
      createtime:'2016-05-21',
      coins:20,
      status:false,
      image:'img/bike.jpg',
    },
    status:false,    //是否已被查看
    createtime:'2016-05-21',
    isHelper:false,  //是否为帮助者。true/false:帮助者/评论者
  }, {
    id: 1,
    detail: '我正好在这边，能帮你哦！加你微信了',
    helper:{
      userId:'101',
      username:'经济学院-李四',
      avatar:'img/ben.png',
    },
    help:{
      id: 1,
      userId:'123',
      helperId:null,
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      detail: '地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
      tele: '18859271251',
      createtime:'2016-05-21',
      coins:20,
      status:false,
    },
    status:false,
    createtime:'2016-05-21',
    isHelper:false,
  },{
    id: 2,
    detail: '我可以帮你哦！加你微信了',
    helper:{
      userId:'102',
      username:'数学学院-王五',
      avatar:'img/ben.png',
    },
    help:{
      id: 4,
      userId:'123',
      helperId:null,
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      detail: '地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
      tele: '18859271251',
      createtime:'2016-05-21',
      coins:20,
      status:false,
      image:'img/bike.jpg',
    },
    status:false,
    createtime:'2016-05-21',
    isHelper:false,
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
    userId:'123',
    helperId:null,
    username:'信息学院-薛倩',
    avatar:'img/mike.png',
    detail: '0地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-21',
    coins:20,
    status:false,    //    true/false:已解决/未解决
    image:'img/bike.jpg',
    helptime:null,   //被帮助时间
  },{
    id: 1,
    userId:'123',
    helperId:null,
    username:'信息学院-薛倩',
    avatar:'img/perry.png',
    detail: '1地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-22',
    coins:20,
    status:false,
    image:'img/bike.jpg',
    helptime:null,
  },{
    id: 2,
    userId:'123',
    helperId:'111',
    username:'信息学院-薛倩',
    avatar:'img/mike.png',
    detail: '2地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-21',
    coins:20,
    status:true,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 3,
    userId:'123',
    helperId:'111',
    username:'信息学院-薛倩',
    avatar:'img/perry.png',
    detail: '3地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-22',
    coins:20,
    status:true,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 4,
    userId:'123',
    helperId:null,
    username:'信息学院-薛倩',
    avatar:'img/mike.png',
    detail: '4地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-21',
    coins:20,
    status:false,
    image:null,
    helptime:null,
  },{
    id: 5,
    userId:'123',
    helperId:'111',
    username:'信息学院-薛倩',
    avatar:'img/perry.png',
    detail: '5地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-22',
    coins:20,
    status:true,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 6,
    userId:'123',
    helperId:'111',
    username:'信息学院-薛倩',
    avatar:'img/mike.png',
    detail: '6地点：厦大学生公寓，时间：5.25下午三点半。麻烦帮忙拿一下《易中天演讲》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-21',
    coins:20,
    status:true,
    image:null,
    helptime:'2016-05-22',
  },{
    id: 7,
    userId:'123',
    helperId:'111',
    username:'信息学院-薛倩',
    avatar:'img/perry.png',
    detail: '7地点：本部颂恩楼，时间：5.24下午三点半。麻烦帮忙拿一下《哥德巴赫猜想》的门票。微信号：xq5525458',
    tele: '18859271251',
    createtime:'2016-05-22',
    coins:20,
    status:true,
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
    }
  };
})

  .factory('mySecondhands', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var secondhands = [{
      id: 0,
      userId:'123',
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
      // header:'转让女士二手一辆',
      detail:'地点：学生公寓海韵5。15年买的，8成新，价格200左右，可议价。微信号：smile1578',
      image:'img/bike.jpg',
      createtime:'2016-05-21',
      status:true,   //     true/false  :  已下架/未下架
      flag:1,        //     0/1  :  想要/我有
    },{
      id: 1,
      userId:'100',
      username:'管理学院-张三',
      avatar:'img/perry.png',
      // header:'转让女士二手一辆',
      detail: '地点：学生公寓海韵7。转让洗衣机一台，用了1年半，低价转让，价格300，原价600。微信号：25485967',
      image:'img/bike.jpg',
      createtime:'2016-05-22',
      status:false,
      flag:1,
    },{
      id: 2,
      userId:'101',
      username:'经济学院-李四',
      avatar:'img/mike.png',
      // header:'转让女士二手一辆',
      detail: '地点：本部芙蓉宿舍2号。求购小音箱一个，价格150以内。tele:15507485256',
      image:null,
      createtime:'2016-05-21',
      status:false,
      flag:0,
    },{
      id: 3,
      userId:'102',
      username:'数学学院-王五',
      avatar:'img/perry.png',
      // header:'转让女士二手一辆',
      detail: '地点：学生公寓海韵17。求购电脑桌一个。微信号：ssq784514',
      image:null,
      createtime:'2016-05-22',
      status:false,
      flag:0,
    },{
      id: 4,
      userId:'103',
      username:'信息学院-薛倩',
      avatar:'img/mike.png',
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
