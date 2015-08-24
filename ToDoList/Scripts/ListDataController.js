﻿angular.module('ToDoList').controller('ListDataController',
    function InitTodo($scope, ItemService) {
    $scope.ListItem = null;
    ItemService.GetListItems().then(function (d) {
        $scope.ListItem = d.data;
    }, function () {
        alert('Failed');
    });
    
})

.factory('ItemService', function ($http) {
    var factory = {};
    factory.GetListItems = function () {
        return $http.get('/Data/GetListItems');
    }
    return factory;
})

ToDoList.controller('ListDataController', ['$scope', '$http', function TodoCtrl($scope, $http) {
    
    $http.get('Data/GetListItems').success(function(listData){
        $scope.todos = listData;   
    });
    
    $scope.GetTotalTodos = function () {
        return $scope.todos.length;
    };

    $scope.RemoveTask = function (i) {
        $scope.todos.DeleteTodo(i);
        $scope.todos.remove(i);
    }

    $scope.AddTodo = function () {
        $scope.todos.push({ task: $scope.newTaskText, done: false });
        $scope.newItem = $scope.newTaskText;
        $http({
            method: 'POST',
            url: '/Data/PostListItem',
            data: {"ItemText": $scope.newItem},
            headers: { 'Content-Type': 'application/JSON' }
        }).
        success(function (data) {
            $scope.status = "Item saved";
            $scope.newTaskText = "";
        })        
    }

    $scope.DeleteTodo = function (itemId) {
        $http({
            method: 'DELETE',
            url: '/Data/DeleteListItem' + itemId
        })
        .success(function (data) {
            $scope.todos.remove(itemId);
            $scope.status = "Item deleted";
        })
        .error(function (error) {
            $scope.status = "Item not deleted: " + error.message;
        });
    }

    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}])