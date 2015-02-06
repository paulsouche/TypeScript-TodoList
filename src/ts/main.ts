/// <reference path="../../interfaces.d.ts" />
/* tslint:disable:no-var-requires */
require.config({
  paths: {
    angular : './vendor/angular/angular',
    ngResource: './vendor/angular-resource/angular-resource',
    ngRoute: './vendor/angular-route/angular-route'
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
    angular: {
      exports : 'angular'
    }
  },
  baseUrl: '/'
});

require(['./js/templates'], function (app: IApp) {
  app.init();
});
/* tslint:enable:no-var-requires */
