module.exports = function (config) {
  'use strict';

  config.set({
    frameworks: ['ng-scenario'],
    files: ['../e2e/**/*.js'],
    urlRoot: '/_karma_/',
    proxies: {
      '/': 'http://localhost:8000/'
    },
    autoWatch: false,
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    reporters: ['progress'],
    browsers: ['Chrome'],
    preprocessors: {
      '/': ['ngbootstrapfix']
    }
  });
};
