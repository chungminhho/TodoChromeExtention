"use strict";

// Declare app level module which depends on filters, and services
angular.module('modules', ['']);

angular.module('TodoApp', [
  'ngCookies',
  'modules',
  'popup.services',
  'popup.controllers'
]);
