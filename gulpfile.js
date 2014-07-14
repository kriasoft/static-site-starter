/*!
 * Static Site Starter Kit | https://github.com/kriasoft/static-site-starter
 * Copyright (c) Konstantin Tarkus, KriaSoft LLC. All rights reserved. See COPYRIGHT.txt
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
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

var src = {};
var watch = false;
var reload = browserSync.reload;

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// Static files
gulp.task('assets', function () {
    src.assets = 'assets/**';
    return gulp.src(src.assets)
        .pipe(gulp.dest(DEST))
        .pipe($.if(watch, reload({stream: true})));
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src('node_modules/bootstrap/fonts/**')
        .pipe(gulp.dest(DEST + '/fonts'));
});

// HTML pages
gulp.task('pages', function () {
    src.pages = 'pages/**/*';
    return gulp.src(src.pages)
        .pipe($.if('*.hbs', $.assemble({
            partials: 'partials/**/*.hbs',
            layout: 'default',
            layoutext: '.hbs',
            layoutdir: 'layouts'
        })))
        .pipe($.if(RELEASE, $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true, minifyCSS: true
        })))
        .pipe($.replace('UA-XXXXX-X', GOOGLE_ANALYTICS_ID))
        .pipe(gulp.dest(DEST))
        .pipe($.if(watch, reload({stream: true})));
});

// CSS style sheets
gulp.task('styles', function () {
    src.styles = 'styles/**/*.{css,less}';
    return gulp.src('styles/bootstrap.less')
        .pipe($.less())
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.csscomb())
        .pipe(RELEASE ? $.cssmin() : $.util.noop())
        .pipe($.rename('style.css'))
        .pipe(gulp.dest(DEST + '/css'))
        .pipe($.if(watch, reload({stream: true})));
});

// Build
gulp.task('build', ['clean'], function (cb) {
    runSequence(['assets', 'fonts', 'pages', 'styles'], cb);
});

// Run BrowserSync
gulp.task('serve', ['build'], function () {
    browserSync({
        notify: false,
        server: { baseDir: [DEST] }
    });

    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.pages, ['pages']);
    gulp.watch(src.styles, ['styles']);
    watch = true;
});

// Publish to Amazon S3 / CloudFront
gulp.task('deploy', function () {
    var awspublish = require('gulp-awspublish');
    var aws = {
        "key": process.env.AWS_KEY,
        "secret": process.env.AWS_SECRET,
        "bucket": 'XXXXXXXX',
        "region": 'us-standard',
        "distributionId": 'XXXXXXXX'
    };
    var publisher = awspublish.create(aws);
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
                /^\/humans.txt$/g,
                /^\/robots.txt$/g
            ]
        }))
        // Gzip, set Content-Encoding headers
        .pipe(awspublish.gzip())
        // Publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))
        // Create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())
        // Print upload updates to console
        .pipe(awspublish.reporter())
        // Updates the Default Root Object of a CloudFront distribution
        .pipe($.cloudfront(aws));
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
    // By default, we use the PageSpeed Insights free (no API key) tier.
    // You can use a Google Developer API key if you have one.
    // See http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
    url: 'https://example.com',
    strategy: 'mobile'
}));