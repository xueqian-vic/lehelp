/**
 * 命名规范：驼峰法
 */
angular.module('starter.services', [])
  .factory('User', function(){
    var user ;

    return {
      getuser: function () {
        return user;
      }
    }
  });
