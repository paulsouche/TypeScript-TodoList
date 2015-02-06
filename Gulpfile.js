'use strict';

var browserSync = require('browser-sync'),
  concat        = require('gulp-concat'),
  csslint       = require('gulp-csslint'),
  cssmin        = require('gulp-cssmin'),
  fs            = require('fs'),
  gulp          = require('gulp'),
  htmlreplace   = require('gulp-html-replace'),
  KarmaServer   = require('karma').Server,
  minifyHtml    = require('gulp-minify-html'),
  ngTemplates   = require('gulp-ng-templates'),
  proxy         = require('proxy-middleware'),
  replace       = require('gulp-replace'),
  rimraf        = require('gulp-rimraf'),
  rjs           = require('gulp-requirejs'),
  runSequence   = require('run-sequence'),
  sass          = require('gulp-sass'),
  sourcemaps    = require('gulp-sourcemaps'),
  taskListing   = require('gulp-task-listing'),
  ts            = require('gulp-typescript'),
  tslint        = require('gulp-tslint'),
  uglify        = require('gulp-uglify'),
  url           = require('url'),
  proxyOptions,
  isBuilding,
  bundleName,
  requireCfg,
  build,
  dest,
  src;

proxyOptions = url.parse('http://localhost:8000/api');
proxyOptions.route = '/api';

isBuilding = false;
function rev() {
  return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
};

requireCfg = {
  paths: {
    angular: '../../src/vendor/angular/angular',
    ngResource: '../../src/vendor/angular-resource/angular-resource',
    ngRoute: '../../src/vendor/angular-route/angular-route'
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
      exports: 'angular'
    }
  }
};

build = {
  base: './build/',
  css: './build/public/css/',
  fonts: './build/public/fonts/',
  index: './build/public/',
  js: './build/public/js/'
};

dest = {
  base: './client',
  css: './client/css/**/*.css',
  cssBase: './client/css/',
  cssmin: './client/css/app.css',
  fonts: './client/fonts/**/*',
  fontsBase: './client/fonts/',
  html: './client/**/*.html',
  js: './client/js/**/*.js',
  jsBase: './client/js/',
  server: './server/**/*'
};

src = {
  base: './src',
  fonts: './src/vendor/bootstrap-sass-official/assets/fonts/**/*',
  html: './src/**/*.html',
  requirejs: './src/vendor/requirejs/require.js',
  sass: './src/scss/**/*.scss',
  ts: './src/ts/**/*.ts'
};

gulp.task('lint-csslint', function () {
  return gulp.src(dest.cssmin)
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('lint-tslint', function () {
  var rules = JSON.parse(fs.readFileSync('.tslintrc', 'utf-8'));
  return gulp.src(src.ts)
    .pipe(tslint({
      configuration: rules
    }))
    .pipe(tslint.report('verbose', {
      emitError: false
    }));
});

gulp.task('compile-clean', function () {
  return gulp.src([dest.jsBase, dest.cssBase, dest.fontsBase])
    .pipe(rimraf());
});

gulp.task('compile-fonts', function () {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fontsBase));
});

gulp.task('compile-ng-templates', function () {
  var fileName = isBuilding ? [bundleName, 'js'].join('.') : 'templates.js'

  function header() {
    return [
      'define(["require", "exports", "./app"], function(require, exports, app) {',
      'app.run(["$templateCache", function($templateCache) {'
    ].join('');
  }

  function footer() {
    return [
      '}]);',
      isBuilding ? '' : 'return app;',
      '});'
    ].join('');
  }

  return gulp.src(src.html)
    .pipe(minifyHtml({
      empty: true
    }))
    .pipe(ngTemplates({
      filename: fileName,
      footer: footer(),
      path: function (path, base) {
        return path.replace(base, '');
      },
      header: header()
    }))
    .pipe(gulp.dest(dest.jsBase));
});

gulp.task('compile-sass', function () {
  return gulp.src(src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest.cssBase));
});

