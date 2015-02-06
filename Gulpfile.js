'use strict';

var browserify = require('browserify'),
  browserSync  = require('browser-sync'),
  buffer       = require('vinyl-buffer'),
  concat       = require('gulp-concat'),
  csslint      = require('gulp-csslint'),
  cssmin       = require('gulp-cssmin'),
  fs           = require('fs'),
  gulp         = require('gulp'),
  htmlreplace  = require('gulp-html-replace'),
  KarmaServer  = require('karma').Server,
  minifyHtml   = require('gulp-minify-html'),
  ngHtml2Js    = require('browserify-ng-html2js'),
  ngTemplates  = require('gulp-ng-templates'),
  path         = require('path'),
  proxy        = require('proxy-middleware'),
  replace      = require('gulp-replace'),
  rimraf       = require('gulp-rimraf'),
  rjs          = require('gulp-requirejs'),
  runSequence  = require('run-sequence'),
  sass         = require('gulp-sass'),
  source       = require('vinyl-source-stream'),
  sourcemaps   = require('gulp-sourcemaps'),
  taskListing  = require('gulp-task-listing'),
  ts           = require('gulp-typescript'),
  tsify        = require('tsify'),
  tslint       = require('gulp-tslint'),
  uglify       = require('gulp-uglify'),
  url          = require('url'),
  proxyOptions,
  isBuilding,
  bundleName,
  build,
  dest,
  src;

proxyOptions = url.parse('http://localhost:8000/api');
proxyOptions.route = '/api';

isBuilding = false;
function rev() {
  return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
};

build = {
  base: './build/',
  css: './build/public/css/',
  fonts: './build/public/fonts/',
  index: './build/public/',
  js: './build/public/js/'
};

dest = {
  main: 'app.js',
  base: './client',
  css: './client/css/**/*.css',
  cssBase: './client/css/',
  cssmin: './client/css/app.css',
  fonts: './client/fonts/**/*',
  fontsBase: './client/fonts/',
  html: './client/**/*.html',
  js: './client/js/**/*.js',
  jsBase: './client/js',
  server: './server/**/*'
};

src = {
  main: 'app.ts',
  base: './src',
  fonts: './src/vendor/bootstrap-sass-official/assets/fonts/**/*',
  html: './src/**/*.html',
  sass: './src/scss/**/*.scss',
  ts: './src/ts/**/*.ts',
  tsbase: './src/ts'
};

function getBundler() {
  return browserify({ basedir: path.join(__dirname, src.base), debug: !isBuilding })
    .add(path.join(__dirname, src.tsbase, src.main))
    .transform(ngHtml2Js({
      module: 'appTypescript',
      baseDir: src.base
    }))
    .plugin(tsify);
}

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

gulp.task('compile-sass', function () {
  return gulp.src(src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest.cssBase));
});

gulp.task('compile-ts', function () {
  var bundler = getBundler();

  return bundler.bundle()
    .pipe(source(dest.main))
    .pipe(gulp.dest(path.join(__dirname, dest.jsBase)));
});

gulp.task('serve-watch', function () {
  gulp.watch(src.html, ['compile-ts']);
  gulp.watch(src.sass, ['compile-sass']);
  gulp.watch(src.ts, ['lint-tslint', 'compile-ts']);
  gulp.watch(dest.cssmin, ['lint-csslint']);
});

gulp.task('serve-karma', function (done) {
  return new KarmaServer({
    configFile: [process.cwd(), '/test/conf/unit-test-conf.js'].join('')
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
    .pipe(htmlreplace({
      css: ['css/', bundleName, '.min.css'].join(''),
      js: ['js/', bundleName, '.min.js'].join('')
    }))
    .pipe(gulp.dest(build.index));
});

gulp.task('build-js', function () {
  var bundler = getBundler();

  return bundler.bundle()
    .pipe(source([bundleName, '.min.js'].join('')))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(path.join(__dirname, build.js)));
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
  return runSequence('build-clean', ['build-js', 'build-css', 'build-fonts', 'build-server', 'build-index'], function () {
    isBuilding = false;
    bundleName = null;
    if (typeof cb === 'function') {
      cb();
    }
  });
});

gulp.task('compile', function (cb) {
  return runSequence('compile-clean', ['compile-ts', 'compile-sass', 'compile-fonts'], cb);
});

gulp.task('serve', function (cb) {
  return runSequence('compile', ['serve-watch', 'serve-browser-sync', 'serve-karma'], cb);
});

gulp.task('testunit', function (cb) {
  return runSequence('testunit-karma', cb);
});

gulp.task('teste2e', ['teste2e-karma']);
