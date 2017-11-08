  angular.module('buttons',[])
    .controller('buttonCtrl',ButtonCtrl)
    .factory('buttonApi',buttonApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function ButtonCtrl($scope,buttonApi){
     $scope.buttons=[]; //Initially all was still
     $scope.list=[];
     //$scope.user=[];
     $scope.errorMessage='';
     $scope.deleteItem=deleteItem;
     //$scope.currentUser='';
     $scope.isLoading=isLoading;
     $scope.refreshButtons=refreshButtons;
     $scope.refreshList=refreshList;
     $scope.buttonClick=buttonClick;
     $scope.voidClick=voidClick;
     //$scope.getUser=getUser;

     var loading = false;

     function isLoading(){
      return loading;
     }

    //  function getUser(){
    //    loading=true;
    //    $scope.currentUser='';
    //    buttonApi.getUser()
    //     .success(function(data) {
    //       $scope.currentUser=data;
    //       loading=false;
    //     })
    //     .error(function () {
    //         $scope.errorMessage="Unable to load Buttons:  Database request failed";
    //         loading=false;
    //     });
    //  }
    function deleteItem(){
      $scope.errorMessage='';
      //console.log($event.target.id);
      buttonApi.deleteItem(event.target.id)
         .success(function(){
           refreshList();
         })
         .error(function(){$scope.errorMessage="Unable click";});
    }

    function refreshButtons(){
      loading=true;
      $scope.errorMessage='';
      buttonApi.getButtons()
        .success(function(data){
           $scope.buttons=data;
           loading=false;
        })
        .error(function () {
            $scope.errorMessage="Unable to load Buttons:  Database request failed";
            loading=false;
        });
   }

   function refreshList(){
     loading=true;
     $scope.errorMessage='';
     buttonApi.getList()
       .success(function(data){
          $scope.list=data;
          loading=false;
       })
       .error(function () {
           $scope.errorMessage="Unable to load Buttons:  Database request failed";
           loading=false;
       });
  }

    function buttonClick($event){
       $scope.errorMessage='';
       //console.log($event.target.id);
       buttonApi.clickButton(event.target.id)
          .success(function(){
            refreshList();
          })
          .error(function(){$scope.errorMessage="Unable click";});
    }

    function voidClick($event){
      $scope.errorMessage='';
      //console.log($event.target.id);
      buttonApi.voidButton()
         .success(function(){
           refreshList();
         })
         .error(function(){$scope.errorMessage="Unable to void this transaction";});
    }

    refreshButtons();  //make sure the buttons are loaded
    refreshList();
  }

  function buttonApi($http,apiUrl){
    return{
      getButtons: function(){
        var url = apiUrl + '/buttons';
        return $http.get(url);
      },
      clickButton: function(id){
        var url = apiUrl+'/click?id='+id;
        console.log("Attempting with "+url);
        return $http.post(url); // Easy enough to do this way
      },
      voidButton: function(){
        var url = apiUrl + '/void';
        console.log("Attempting with "+url);
        return $http.post(url);
      },
      getList: function(){
        var url = apiUrl + '/list';
        console.log("Attempting with " + url);
        return $http.get(url);
      },
      getUser: function(){
        var url = apiUrl + '/user';
        console.log("Attempting with " + url);
        return $http.get(url);
      },
      deleteItem: function(id){
        var url = apiUrl+'/delete?id='+id;
        console.log("Attempting with "+url);
        return $http.post(url);
      }
   };
  }
