describe('App typescript application', function () {
  'use strict';

  var ctrl;

  beforeEach(function () {

    angular.mock.module('appTypescript');

    angular.mock.inject(function ($controller) {
      ctrl = $controller('TodoListCtrl');
    });

  });

  it('should be defined', function () {
    expect(ctrl).toBeDefined();
  });

});
