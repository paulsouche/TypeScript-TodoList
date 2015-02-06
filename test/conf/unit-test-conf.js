var path = require('path');

module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../../',
    frameworks: ['jasmine'],
    files: [
      './node_modules/es6-shim/es6-shim.js',
      './node_modules/systemjs/dist/system.src.js',
      './node_modules/angular2/bundles/angular2.dev.js',
      './node_modules/angular2/bundles/router.dev.js',
      './node_modules/angular2/bundles/http.dev.js',
      { pattern: './src/**/*.ts', included: false },
      'test/unit/bootstrap.js'
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
      'src/**/*.ts': ['typescript'],
      'src/ts/**/*.ts': ['coverage']
    },
    plugins: [
      'karma-jasmine',
      'karma-typescript-preprocessor',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    typescriptPreprocessor: {
      options: {
        sourceMap: true,
        module: 'commonjs',
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        target: "es5",
        noImplicitAny: true,
        removeComments: true
      },
      transformPath: function (path) {
        return path.replace(/\.ts$/, '.js');
      }
    },
    singleRun: false
  });
};
