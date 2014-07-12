# Frequently Asked Questions (FAQ)

* [How to deploy the site to GitHub Pages?](#how-to-deploy-the-site-to-github-pages)
* [How to deploy the site via SCP?](#how-to-deploy-the-site-via-scp)
* [How to securely store sensitive data in my public repository?](#how-to-securely-store-sensitive-data-in-my-public-repo)

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

### How to securely store sensitive data in my public repo?

If you're using a public Git repository for your site, you should never embed
your passwords and keys as plain text into your source code. Travis CI allows
you to store passwords and keys securely by encrypting them with a public key.
For more information visit http://docs.travis-ci.com/user/encryption-keys/

If you don't have Ruby installed, you can use Node.js-based [travis-encrypt]
(https://www.npmjs.org/package/travis-encrypt) utility to encrypt and save
your passwords and keys in [.travis.yml](../.travis.yml) file.