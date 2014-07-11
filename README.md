## Static Site Starter Kit

> This is a static site project template powered by [Gulp](http://gulpjs.com/),
> [Bootstrap](http://getbootstrap.com/), [LESS](http://lesscss.org/),
> [Assemble](http://assemble.io/), [Handlebars](http://handlebarsjs.com/); and
> pre-configured for deployment to [Amazon S3](http://aws.amazon.com/s3/)
> / [CloudFront](http://aws.amazon.com/cloudfront/)
> ([CDN](http://en.wikipedia.org/wiki/Content_delivery_network) hosting)).

#### Getting Started

 1. [Fork this repo](https://github.com/kriasoft/static-site-starter/fork) and
    rename it under your own GitHub account
 2. Open it in [GitHub for Mac](https://mac.github.com/)
    (or [GitHub for Windows](https://windows.github.com/)) and start hacking

#### Documentation

 * [FAQ](./docs/faq.md)

#### Blogs & Articles

 - [Static website on S3, CloudFront and Route 53, the right way!]
   (http://www.michaelgallego.fr/blog/2013/08/27/static-website-on-s3-cloudfront-and-route-53-the-right-way/)

#### How to Build

```
> gulp build --release
```

#### How to Deploy

If [Travis CI](https://travis-ci.org/) is watching this repo, it will deploy
the site automatically after each commit. Otherwise, you may deploy it manually
by running:

```
> gulp deploy
```

You just need to make sure that you have set AWS_KEY and AWS_SECRET environment
variables.

#### Keeping Up-to-Date

Down the road you may want to pull and merge the latest updates from this repo
back to your local project. To do so, you simply run:

```
> git fetch upstream
> git checkout master
> git merge upstream/master
```

For more details see: [Syncing a Fork on GitHub](https://help.github.com/articles/syncing-a-fork)

#### Credits

 - Konstantin Tarkus -- [@koistya](https://twitter.com/koistya)