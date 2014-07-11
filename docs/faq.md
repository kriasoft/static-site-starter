# FAQ

#### How to deploy the site to GitHub Pages?

Install [gulp-gh-pages](https://www.npmjs.org/package/gulp-gh-pages):

    > npm install gulp-gh-pages --save-dev

Edit `gulpfile.js` file:

```javascript
    gulp.task('deploy', function () {
        gulp.src('build/**')
            .pipe($.ghPages(options));
    });
```

#### How to deploy the site via SCP?

Install [gulp-scp](https://www.npmjs.org/package/gulp-scp):

    > npm install gulp-scp --save-dev

Edit `gulpfile.js` file:

```javascript
gulp.task('deploy', function () {
    gulp.src('build/**')
        .pipe($.scp({
            host: '255.255.255.255',
            user: 'username',
            port: 22,
            path: '~/dir'
        }));
});
```