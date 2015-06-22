'use strict';

describe('Filter: durationFilter', function () {

  // load the filter's module
  beforeEach(module('musicPlayerApp'));

  // initialize a new instance of the filter before each test
  var durationFilter;
  beforeEach(inject(function ($filter) {
    durationFilter = $filter('durationFilter');
  }));

  it('should return the input prefixed with "durationFilter filter:"', function () {
    var text = 'angularjs';
    expect(durationFilter(text)).toBe('durationFilter filter: ' + text);
  });

});
