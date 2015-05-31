'use strict';

describe('Service: authServie', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var authServie;
  beforeEach(inject(function (_authServie_) {
    authServie = _authServie_;
  }));

  it('should do something', function () {
    expect(!!authServie).toBe(true);
  });

});
