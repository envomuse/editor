'use strict';

describe('Controller: BoxCtrl', function () {

  // load the controller's module
  beforeEach(module('musicPlayerApp'));

  var BoxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoxCtrl = $controller('BoxCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
