beforeEach(module("Capstone",'ui.bootstrap','ui.router','ngResource'));

describe("Main testing",function(){
var Api,$http;
beforeEach(inject(function(_Api_,$httpBackend){
        Api = _Api_;
        $http = $httpBackend;
    })) 
afterEach(function(){
    $http.verifyNoOutstandingExpectation();
})
 
        function testURL(url){
            return true;
        }


    it("should test $resource GET",function(){ 
        $http.expectGET(testURL).
        respond(200,{name:"ebin", description:'desc', price:"25k", category:"human"})

        Api.get().$promise.then(function(data){
            expect(data.data).toEqual({name:"ebin", description:'desc', price:"25k", category:"human"});
        });
        
    })

    it("should test $resource POST",function(){ 
        $http.expectPOST(testURL,{name:"ebin", description:'desc', price:"25k", category:"human"}).
        respond(201,{})

        Api.create({id:0},
        {name:"ebin", description:'desc', price:"25k", category:"human"});
        expect($http.flush).not.toThrow();
    })

    it("should test $resource PUT",function(){ 
        $http.expectPUT(testURL,{name:"ebin", description:'desc', price:"25k", category:"human"}).
        respond(201,{})

        Api.update({id:0},
        {name:"ebin", description:'desc', price:"25k", category:"human"});
        expect($http.flush).not.toThrow();
    })

    // it("should test $resource DELETE",function(){ 
    //     $http.expectPUT().
    //     respond(201,{})

    //     Api.remove({id:0});
    //     expect($http.flush).not.toThrow();
    // })



})

describe("Controller unit testing",function(){
    it("tests controllers",function(){
        $scope={};
        // $scope.submit();
        $location = {};
        
        inject(function(_$controller_,_$state_,_$timeout_,_$location_){
            $location = _$location_;
            _$controller_('createController',{$scope:$scope})

        })
        $scope.submit();

        expect($scope.showMsg).toBe(true)
    })
})