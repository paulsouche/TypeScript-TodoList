module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../../',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      { pattern: 'src/vendor/angular/angular.js', included: false },
      { pattern: 'src/vendor/angular-route/angular-route.js', included: false },
      { pattern: 'src/vendor/angular-resource/angular-resource.js', included: false },
      { pattern: 'src/vendor/angular-mocks/angular-mocks.js', included: false },
      { pattern: 'src/ts/**/*.ts', included: false },
      { pattern: 'test/unit/**/*.js', included: false },
      'test/unit/test-config.js'
    ],
    exclude: [
      'src/ts/main.ts'
    ],
    reporters: ['progress', 'coverage'],
    port: 9877,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'src/ts/**/*.ts': ['typescript', 'coverage']
    },
    plugins: [
      'karma-jasmine',
      'karma-requirejs',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-typescript-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    typescriptPreprocessor: {
      options: {
        sourceMap: true,
        module: 'amd',
        noImplicitAny: true,
        removeComments: true
      },
      typings: [
        'interfaces.d.ts'
      ],
      transformPath: function (path) {
        return path.replace(/\.ts$/, '.js');
      }
    },
    singleRun: false
  });
};
