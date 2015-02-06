describe('angularMovieApp', function () {
  'use strict';

  beforeEach(function () {
    browser().navigateTo('/');
  });

  it('should navigate to home', function () {
    sleep(2);
    expect(element('.btn-success').text()).toContain('Ajouter le Todo');
  });

});
