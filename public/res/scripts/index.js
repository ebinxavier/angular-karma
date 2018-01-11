//*NOTE: All response from API Call will contain the following structure
/*


 {
 "status": "success",=====> will contain either 'success' or 'failure'
 "code": 200,======> status code Ex:404,500,200
 "data": {},====>>requested data
 "error": ""====>>if any errors
 }


 */
var Capstone = angular.module("Capstone",['ui.router','ngResource','ui.bootstrap']);
// 
/*Service Factory for API Calls*/

/*

 create a service module using factory and 'ngResource' as dependency.

 This Service Should contain the configuration objects for the following APIs.

 1.To create a book
 =======================
 url:http://localhost:3000/book
 method:POST
 input data format:{name:'', description:'', price:'', category:''}

 2.To update a book
 =======================
 url:http://localhost:3000/book/id
 method:PUT
 input data format:{name:'', description:'', price:'', category:''}
 note:Here id is the id of book.

 3.To remove a book
 ========================
 url:http://localhost:3000/book/id
 method:DELETE
 note:Here id is the id of book.
 

{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} };

 */
Capstone.service("myService",function(){
    this.test = function(){
        console.log("testing service");
        return true;
    }
})
Capstone.factory("CapFactory",function($resource){
     return {
         createBook:function(){
             return $resource('http://localhost:3000/product');
         },
         updateBook:function(data){

         },
         removeBook:function(id){          
             return $resource('http://localhost:3000/product/:id',{id:id});

         },
         getAllBooks:function(){
                return $resource("http://localhost:3000/products");
         }

     }
})
Capstone.factory("Api",function($resource){
    return  $resource('http://localhost:3000/product/:id',{id:'@id'},
    {   'update':    {method:'PUT'},
        'create':   {method:'POST'},
        'remove': {method:'DELETE'},
        'get': {method:'GET'}
    });
    })


/*End of Service Factory*/

/*Create Angular Module*/

/*
 create a angular module in the name of 'Capstone' and put 'ui.router' as first dependency
 and the Service you have created above as a second dependency.
 */


/*End Of Module Creation*/

/*App Route Config*/

/*
 create following states here for Capstone for navigation.using the state provider.

 1.book List
 ================
 *use the page public/pages/list.html
 *define your own controller for this state.

 2.book creation
 ===================
 *use the page public/pages/book.html
 *define your own controller for this state.


 3.book update
 =================
 *use the page public/pages/book.html
 *define your own controller for this state.

 use the Url route provider to set the default opening page.
 */

Capstone.config(function($stateProvider,$urlRouterProvider){
    $stateProvider.state("list",{
        name : "list",
        url: '/list',
        templateUrl : "/pages/list.html",
        controller : "listController"
    })
    .state("create",{
        name : "create",
        url: '/create',
        templateUrl : "/pages/book.html",
        controller : "createController"
    })
    .state("update",{
        name : "update",
        url: '/update',
        templateUrl : "/pages/book.html",
        controller : "editController",
        params:{id:""}
    })
    $urlRouterProvider.otherwise('list');
})





/*End of Route Config*/




/*Book List Controller
 ==============================

 1.write your code to get list of Books using http provider in angularJs.

 URL: url:http://localhost:3000/Books
 method:GET



 2.after getting the list of Books, iterate the html elements to show all the Books as shown in requirement Document and
 iterate the Book list and get the unique category list.

 using this unique category list, display the categories in category filter section as shown in requirement Document .
 add "All Categories" as default in category filer section.

 3.write a function to filter the Books when a category is clicked in category filter section
 when "All categories" Clicked, show All Books.

 4.when edit button clicked, app should go to Book edit state.write a function to do that.

 5.when remove button clicked, a bootstrap modal should open to confirm the removal. upon confirmation,
 Book should be removed from the database. an alert message should be shown in green/Red upon successful/unsuccessful removal

 this alert messages should be hidden in 3 seconds. use timeout provider in angularJs for that.

 use the configured service object to make API call for removal.


 * */

Capstone.controller("test",function($scope,CapFactory,Api,$modal){
    $scope.categories=["All Catogeries","Autobiography","Fiction","Fantacy"];
    // $scope.table=CapFactory.getAllBooks().get().data;
    CapFactory.getAllBooks().get().$promise.then(function(res){
    $scope.table=res.data;
    console.log(res.data);
    })
    Api.create({},{name:'x', description:'x', price:'10', category:'x'});

    $scope.removeBook = function(id){

    Api.remove({id:id});
    }
    $scope.updateBook = function(id){
    // Api.update({id:id},{name:'y', description:'y', price:'100', category:'y'});
    }


})

