'use strict';

describe('Service: dbservice', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var dbservice;
  beforeEach(inject(function (_dbservice_) {
    dbservice = _dbservice_;
  }));

  it('should do something', function () {
    expect(!!dbservice).toBe(true);
  });

});
