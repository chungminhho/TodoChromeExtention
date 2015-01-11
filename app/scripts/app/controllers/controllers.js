angular.module('TodoApp', ['ngCookies'])
.filter("fromNow", function(){
      return function(data){
        data = data || new Date();
        return moment(data).fromNow();
      }
    })
  .controller('TodoCtrl', ['$scope', '$cookieStore', function ($scope, $cookieStore) {
    $scope.title = 'Todo';
    $scope.note = 'Nothing todo';
    $scope.typeText = 'all';
    $scope.markAll = false;

    if (!$cookieStore.get('todos')) {
      $cookieStore.put('todos', []);
    }
    if (!$cookieStore.get('completed')) {
      $cookieStore.put('completed', []);
    }
    $scope.todos = $cookieStore.get('todos');

    $scope.type = function (type) {
      $scope.typeText = type;
      if (type === 'all') {
        $scope.todos = $cookieStore.get('todos');
      } else {
        $scope.todos = $cookieStore.get('completed');
      }
    };

    function setBadge(number) {
      var badgeText = number === 0 ? '' : number;
      var noteText = number === 0 ? '' : '(' + number + ')';
      $scope.title = noteText + 'Todo';
      chrome.browserAction.setBadgeText({text: '' + badgeText});
    }

    setBadge($scope.todos.length);

    $scope.addTodo = function () {
      if (event.keyCode == 13 && $scope.todoText) {
        $scope.typeText = 'all';
        $scope.todos.push({done: false, text: $scope.todoText, date: new Date()});
        $cookieStore.put('todos', $scope.todos);
        $scope.todos = $cookieStore.get('todos');
        $scope.todoText = '';
        setBadge($scope.todos.length);
      }
    };

    $scope.isTodo = function () {
      return $scope.todos.length > 0;
    };

    $scope.toggleMarkAll = function () {
      $scope.markAll = !$scope.markAll;
      angular.forEach($scope.todos, function (todo) {
        todo.done = $scope.markAll;
      });
    };

    $scope.remaining = function () {
      var count = 0;
      angular.forEach($scope.todos, function (todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.hasDone = function () {
      return ($scope.todos.length != $scope.remaining());
    };

    $scope.itemText = function () {
      return ($scope.remaining() > 2 ? 'item' : 'items');
    };

    $scope.clear = function () {
      if ($scope.typeText === 'all') {
        var newTodo = [];
        var oldTodo = $cookieStore.get('completed');
        ;
        angular.forEach($scope.todos, function (todo) {
          if (!todo.done) {
            newTodo.push(todo);
          }
          else {
            oldTodo.push(todo);
          }
        });
        $scope.todos = [];
        $scope.todos = newTodo;
        setBadge($scope.todos.length);
        $cookieStore.put('todos', $scope.todos);
        $cookieStore.put('completed', oldTodo);
      }
      else {
        var newTodo = [];
        angular.forEach($scope.todos, function (todo) {
          if (!todo.done) {
            newTodo.push(todo);
          }
        });
        console.log(newTodo);
        $scope.todos = [];
        $scope.todos = newTodo;
        $cookieStore.put('completed', newTodo);
      }
    };

    $scope.welcomeMsg = "This is your first chrome extension";

    $scope.contribute = function () {
      chrome.tabs.create({
        url: 'https://github.com/flrent/chrome-extension-angular-base'
      })
    }
  }])
;
