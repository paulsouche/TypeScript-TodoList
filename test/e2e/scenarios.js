describe('angularMovieApp', function () {
  'use strict';

  it('should navigate to home', function () {
    browser().navigateTo('/index.html#/');
    expect(element('.btn-success').text()).toContain('Ajouter le Todo');
  });

});
