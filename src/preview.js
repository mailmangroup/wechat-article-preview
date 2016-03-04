/*
 * WeChat Article Preview
 * Author: Fergus Jordan
 * Version: 1.0.2
 *
 * Real-time preview of articles in WeChat's phone browser
 */
(function ( root, factory ) {

	// AMD
	if ( typeof define === 'function' && define.amd ) define( [], factory );

	// COMMONJS
	else if ( typeof exports === 'object' ) module.exports = factory();

	// BROWSER GLOBAL
	else root.articlePreview = factory();

}(this, function () {
	'use strict';

	// DECLARE ACCEPTED CONTAINER SIZES
	var sizes = {
		iphone4: {
			height: '480px',
			width: '320px'
		},
		iphone5: {
			height: '568px',
			width: '320px'
		},
		iphone6: {
			height: '667px',
			width: '375px'
		},
		iphone6plus: {
			height: '736px',
			width: '414px'
		}
	};

	// CONVERT STRING TO LOWERCASE AND STRIP SPACES TO ENSURE INPUT MATCHES ACCEPTED SIZES
	function normalizeString ( string ) {

		var normalized = string.toLowerCase().replace(/ /g,'');

		return normalized;

	};

	// EXTEND JAVASCRIPT OBJECT
	// ===============================================================================
	function extend ( defaults, options ) {

	    var extended = {};
	    var prop;

	    for (prop in defaults) {
	        if (Object.prototype.hasOwnProperty.call(defaults, prop)) extended[prop] = defaults[prop];
	    }

	    for (prop in options) {
	        if (Object.prototype.hasOwnProperty.call(options, prop)) extended[prop] = options[prop];
	    }

	    return extended;

	};

	// DECLARE CREATE ELEMENT FUNCTION
	// ===============================================================================
	function createElement ( element, className, target ) {

		element = document.createElement( element );
		if ( className ) element.className = className;
		if ( target ) target.appendChild( element );

		return element;

	}

	function articlePreview ( options ) {

		this.el = document.createElement( 'iframe' );
		this.el.id = 'article-preview';
		this.el.style.border = 'none';
		this.el.style.backgroundColor = '#F3F3F3';

		this.el.style.maxWidth = '100%';
		this.el.style.maxHeight = '100%';

		// ENSURE THAT THE CLASS IS CALLED WITH THE `new` CONSTRUCTOR
		if ( !( this instanceof articlePreview ) ) {
			throw new TypeError( 'Preview constructor cannot be called as a function.' );
		}

		// NEW PREVIEW OBJECT
		var options = extend({
			container: 'iphone4'
		}, options);

		// IF CONTAINER IS AN OBJECT > OBJECT VALUES MUST BE HEIGHT AND WIDTH
		// ===========================================================================
		if ( typeof options.container === 'object' && options.container.width && options.container.height ) {

			if ( typeof options.container.width === 'number' && typeof options.container.height === 'number' ) {

				options.container.width = options.container.width + 'px';
				options.container.height = options.container.height + 'px';

			}

			this.el.style.width = options.container.width;
			this.el.style.height = options.container.height;

		}

		// IF CONTAINER IS AN STRING > SET HEIGHT AND WIDTH ACCORDING TO WHITELIST SIZES
		// ===========================================================================
		else if ( typeof options.container == 'string' ) {

			for ( var prop in sizes ) {

				if ( sizes.hasOwnProperty( prop ) && prop == normalizeString( options.container ) ) {

					this.el.style.width = sizes[ prop ].width;
					this.el.style.height = sizes[ prop ].height;

				}

			}

		} else throw new TypeError( 'Container object contains invalid values' );

		// GENERATE MAIN BODY WRAPPERS
		// ===============================================================
		this.mainWrapper = createElement( 'div', 'rich_media_inner' );

		// PAGE CONTENT
		this.pageContent = createElement( 'div', 'preview-page-content', this.mainWrapper );

		// MEDIA PRIMARY
		this.mediaAreaPrimary = createElement( 'div', 'rich_media_area_primary', this.pageContent );

		// ARTICLE TITLE
		this.articleTitleEl = createElement( 'h2', 'rich_media_title', this.mediaAreaPrimary );

		// ARTICLE META LIST
		this.articleMetaList = createElement( 'div', 'rich_media_meta_list', this.mediaAreaPrimary );

		// ARTICLE DATE
		this.articleDateEl = createElement( 'em', 'rich_media_meta rich_media_meta_text', this.articleMetaList );

		// ARTICLE AUTHOR
		this.articleAuthorEl = createElement( 'em', 'rich_media_meta rich_media_meta_text', this.articleMetaList );

		// ACCOUNT NAME LINK
		this.accountNameEl = createElement( 'em', 'rich_media_meta rich_media_meta_link rich_media_meta_nickname', this.articleMetaList );

		// ACCOUNT NAME SPAN
		this.accountNameSpan = createElement( 'span', 'rich_media_meta rich_media_meta_text rich_media_meta_nickname', this.articleMetaList );

		// CONTENT WRAPPER
		this.contentWrapper = createElement( 'div', 'rich_media_content ', this.mediaAreaPrimary );

		// META DATA WRAPPER
		this.articleMetaData = createElement( 'div', 'rich_media_tool', this.mediaAreaPrimary );

		// META READ MORE
		this.readMoreEl = createElement( 'a', 'rich_media_meta', this.articleMetaData );

		// META PAGEVIEWS
		this.articlePageviews = createElement( 'p', 'rich_media_meta rich_media_meta_text', this.articleMetaData );

		// META LIKES ICON
		this.articleLikesIcon = createElement( 'i', 'article-like-icon', this.articleMetaData );

		// META LIKES
		this.articleLikes = createElement( 'p', 'article-likes rich_media_meta rich_media_meta_text', this.articleMetaData );

		// META REPORT OPTION
		this.articleReport = createElement( 'p', 'article-report rich_media_meta rich_media_meta_text', this.articleMetaData );
		this.clearFix = createElement( 'div', 'clearfix', this.articleMetaData );

		this.generate = function ( content ) {

			var $this = this;

			this.el.addEventListener( 'load', function ( e ) {

				// CREATE IFRAME BODY FIRST TIME GENERATE IS RUN
				// ===============================================================
				if ( !( $this.previous ) ) {

					$this.el.contentWindow.document.open();
					$this.el.contentWindow.document.write( '<!DOCTYPE html>' );
					$this.el.contentWindow.document.write( '<html>' );
					$this.el.contentWindow.document.write( '<head><meta charset="utf-8"></head>' );
					$this.el.contentWindow.document.write( '<body></body>' );
					$this.el.contentWindow.document.write( '</html>' );
					$this.el.contentWindow.document.close();

				}

				// IF MAIN WRAPPER ISNT APPENDED TO BODY › APPEND IT
				if ( !( $this.mainWrapper.parentNode ) ) $this.el.contentWindow.document.body.appendChild( $this.mainWrapper );

				// ADD CSS TO IFRAME HEAD
				if ( !cssFile ) {
					var head = $this.el.contentWindow.document.getElementsByTagName( 'head' )[ 0 ],
						cssFile = 'http://mailmangroup.github.io/wechat-article-preview/dist/preview.css';

						var cssFileEl = document.createElement( 'link' );

						cssFileEl.rel = 'stylesheet';
						cssFileEl.type = 'text/css';
						cssFileEl.href = cssFile;

						head.appendChild( cssFileEl );
				}

			});

			// IF NO PREVIOUS VALUES ARE SET › SET DEFAULTS › OVERRIDE WITH USER SET VALUES
			if ( !this.previous ){

				var content = extend({
						articleTitle: '输入标题',
						articleTime: Date.now(),
						articleAuthor: null,
						accountName: '账户名称',
						html: '开始写作',
						pageViews: 0,
						pageLikes: 0,
						readMore: false
					}, content );

			} else {

				// IF PREVIOUS VALUES ARE SET > EXTEND TO POST
				var content = extend( this.previous, content );

			}

			// SET CONTENT OF MAIN ELEMENTS
			// ===============================================================
			if ( !this.previous || this.previous.articleTitle != content.articleTitle ) this.articleTitleEl.innerHTML = content.articleTitle;

			// ARTICLE TOP META DATA
			if ( !this.previous || this.previous.accountNameEl != content.accountNameEl ) this.accountNameEl.innerHTML = content.accountName;
			if ( !this.previous || this.previous.articleAuthorEl != content.articleAuthorEl ) this.articleAuthorEl.innerHTML = content.articleAuthor;
			if ( !this.previous || this.previous.accountNameSpan != content.accountNameSpan ) this.accountNameSpan.innerHTML = content.accountName;

			// META DATA
			if ( !this.previous || this.previous.articlePageviews != content.articlePageviews ) this.articlePageviews.innerHTML = '阅读 ' + content.pageViews;
			if ( !this.previous || this.previous.articleLikes != content.articleLikes ) this.articleLikes.innerHTML = content.pageLikes;

			if ( content.readMore ) {

				this.readMoreEl.innerHTML = '阅读原文';
				this.readMoreEl.setAttribute( 'target', '_blank' );
				this.readMoreEl.setAttribute( 'href', content.readMore );

			}

			if ( !this.articleReport.innerHTML ) this.articleReport.innerHTML = '举报';

			// MAIN CONTENT
			this.contentWrapper.innerHTML = content.html;

			// FORMAT VIDEO IFRAMES
			// ===============================================================
			var videoIframe = this.contentWrapper.getElementsByClassName( 'video_iframe' );

			for ( var i = 0; i < videoIframe.length; i++ ) {

				var videoMeta = createElement( 'div', 'video-description' ),
					videoSource = videoIframe[ i ].getAttribute( 'data-src' );

					videoIframe[ i ].parentNode.insertBefore( videoMeta, videoIframe[ i ].nextSibling );

					// MATCH WITH TENCENT VIDEO
					if ( videoSource ) {

						var tencent = videoSource.match( /(http|https):\/\/(\w+:{0,1}\w*@)?((v\.qq)+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g )

						if ( tencent ) videoMeta.innerHTML = '腾讯视频';

					}

			}

			// FORMAT DATE
			// ===============================================================
			var date = new Date( content.articleTime ),
				day = date.getDate(),
				month = date.getMonth() + 1,
				year = date.getFullYear();

			if ( day <= 9 ) {
				day = '0' + day;
			}

			if ( month <= 9 ) {
				month = '0' + month;
			}

			content.articleTime = year + '-' + month + '-' + day;

			this.articleDateEl.innerHTML = content.articleTime;

			// SET SOURCES FOR IMAGES AND YOUKU LINKS
			// ===============================================================
			var dataSrcElements = this.contentWrapper.querySelectorAll( '[data-src]' );

			for ( var i = 0; i < dataSrcElements.length; i++ ) {

				dataSrcElements[ i ].src = dataSrcElements[ i ].getAttribute( 'data-src' );

				// UPDATE IMAGE SOURCES TO USE 640 WIDTH
				if ( dataSrcElements[ i ].tagName == 'IMG' ) {

					dataSrcElements[ i ].src = dataSrcElements[ i ].src.replace( /\/[0-9](?=\?wx)/, '/640' );

					dataSrcElements[ i ].style.height = 'auto';

				}

			}

			this.previous = content;

		}

	}

	return articlePreview;

}));