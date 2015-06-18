'use strict';

describe('Service: editorService', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var editorService;
  beforeEach(inject(function (_editorService_) {
    editorService = _editorService_;
  }));

  it('should do something', function () {
    expect(!!editorService).toBe(true);
  });

});
