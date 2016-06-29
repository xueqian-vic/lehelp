/**
 * 命名规范：驼峰法
 */
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
  //
  // .factory('Help',['$resource',
  //   function getAllHelps($resource){
  //     return $resource('http://120.27.97.21/lehelp/index.php/home/Help/index/p/1/session_id/1111');
  //   }
  // ])

  .factory('User', function(){
    var user ;
    
    return {
      getuser: function () {
        return user;
      }
    }
  });
