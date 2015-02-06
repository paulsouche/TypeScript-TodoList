(function () {
  'use strict';

  var allTestFiles = Object.keys(window.__karma__.files).filter(function (file) {
    return /(Spec)\.js$/.test(file);
  });

  allTestFiles.unshift('ngMocks');
  allTestFiles.unshift('./src/ts/app');

  require.config({
    paths: {
      angular: './src/vendor/angular/angular',
      ngResource: './src/vendor/angular-resource/angular-resource',
      ngRoute: './src/vendor/angular-route/angular-route',
      ngMocks: './src/vendor/angular-mocks/angular-mocks'
    },
    shim: {
      ngResource: {
        deps: ['angular'],
        exports: 'angular'
      },
      ngRoute: {
        deps: ['angular'],
        exports: 'angular'
      },
      ngMocks: {
        deps: ['angular'],
        exports: 'angular'
      },
      angular: {
        exports: 'angular'
      }
    },
    baseUrl: '/base'
  });

  require(allTestFiles, function () {
    window.__karma__.start();
  });

})();