Capstone.controller("listController", function($scope,CapFactory,Api, $modal,$state) {
    // $scope.categories=["All Catogeries","Autobiography","Fiction","Fantacy"];

$scope.currentCat="All Categories";
    function getCatogeries(data){
        var catString="";
        for(var i in data){
            if(catString.indexOf(data[i].category)==-1){
                catString+=","+data[i].category;
            }
        }
        return ("All Categories,"+catString.substr(1,catString.length)).split(",");
    }
    $scope.changeCategory= function(cat){
        $scope.table=[];
        $scope.currentCat=cat;
        if(cat=="All Categories")
        {
            $scope.table=$scope.tableBackUp;
            return;
        }
        
        for(var i in $scope.tableBackUp){
            if($scope.tableBackUp[i].category==cat)
                $scope.table.push($scope.tableBackUp[i])
        }
    }

    CapFactory.getAllBooks().get().$promise.then(function(res){
    $scope.tableBackUp=res.data;
    $scope.table=res.data;
    $scope.categories=getCatogeries(res.data);
    console.log(res.data);
    })

    $scope.updateBook = function(id){
        $state.go("update",{id:id});
    // Api.update({id:id},{name:'y', description:'y', price:'100', category:'y'});
    }

    $scope.removeBook = function(id){
        $modal.open({
              templateUrl: '/pages/dialog.html',
              controller: 'ModalDialogController', 
         })
        .result.then(
            function () {
                 Api.remove({id:id});
                 CapFactory.getAllBooks().get().$promise.then(function(res){
                $scope.table=res.data;
                })
            }, 
            function () {
                // alert("Cancel");
            }
        );
    }
})

Capstone.controller("ModalDialogController", function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

// Capstone.directive("myDir",function(){
//     return {
//         restrict: "EAC",
//         scope:{
//             data :"=name"
//         },
//         transclude:true,
//         template :function(elem,attr){
//             console.log(elem);
         
//          return "<h1>Welcome {{data.name}}"+attr.myDir +" !\
//          \<ng-transclude/>\
//          </h1>";
//         }
//     };
// })

// Capstone.directive("noSpace",function($compile){
//     function link(scope,element,attr){
//         console.log(scope,attr);
//         scope.$watch("ngModel",function(newVal,oldVal){
//         scope.ngModel=newVal.split(" ").join("").trim();
//         })
       
//     }
//     return {
//         restrict: "EAC",
//         link : link,
//         transclude:true,
//         scope:{
//             ngModel : "="
//         }
//     }
// })

// Capstone.directive('ebRepeat', function(){
//   return {
//     transclude : 'element',
//     compile : function(element, attr, linker){
//       return function($scope, $element, $attr){
//             indexString = $attr.ebRepeat.split(" ")[0],
//             collectionString = $attr.ebRepeat.split(" ")[2],
//             parent = $element.parent(),
//             elements = [];

//         // $watchCollection is called everytime the collection is modified
//         $scope.$watchCollection(collectionString, function(collection){
//           var i, block, childScope;


//           for (i = 0; i < collection.length; i++) {
//             // create a new scope for every element in the collection.
//             childScope = $scope.$new();
//             // pass the current element of the collection into that scope
//             childScope[indexString] = collection[i];

//             linker(childScope, function(clone){
//               parent.append(clone); // add to DOM
//             });
//           };
//         });
//       }
//     }
//   }
// });


/*End of Book List Controller*/

/*Book Create Controller
 ================================
 1. write a function to save the Book.
 call this function when submit button in Book page clicked.

 an alert message should be shown in green/Red upon successful/unsuccessful creation of Book

 after successful creation of Book, app should navigate to list page(Book list state)
 use the configured service object to make API call for Creating Book.

 2.write a function to remove the form values in the Book page.
 call this function when cancel button in Book page clicked.

 * */
Capstone.controller("createController",function($scope,Api,$state,$timeout){
    $scope.title="Add Book";
    $scope.back=function(){
        $state.go("list");
    }
    $scope.submit=function(){
        Api.create({},{name:$scope.name, description:$scope.desc, price:$scope.price, category:$scope.cat});
        // $state.go("list");
        $scope.showMsg=true;
        $timeout(function(){
            $scope.showMsg=false;
            $state.go("list");
        },3000);
    }

})


/*End of Book Create Controller*/

/*Book edit Controller
 ================================

 1.populate the details of the Book which is going to be updated into form using 2 way binding.

 2. write a function to update the Book.
 call this function when submit button in Book page clicked.

 an alert message should be shown in green/Red upon successful/unsuccessful update of Book

 after successful update of Book, app should navigate to list page(Book list state)

 3.write a function to remove the form values in the Book page.
 call this function when cancel button in Book page clicked.

 * */
Capstone.controller("editController",function($scope,$stateParams,Api,$state,$timeout){
$scope.title="Update Book";
console.log($stateParams);
    $scope.id=$stateParams.id;
Api.get({id:$stateParams.id}).$promise.then(function(val){
    console.log(val.data);
    $scope.name=val.data.name;
    $scope.price=val.data.price;
    $scope.desc=val.data.description;
    $scope.cat=val.data.category;
})
$scope.submit=function(){
Api.update({id:$scope.id},{name:$scope.name, description:$scope.desc, price:$scope.price, category:$scope.cat})
// $state.go("list");
 $scope.showMsg=true;
        $timeout(function(){
            $scope.showMsg=false;
        },3000);
}
$scope.back=function(){
$state.go("list");
}

})
/*End of Book edit Controller*/


