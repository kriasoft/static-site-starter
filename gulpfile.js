/*!
 * Static Site Starter Kit | https://github.com/kriasoft/static-site-starter
 * Copyright (c) Konstantin Tarkus, KriaSoft LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var argv = require('minimist')(process.argv.slice(2));

// Settings
var DEST = './build';
var RELEASE = Boolean(argv.release);
var GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X';
var AUTOPREFIXER_BROWSERS = [
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

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// Static files
gulp.task('assets', function () {
    return gulp.src('src/**/*.{ico,jpg,png,txt,xml}')
        .pipe(gulp.dest(DEST));
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src('node_modules/bootstrap/fonts/**')
        .pipe(gulp.dest(DEST + '/fonts'));
});

// HTML pages
gulp.task('pages', function () {
    return gulp.src(['src/**/*.{hbs,html}', '!src/layouts/**', '!src/partials/**'])
        .pipe($.if('*.hbs', $.assemble({
            partials: 'src/partials/**/*.hbs',
            layout: 'default.hbs',
            layoutdir: 'src/layouts'
        })))
        .pipe(RELEASE ? $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true, minifyCSS: true
        }) : $.util.noop())
        .pipe($.replace('UA-XXXXX-X', GOOGLE_ANALYTICS_ID))
        .pipe(gulp.dest(DEST));
});

// CSS style sheets
gulp.task('styles', function () {
    return gulp.src('src/styles/bootstrap.less')
        .pipe($.less())
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.csscomb())
        .pipe($.cssmin())
        .pipe($.rename('style.css'))
        .pipe(gulp.dest(DEST + '/css'));
});

// Build
gulp.task('build', ['clean'], function (cb) {
    runSequence(['assets', 'fonts', 'pages', 'styles'], cb);
});

// Publish
gulp.task('deploy', function () {
    var awspublish = require('gulp-awspublish');

    var aws = {
        "key": process.env.AWS_KEY,
        "secret": process.env.AWS_SECRET,
        "bucket": process.env.AWS_BUCKET,
        "region": "us-standard",
        "distributionId": "XXXXXXXX"
    };

    // Create a new publisher
    var publisher = awspublish.create(aws);

    // Define custom headers
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    return gulp.src('build/**')
        // Add a revisioned suffix to the filename for each static asset
        .pipe($.revAll({
            ignore: [
                /^\/apple-touch-icon-precomposed.png$/g,
                /^\/browserconfig.xml$/g,
                /^\/crossdomain.xml$/g,
                /^\/error.html$/g,
                /^\/favicon.ico$/g,
                /^\/humans.txt$/g,
                /^\/robots.txt$/g
            ]
        }))
        // Gzip, Set Content-Encoding headers
        .pipe(awspublish.gzip())
        // Publisher will add Content-Length, Content-Type and  headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))
        // Create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())
        // Print upload updates to console
        .pipe(awspublish.reporter())
        // Updates the Default Root Object of a CloudFront distribution
        .pipe($.cloudfront(aws));
});
