'use strict';

describe('Directive: fileDialog', function () {

  // load the directive's module
  beforeEach(module('musicPlayerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-dialog></file-dialog>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fileDialog directive');
  }));
});
