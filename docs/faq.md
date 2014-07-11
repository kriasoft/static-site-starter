# Frequently Asked Questions (FAQ)

* [How to deploy the site to GitHub Pages?](#how-to-deploy-the-site-to-github-pages)
* [How to deploy the site via SCP?](#how-to-deploy-the-site-via-scp)

### How to deploy the site to [GitHub Pages](https://pages.github.com)?

Install [gulp-gh-pages](https://www.npmjs.org/package/gulp-gh-pages):

    > npm install gulp-gh-pages --save-dev

Edit [gulpfile.js](../gulpfile.js) file:

```javascript
gulp.task('deploy', function () {
    return gulp.src('build/**')
        .pipe($.ghPages(options));
});
```

### How to deploy the site via [SCP](http://en.wikipedia.org/wiki/Secure_copy)?

Install [gulp-scp](https://www.npmjs.org/package/gulp-scp):

    > npm install gulp-scp --save-dev

Edit [gulpfile.js](../gulpfile.js) file:

```javascript
gulp.task('deploy', function () {
    return gulp.src('build/**')
        .pipe($.scp({
            host: '255.255.255.255',
            user: 'username',
            port: 22,
            path: '~/dir'
        }));
});
```