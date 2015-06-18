'use strict';

describe('Service: logService', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var logService;
  beforeEach(inject(function (_logService_) {
    logService = _logService_;
  }));

  it('should do something', function () {
    expect(!!logService).toBe(true);
  });

});
