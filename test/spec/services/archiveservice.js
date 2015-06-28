'use strict';

describe('Service: archiveService', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var archiveService;
  beforeEach(inject(function (_archiveService_) {
    archiveService = _archiveService_;
  }));

  it('should do something', function () {
    expect(!!archiveService).toBe(true);
  });

});
