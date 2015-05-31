'use strict';

describe('Service: playerServie', function () {

  // load the service's module
  beforeEach(module('musicPlayerApp'));

  // instantiate service
  var playerServie;
  beforeEach(inject(function (_playerServie_) {
    playerServie = _playerServie_;
  }));

  it('should do something', function () {
    expect(!!playerServie).toBe(true);
  });

});
