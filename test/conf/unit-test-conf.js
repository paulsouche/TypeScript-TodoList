module.exports = function (config) {

  'use strict';

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../../src',
    // frameworks to use
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      'vendor/angular/angular.js',
      'vendor/angular-route/angular-route.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-mocks/angular-mocks.js',
      'ts/**/*.ts',
      '../test/unit/**/*.js'
    ],
    // list of files to exclude
    exclude: [],
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],
    // web server port
    port: 9877,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'ts/**/*.ts': ['typescript', 'coverage']
    },
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-typescript-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    typescriptPreprocessor: {
      options: {
        sourceMap: true,
        target: 'ES5',
        noImplicitAny: true,
        noResolve: false,
        removeComments: true,
        concatinateOutput: false
      },
      transformPath: function (path) {
        return path.replace(/\.ts$/, '.js');
      }
    },
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
