## Static Site Starter Kit

> This is a static site project template powered by Gulp, Bootstrap, LESS;
> and configured for deployment to [Amazon S3](http://aws.amazon.com/s3/)
> / [CloudFront](http://aws.amazon.com/cloudfront/) (via [Travis CI](https://travis-ci.org/)).

#### Related Articles

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

#### Credits

 - Konstantin Tarkus -- [@koistya](https://twitter.com/koistya)