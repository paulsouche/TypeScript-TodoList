var path = require('path'),
  istanbul = require('browserify-istanbul');;

module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../../',
    frameworks: ['jasmine', 'browserify'],
    files: [
      { pattern: 'src/ts/**/*.ts', included: false },
      'src/vendor/angular-mocks/angular-mocks.js',
      'test/unit/**/*.js'
    ],
    exclude: [],
    reporters: ['progress', 'coverage'],
    port: 9877,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'src/ts/app.ts': ['browserify']
    },
    plugins: [
      'karma-jasmine',
      'karma-browserify',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    browserify: {
      debug: true,
      plugin: ['tsify'],
      transform: ['browserify-ng-html2js', istanbul({
        ignore: '**/vendor/**'
      })],
      configure: function(bundle) {
        bundle.add(path.join(process.cwd(), 'src', 'ts', 'app.ts'));
      }
    },
    singleRun: false
  });
};
