angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
angular.module('starter.services', []).factory("Helps",function () {
  var helps=[{
    id:0,
    name:"Ben Sparrow",
    chatId:1,
    face:'img/ben.png',
  },{
    id:1,
    name:"Ben Sparrow",
    chatId:2,
    face:'img/ben.png',
  },{
    id:2,
    name:"Ben Sparrow",
    chatId:3,
    face:'img/ben.png',
  },{
    id:3,
    name:"Ben Sparrow",
    chatId:4,
    face:'img/ben.png',
  }];
  var comments=[{
    id:0,
    name:"小黑",
    face:'img/ben.png',
    comment:"让我来吧,下午可以帮你去带",
    time:"9小时前",
  },{
    id:1,
    name:"小明",
    face:'img/ben.png',
    comment:"haode,就这样",
    time:"10小时前"
  },{
    id:2,
    name:"小王",
    face:'img/ben.png',
    comment:'明天拿给你',
    time:"11小时前"
  }];
  return {
    all:function () {
      return helps;
    },
    get:function(helpId){
      for (var i = 0; i < helps.length; i++) {
        if (helps[i].id === parseInt(helpId)) {
          return helps[i];
        }
      }
      return null;
    },
    getComments:function (helpId) {
      return comments;
    }
  }
});
