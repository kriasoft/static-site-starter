## Static Site Starter Kit

> This is a static site project template powered by [Gulp](http://gulpjs.com/),
> [Bootstrap](http://getbootstrap.com/), [LESS](http://lesscss.org/); and
> configured for deployment to [Amazon S3](http://aws.amazon.com/s3/)
> / [CloudFront](http://aws.amazon.com/cloudfront/) (via [Travis CI](https://travis-ci.org/)).

#### Getting Started

 1. [Fork this repo](https://github.com/kriasoft/static-site-starter/fork) and rename it under your own GitHub account
 2. Open it in [GitHub for Mac](https://mac.github.com/)
    (or [GitHub for Windows](https://windows.github.com/)) and start hacking

#### Blogs & Articles

 - [Static website on S3, CloudFront and Route 53, the right way!](http://www.michaelgallego.fr/blog/2013/08/27/static-website-on-s3-cloudfront-and-route-53-the-right-way/)

#### How to Build

```
> gulp build --release
```

#### How to Deploy

If Travis CI is watching this repo, it will deploy the site automatically after
the build. Otherwise, you may deploy manually by running:

```
> gulp deploy
```

You just need to make sure that you set AWS_KEY, AWS_SECRET and AWS_BUCKET
environment properties.

#### Keeping Up-to-Date

You may want to pull and merge the latest updates from this repo back to your
local project. To do so, you simply run:

```
> git fetch upstream
> git checkout master
> git merge upstream/master
```

For more details see: [Syncing a Fork on GitHub](https://help.github.com/articles/syncing-a-fork)

#### Credits

 - Konstantin Tarkus -- [@koistya](https://twitter.com/koistya)