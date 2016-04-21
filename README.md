# WeChat Article Preview
[![wechat-article-preview version](https://img.shields.io/badge/wechat--article--preview-v1.0.9-brightgreen.svg)](https://github.com/mailmangroup/wechat-article-preview/) [![License](http://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)


## Installation

```
$ bower install wechat-article-preview
```


## Usage

```javascript
var article = new articlePreview( options );

article.generate( { ... } ); // Accepts object with content
```

## Options

### options.container

Type: `string`

Default: `iphone4`

This will specify the size of the container.

```javascript
{
    container: 'iphone6'
}
```

## Content

### content.html

Type: `string`

Default: `开始写作`

This is the main content of the article. This should be a string of valid HTML using tags that are supported by the WeChat platform.

```javascript
{
    html: '<section style="background-color:rgb(255,255,255); box-sizing: border-box;">Post content</section>'
}
```

### content.articleTitle

Type: `string`

Default: `输入标题`

This is the title of the article for the generated preview.

```javascript
{
    articleTitle: 'Lorem ipsum dolor sit amet'
}
```

### content.articleAuthor

Type: `string`

Default: `null`

This is the author of the article which appears in the top meta data below the title.

```javascript
{
    articleAuthor: 'Fergus'
}
```

### content.articleTime

Type: `timestamp`

Default: `new Date()`

This is the date the article is published and appears at the top of the post.

```javascript
{
    postTime: 1444905243050
}
```

### content.accountName

Type: `string`

Default: `账户名称`

Required

This is the name of the WeChat account the article is published by.

```javascript
{
    accountName: '利物浦足球俱乐部'
}
```

## Meta information

Also included is the ability to set the amount of pageviews and likes, as well as a 'Read more' link so you can generate previews for published posts.

### content.pageViews

Type: `string` or `number`

Default: `0`

```javascript
{
    pageLikes: '10,109'
}
```

### content.pageLikes

Type: `string or `number`

Default: `0`

```javascript
{
    pageLikes: '235'
}
```

### content.readMore

Type: `string`

Default: `false`

```javascript
{
    readMore: 'http://github.com/mailmangroup/wechat-article-preview'
}
```