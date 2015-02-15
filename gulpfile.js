/*!
 *
 *  Static Website Starter Kit
 *  Copyright 2015 Konstantin Tarkus, Kriasoft LLC. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var argv = require('minimist')(process.argv.slice(2));

// Settings
var RELEASE = !!argv.release;             // Minimize and optimize during a build?
var GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X';   // https://www.google.com/analytics/web/
var AUTOPREFIXER_BROWSERS = [             // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var src = {};
var watch = false;
var pkgs = require('./package.json').dependencies;

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, ['build/*', '!build/.git'], {dot: true}));

// 3rd party libraries
gulp.task('vendor', function () {
  return merge(
    gulp.src('node_modules/jquery/dist/*.*')
      .pipe(gulp.dest('build/vendor/jquery-' + pkgs.jquery)),
    gulp.src('node_modules/modernizr/dist/modernizr-build.min.js')
      .pipe($.rename('modernizr.min.js'))
      .pipe($.uglify())
      .pipe(gulp.dest('build/vendor/modernizr-' + pkgs.modernizr))
  );
});

// Static files
gulp.task('assets', function () {
  src.assets = 'assets/**';
  return gulp.src(src.assets)
    .pipe(gulp.dest('build'));
});

// Images
gulp.task('images', function () {
  src.images = 'images/**';
  return gulp.src(src.images)
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('build/img'));
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src('node_modules/bootstrap/fonts/**')
    .pipe(gulp.dest('build/fonts'));
});

// HTML pages
gulp.task('pages', function () {
  src.pages = ['pages/**/*', 'layouts/**/*', 'partials/**/*'];
  return gulp.src(src.pages[0])
    .pipe($.if(/\.jade$/, $.jade({
      pretty: !RELEASE,
      locals: {
        pkgs: pkgs,
        googleAnalyticsID: GOOGLE_ANALYTICS_ID
      }
    })))
    .pipe($.if(RELEASE, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true, minifyCSS: true
    })))
    .pipe(gulp.dest('build'));
});

// CSS style sheets
gulp.task('styles', function () {
  src.styles = 'styles/**/*.{css,less}';
  return gulp.src('styles/bootstrap.less')
    .pipe($.if(!RELEASE, $.sourcemaps.init()))
    .pipe($.less())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.csscomb())
    .pipe(RELEASE ? $.cssmin() : $.util.noop())
    .pipe($.rename('style.css'))
    .pipe($.if(!RELEASE, $.sourcemaps.write()))
    .pipe(gulp.dest('build/css'));
});

// JavaScript
gulp.task('scripts', function () {
  src.scripts = ['scripts/plugins.js', 'scripts/main.js'];
  return gulp.src(src.scripts)
    .pipe($.if(!RELEASE, $.sourcemaps.init()))
    .pipe($.concat('bundle.js'))
    .pipe($.if(RELEASE, $.uglify()))
    .pipe($.if(!RELEASE, $.sourcemaps.write()))
    .pipe(gulp.dest('build/js'));
});

// Build
gulp.task('build', ['clean'], function (cb) {
  runSequence(['vendor', 'assets', 'images', 'fonts', 'pages', 'styles', 'scripts'], cb);
});

// Run BrowserSync
gulp.task('serve', ['build'], function () {

  var path = require('path');
  var url = require('url');
  var fs = require('fs');
  var browserSync = require('browser-sync');

  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //     will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: './build',
      middleware: function (req, res, cb) {
        var uri = url.parse(req.url);
        if (uri.pathname.length > 1 &&
          path.extname(uri.pathname) === '' &&
          fs.existsSync('./build' + uri.pathname + '.html')) {
          req.url = uri.pathname + '.html' + (uri.search || '');
        }
        cb();
      }
    }
  });

  gulp.watch(src.assets, ['assets']);
  gulp.watch(src.images, ['images']);
  gulp.watch(src.pages, ['pages']);
  gulp.watch(src.styles, ['styles']);
  gulp.watch(src.scripts, ['scripts']);
  gulp.watch('./build/**/*.*', function(file) {
    browserSync.reload(path.relative(__dirname, file.path));
  });
  watch = true;
});

// Publish to GitHub Pages
gulp.task('deploy', function () {
  // To deploy with Travis CI:
  //   1. Generate OAuth token on GitHub > Settings > Application page
  //   2. Encrypt and save that token into the `.travis.yml` file by running:
  //      `travis encrypt GITHUB_TOKEN="<your-oauth-token>" --add`
  return gulp.src('build/**/*')
    .pipe($.if('**/robots.txt', !argv.production ? $.replace('Disallow:', 'Disallow: /') : $.util.noop()))
    .pipe($.ghPages({
      remoteUrl: 'https://' + process.env.GITHUB_TOKEN + '@github.com/{username}/{projectname}.git',
      branch: 'gh-pages'
    }));
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  require('psi').output('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});
