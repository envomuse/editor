'use strict';

describe('Filter: periodInfoFilter', function () {

  // load the filter's module
  beforeEach(module('musicPlayerApp'));

  // initialize a new instance of the filter before each test
  var periodInfoFilter;
  beforeEach(inject(function ($filter) {
    periodInfoFilter = $filter('periodInfoFilter');
  }));

  it('should return the input prefixed with "periodInfoFilter filter:"', function () {
    var text = 'angularjs';
    expect(periodInfoFilter(text)).toBe('periodInfoFilter filter: ' + text);
  });

});
