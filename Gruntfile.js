module.exports = function (grunt) {
  'use strict';
  var proxy      = require('proxy-middleware'),
    url          = require('url'),
    proxyOptions = url.parse('http://localhost:8000/api');

  proxyOptions.route = '/api';
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    assetsDir: 'src',
    destDir: 'client',
    serverDir: 'server',
    distDir: 'build',
    distClient: '<%= distDir %>/public',
    testsDir: 'test',
    availabletasks: {
      tasks: {
        options: {
          filter: 'include',
          groups: {
            Development: ['compile', 'dev', 'testunit', 'teste2e', 'report'],
            Production: ['build']
          },
          sort: ['compile', 'dev', 'testunit', 'teste2e', 'report', 'package', 'ci'],
          descriptions: {
            compile: 'Build your assets',
            dev: 'Launch the static server and watch tasks',
            testunit: 'Run unit tests and show coverage report',
            teste2e: 'Run end-to-end tests',
            build: 'Package your web app for distribution'
          },
          tasks: ['compile', 'dev', 'testunit', 'teste2e', 'build']
        }
      }
    },
    'bower-install': {
      target: {
        src: '<%= assetsDir %>/index.html',
        ignorePath: '<%= assetsDir %>/',
        jsPattern: '<script type="text/javascript" src="{{filePath}}"></script>',
        cssPattern: '<link rel="stylesheet" href="{{filePath}}" >'
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ['<%= destDir %>/**/*.html', '<%= destDir %>/**/*.js', '<%= destDir %>/**/*.css']
        },
        options: {
          host: 'localhost',
          port: '8001',
          watchTask: true,
          ghostMode: {
            clicks: true,
            scroll: true,
            links: false, // must be false to avoid interfering with angular routing
            forms: true
          },
          server: {
            baseDir: ['<%= assetsDir %>', '<%= destDir %>'],
            middleware: [proxy(proxyOptions)]
          }
        }
      }
    },
    clean: {
      dist: ['.tmp', '<%= distDir %>'],
      dest: ['<%= destDir %>/js', '<%= destDir %>/css', '<%= destDir %>/fonts']
    },
    connect: {
      plato: {
        options: {
          port: 8889,
          base: 'reports/complexity',
          keepalive: true,
          open: true
        }
      }
    },
    copy: {
      assets: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= assetsDir %>/vendor/bootstrap-sass-official/assets/fonts',
          dest: '<%= destDir %>/fonts',
          src: ['**/*']
        }]
      },
      client: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= destDir %>',
          dest: '<%= distClient %>/',
          src: ['index.html', 'img/**', 'fonts/**']
        }]
      },
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= serverDir %>',
          dest: '<%= distDir %>/',
          src: ['**']
        }]
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: ['<%= destDir %>/css/app.css']
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: false,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: '<%= destDir %>/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= distClient %>/'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dest: {
        src: ['<%= destDir %>/js/**/*.js']
      },
      unit: {
        options: {
          jshintrc: '<%= testsDir %>/.jshintrc'
        },
        src: ['<%= testsDir %>/unit/**/*.js']
      },
      e2e: {
        options: {
          jshintrc: '<%= testsDir %>/.jshintrc'
        },
        src: ['<%= testsDir %>/e2e/**/*.js']
      }
    },
    karma: {
      dev_unit: {
        options: {
          configFile: 'test/conf/unit-test-conf.js',
          background: true,  // The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.
          singleRun: false,
          autoWatch: true,
          reporters: ['progress']
        }
      },
      dist_unit: {
        options: {
          configFile: 'test/conf/unit-test-conf.js',
          background: false,
          singleRun: true,
          autoWatch: false,
          reporters: ['progress', 'coverage'],
          coverageReporter: {
            type: 'html',
            dir: '../reports/coverage'
          }
        }
      },
      e2e: {
        options: {
          configFile: 'test/conf/e2e-test-conf.js'
        }
      }
    },
    ngtemplates: {
      dist: {
        cwd: '<%= assetsDir %>',
        src: 'partials/**/*.html',
        dest: '<%= destDir %>/js/templates.js',
        options: {
          module: 'appTypescript',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          }
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= distClient %>/js/{,*/}*.js',
            '<%= distClient %>/css/{,*/}*.css'
          ]
        }
      }
    },
    sass: {
      options: {
        style: 'expanded',
        trace: true
      },
      all: {
        files: {
          '<%= destDir %>/css/app.css': '<%= assetsDir %>/scss/app.scss',
          '<%= destDir %>/css/bootstrap.css': '<%= assetsDir %>/scss/bootstrap.scss'
        }
      }
    },
    ts: {
      all: {
        src: ['<%= assetsDir %>/ts/app.ts'],
        out: '<%= destDir %>/js/app.js',
        options: {
          removeComments: true,
          sourceMap: true,
          declaration: true
        }
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON('.tslintrc')
      },
      base: {
        src: ['<%= assetsDir %>/ts/**/*.ts']
      }
    },
    usemin: {
      html: '<%= distClient %>/index.html'
    },
    useminPrepare: {
      options: {
        dest: '<%= distClient %>/',
        assetsDirs: ['<%= assetsDir %>', '<%= destDir %>']
      },
      appTypeScript: '<%= destDir %>/index.html'
    },
    watch: {
      options: {
        interrupt: true
      },
      js: {
        files: ['<%= destDir %>/js/app.js'],
        tasks: ['jshint']
      },
      unit: {
        files: ['<%= testsDir %>/unit/**/*.js'],
        tasks: ['newer:jshint:unit', 'karma:dev_unit:run']
      },
      e2e: {
        files: ['<%= testsDir %>/e2e/**/*.js'],
        tasks: ['newer:jshint:e2e']
      },
      html: {
        files: ['<%= assetsDir %>/**/*.html'],
        tasks: ['ngtemplates']
      },
      css: {
        files: ['<%= destDir %>/css/app.css'],
        tasks: ['csslint']
      },
      scss: {
        files: ['<%= assetsDir %>/scss/**/*.scss'],
        tasks: ['sass:all']
      },
      ts: {
        files: ['<%= assetsDir %>/ts/**/*.ts'],
        tasks: ['tslint', 'ts']
      }
    }
  });

  grunt.registerTask('compile', ['clean:dest', 'copy:assets', 'ngtemplates', 'sass', 'csslint', 'tslint', 'ts', 'jshint:dest'])
  grunt.registerTask('teste2e', ['karma:e2e']);
  grunt.registerTask('testunit', ['karma:dist_unit:start']);
  grunt.registerTask('dev', ['compile', 'browserSync', 'karma:dev_unit:start', 'watch']);
  grunt.registerTask('build', ['clean:dist', 'compile', 'useminPrepare', 'copy:client', 'copy:server', 'concat', 'uglify', 'cssmin', 'rev', 'imagemin', 'usemin']);
  grunt.registerTask('ls', ['availabletasks']);
  grunt.registerTask('default', ['ls']);

};