gulp.task('compile-ts', function () {
  return gulp.src(src.ts)
    .pipe(sourcemaps.init())
    .pipe(ts({
      module: 'amd',
      noImplicitAny: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest.jsBase));
});

gulp.task('serve-watch', function () {
  gulp.watch(src.html, ['compile-ng-templates']);
  gulp.watch(src.sass, ['compile-sass']);
  gulp.watch(src.ts, ['lint-tslint', 'compile-ts']);
  gulp.watch(dest.cssmin, ['lint-csslint']);
});

gulp.task('serve-karma', function (done) {
  return new KarmaServer({
    configFile: [process.cwd(), '/test/conf/unit-test-conf.js'].join(''),
    singleRun: false
  }, done).start();
});

gulp.task('serve-browser-sync', function () {
  return browserSync({
    port: 8001,
    files: [
      dest.js,
      dest.css,
      dest.html
    ],
    injectChanges: true,
    logFileChanges: false,
    logLevel: 'silent',
    notify: true,
    reloadDelay: 0,
    server: {
      baseDir: [dest.base, src.base],
      middleware: [proxy(proxyOptions)]
    }
  });
});

gulp.task('build-clean', function () {
  return gulp.src(build.base)
    .pipe(rimraf());
});

gulp.task('build-css', function () {
  return gulp.src(dest.css)
    .pipe(concat([bundleName, 'min', 'css'].join('.')))
    .pipe(cssmin())
    .pipe(gulp.dest(build.css));
});

gulp.task('build-fonts', function () {
  return gulp.src(dest.fonts)
    .pipe(gulp.dest(build.fonts));
});

gulp.task('build-index', function () {
  return gulp.src(dest.html)
    .pipe(replace(/<(html)>/, '<$1 ng-app="appTypescript">'))
    .pipe(htmlreplace({
      css: ['css/', bundleName, '.min.css'].join(''),
      js: { src: 'js/require.js', tpl: ['<script src="%s" data-main="/js/', bundleName, '.js"></script>'].join('') }
    }))
    .pipe(gulp.dest(build.index));
});

gulp.task('build-js', function () {
  var moduleName = isBuilding ? bundleName : 'templates'
  return rjs({
    name: moduleName,
    baseUrl: dest.jsBase,
    mainConfigFile: [dest.jsBase, 'main.js'].join('/'),
    out: [moduleName, 'js'].join('.'),
    paths: requireCfg.paths,
    shim: requireCfg.shim,
  })
    .pipe(uglify())
    .pipe(gulp.dest(build.js));
});

gulp.task('build-require', function () {
  return gulp.src(src.requirejs)
    .pipe(gulp.dest(build.js));
});

gulp.task('build-server', function () {
  return gulp.src(dest.server)
    .pipe(gulp.dest(build.base));
});

gulp.task('testunit-karma', function (done) {
  return new KarmaServer({
    configFile: [process.cwd(), '/test/conf/unit-test-conf.js'].join(''),
    singleRun: true,
    coverageReporter: {
      type: 'html',
      dir: 'reports/coverage'
    }
  }, done).start();
});

gulp.task('teste2e-karma', function (done) {
  new KarmaServer({
    configFile: [process.cwd(), '/test/conf/e2e-test-conf.js'].join('')
  }).start();
  done();
});

// gulp API

gulp.task('ls', taskListing);

gulp.task('default', ['ls']);

gulp.task('build', function (cb) {
  isBuilding = true;
  bundleName = [rev(), 'appTypeScript'].join('');
  return runSequence(['build-clean', 'compile'], ['build-js', 'build-css', 'build-fonts', 'build-require', 'build-server', 'build-index'], function () {
    isBuilding = false;
    bundleName = null;
    if (typeof cb === 'function') {
      cb();
    }
  });
});

gulp.task('compile', function (cb) {
  return runSequence('compile-clean', ['compile-ts', 'compile-sass', 'compile-ng-templates', 'compile-fonts'], cb);
});

gulp.task('serve', function (cb) {
  return runSequence('compile', ['serve-watch', 'serve-browser-sync', 'serve-karma'], cb);
});

gulp.task('testunit', function (cb) {
  return runSequence('compile', 'testunit-karma', cb);
});

// I shamously failed to have ng-scenario work on gulp && requirejs
// according to https://github.com/tapmantwo/karma-ng-bootstrap-fix-preprocessor
// the problem is that the ng-app atrribute is missing when manually bootstraped
// if you want to teach me life, be my guest
// but it works on build because the bundle is synchrounously loaded

// gulp.task('teste2e', ['teste2e-karma']);
