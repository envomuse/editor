'use strict';

describe('Service: clockService', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var clockService;
  beforeEach(inject(function (_clockService_) {
    clockService = _clockService_;
  }));

  it('should do something', function () {
    expect(!!clockService).toBe(true);
  });

});
