# FAQ

#### How to deploy the site to GitHub Pages?

```
var gulp = require('gulp');
var deploy = require("gulp-gh-pages");

gulp.task('deploy', function () {
    gulp.src('build/**')
        .pipe(deploy(options));
});
```

#### How to deploy the site via SCP?

```
var gulp = require('gulp');
var scp = require('gulp-scp');

gulp.task('deploy', function () {
    gulp.src('build/**')
        .pipe(scp({
            host: '255.255.255.255',
            user: 'username',
            port: 22,
            path: '~/dir'
        }));
});
```