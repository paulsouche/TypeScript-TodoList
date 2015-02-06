(function() {
  'use strict';

  window.__karma__.loaded = function() {};

  var allTestFiles = Object.keys(window.__karma__.files).filter(function (file) {
    return /(Spec)\.js$/.test(file);
  });

  System.config({
      packages: {'base/src': {defaultExtension: 'js'}}
  });
  Promise.all(allTestFiles
    .map(function (url) {
      return System.import(url);
    }))
    .then(function (modules) {
      window.__karma__.start();
    });

})();
