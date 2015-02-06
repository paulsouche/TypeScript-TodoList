describe('angularMovieApp', function () {
  'use strict';

  beforeEach(function () {
    browser().navigateTo('/');
  });

  it('should navigate to home', function () {
    expect(element('.btn-success').text()).toContain('Ajouter le Todo');
  });

});
