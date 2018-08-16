/*
 * WeChat Article Preview
 * Author: Fergus Jordan
 * Version: 1.0.16
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
	}


	// EXTEND JAVASCRIPT OBJECT
	// =============================================================================================
	function extend ( defaults, options ) {

		var extended = {},
			prop;

		for (prop in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, prop)) extended[prop] = defaults[prop];
		}

		for (prop in options) {
			if (Object.prototype.hasOwnProperty.call(options, prop)) extended[prop] = options[prop];
		}

		return extended;

	}


	// DECLARE CREATE ELEMENT FUNCTION
	// =============================================================================================
	function createElement ( element, className, target ) {

		element = document.createElement( element );
		if ( className ) element.className = className;
		if ( target ) target.appendChild( element );

		return element;

	}

	function articlePreview ( options ) {

		var $this = this;

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

		this.cssFilePath = options.cssFilePath;
		this.cssText = options.cssText;


		// IF CONTAINER IS AN OBJECT > OBJECT VALUES MUST BE HEIGHT AND WIDTH
		// =========================================================================================
		if ( typeof options.container === 'object' && options.container.width && options.container.height ) {

			if ( typeof options.container.width === 'number' && typeof options.container.height === 'number' ) {

				options.container.width = options.container.width + 'px';
				options.container.height = options.container.height + 'px';

			}

			this.el.style.width = options.container.width;
			this.el.style.height = options.container.height;

		}


		// IF CONTAINER IS AN STRING > SET HEIGHT AND WIDTH ACCORDING TO WHITELIST SIZES
		// =========================================================================================
		else if ( typeof options.container === 'string' ) {

			for ( var prop in sizes ) {

				if ( sizes.hasOwnProperty( prop ) && prop === normalizeString( options.container ) ) {

					this.el.style.width = sizes[ prop ].width;
					this.el.style.height = sizes[ prop ].height;

				}

			}

		} else throw new TypeError( 'Container object contains invalid values' );


		// GENERATE MAIN BODY WRAPPERS
		// =========================================================================================
		this.mainWrapper = createElement( 'div', 'rich_media_inner' );

		// PAGE CONTENT
		this.pageContent = createElement( 'div', 'preview-page-content', this.mainWrapper );

		// MEDIA PRIMARY
		this.mediaAreaPrimary = createElement( 'div', 'rich_media_area_primary', this.pageContent );

		var observer = new MutationObserver( function() {
			$this.updateHeight();
		});

		observer.observe( this.mediaAreaPrimary, {
			childList: true,
			attributes: true,
			characterData: true,
			subtree: true
		});

		window.addEventListener( 'resize', function() {
			$this.updateHeight();
		});

		if ( !options.onlyContent ) {

			// ARTICLE TITLE
			this.articleTitleEl = createElement( 'h2', 'rich_media_title rich_media_title_ios', this.mediaAreaPrimary );

			// ARTICLE META LIST
			this.articleMetaList = createElement( 'div', 'rich_media_meta_list', this.mediaAreaPrimary );

			// ARTICLE AUTHOR
			this.articleAuthorEl = createElement( 'em', 'rich_media_meta rich_media_meta_text', this.articleMetaList );

			// ACCOUNT NAME LINK
			this.accountNameEl = createElement( 'em', 'rich_media_meta rich_media_meta_link rich_media_meta_nickname', this.articleMetaList );

			// ARTICLE DATE
			this.articleDateEl = createElement( 'em', 'rich_media_meta rich_media_meta_text', this.articleMetaList );
		}

		// CONTENT WRAPPER
		this.contentWrapper = createElement( 'div', 'rich_media_content ', this.mediaAreaPrimary );

		if ( !options.onlyContent ) {

			// META DATA WRAPPER
			this.articleMetaData = createElement( 'div', 'rich_media_tool', this.mediaAreaPrimary );

			// META READ MORE
			this.readMoreEl = createElement( 'a', 'media_tool_meta meta_primary', this.articleMetaData );

			// META PAGEVIEWS
			this.articlePageviews = createElement( 'div', 'media_tool_meta tips_global_primary meta_primary', this.articleMetaData );

			// META LIKES
			this.articleLikes = createElement( 'span', 'media_tool_meta meta_extra meta_praise', this.articleMetaData );

			// META LIKES ICON
			this.articleLikesIcon = createElement( 'i', 'icon_praise_gray', this.articleLikes );

			this.articleLikesNum = createElement( 'span', 'praise_num', this.articleLikes );

			this.clearFix = createElement( 'div', 'clearfix', this.articleMetaData );

		}

		this.el.addEventListener( 'load', function () {


			// CREATE IFRAME BODY FIRST TIME GENERATE IS RUN
			// =====================================================================================
			if ( !( $this.previous ) ) {

				$this.el.contentWindow.document.open();
				$this.el.contentWindow.document.write( '<!DOCTYPE html>' );
				$this.el.contentWindow.document.write( '<html>' );
				$this.el.contentWindow.document.write( '<head><meta charset="utf-8"></head>' );
				$this.el.contentWindow.document.write( '<body></body>' );
				$this.el.contentWindow.document.write( '</html>' );
				$this.el.contentWindow.document.close();

				if ( parseInt( $this.el.style.width ) >= 375 )
					$this.el.contentWindow.document.body.classList.add( 'article-preview-large-device' );
			}

			// IF MAIN WRAPPER ISNT APPENDED TO BODY › APPEND IT
			if ( !( $this.mainWrapper.parentNode ) || $this.mainWrapper.parentNode !== $this.el.contentWindow.document.body ) $this.el.contentWindow.document.body.appendChild( $this.mainWrapper );

			$this.el.contentWindow.document.body.classList.add( 'appmsg_skin_default', 'appmsg_style_default', 'rich_media_empty_extra' );

			// ADD CSS TO IFRAME HEAD
			if ( !style ) {

				var head = $this.el.contentWindow.document.getElementsByTagName( 'head' )[ 0 ],
					cssFile = $this.cssFilePath || '//mailmangroup.github.io/wechat-article-preview/dist/preview.css';

				var style;

				if ( $this.cssText ) {

					style = document.createElement( 'style' );
					style.innerHTML = $this.cssText;

				} else {

					style = document.createElement( 'link' );

					style.rel = 'stylesheet';
					style.type = 'text/css';
					style.href = cssFile;
				}

				head.appendChild( style );
			}

			$this.updateVideoDimensions();

			$this.updateHeight();

		});


		// =========================================================================================
		this.generate = function ( content ) {

			// IF NO PREVIOUS VALUES ARE SET › SET DEFAULTS › OVERRIDE WITH USER SET VALUES
			if ( !this.previous ) {

				content = extend({
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
				content = extend( this.previous, content );
			}

			// MAIN CONTENT
			if ( content.html && ( !this.previous || this.previous.html !== content.html ) )
				this.contentWrapper.innerHTML = content.html;

			else if ( !content.html || content.html === '' ) this.contentWrapper.innerHTML = '开始写作';

			// FORMAT IMAGES, IFRAMES, ETC.
			this.formatContent();


			if ( options.onlyContent ) {
				this.previous = content;
				return;
			}


			// SET CONTENT OF MAIN ELEMENTS
			// =====================================================================================
			if ( content.articleTitle && ( !this.previous || this.previous.articleTitle !== content.articleTitle ) )
				this.articleTitleEl.innerHTML = content.articleTitle;

			else if ( !content.articleTitle ) this.articleTitleEl.innerHTML = '输入标题';

			// ARTICLE TOP META DATA
			if ( content.accountName && ( !this.previous || this.previous.accountName !== content.accountName ) ) {

				this.accountNameEl.innerHTML = content.accountName;

			} else if ( !content.accountName ) {

				this.accountNameEl.innerHTML = '账户名称';

			}

			if ( content.articleAuthor && ( !this.previous || this.previous.articleAuthor !== content.articleAuthor ) )
				this.articleAuthorEl.innerHTML = content.articleAuthor;

			else if ( !content.articleAuthor ) this.articleAuthorEl.innerHTML = '';

			// META DATA
			// PAGEVIEWS
			if ( content.pageViews && ( !this.previous || this.previous.pageViews !== content.pageViews ) )
				this.articlePageviews.innerHTML = '阅读 ' + content.pageViews;

			else if ( !content.pageViews ) this.articlePageviews.innerHTML = '阅读 0';

			// LIKES
			if ( content.pageLikes && ( !this.previous || this.previous.pageLikes !== content.pageLikes ) )
				this.articleLikesNum.innerHTML = content.pageLikes;

			else if ( !content.pageLikes ) this.articleLikesNum.innerHTML = '赞';

			// READ MORE
			if ( content.readMore ) {

				this.readMoreEl.innerHTML = '阅读原文';
				this.readMoreEl.setAttribute( 'target', '_blank' );

				if ( /^(http:\/\/){1,7}\S+/.test( content.readMore ) === false ) content.readMore = 'http://' + content.readMore;

				this.readMoreEl.setAttribute( 'href', content.readMore );

			} else this.readMoreEl.innerHTML = '';


			// FORMAT DATE
			// =====================================================================================
			var date = ( typeof content.articleTime === 'number' ? new Date( Number( content.articleTime ) ) : new Date( Date.now() ) ),
				day = date.getDate(),
				month = date.getMonth() + 1;

			content.articleTime = month + '月' + day + '日';

			this.articleDateEl.innerHTML = content.articleTime;

			this.previous = content;
		};

		this.formatContent = function() {


			// FORMAT VIDEO IFRAMES
			// =====================================================================================
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


			// SET SOURCES FOR IMAGES AND YOUKU LINKS
			// =====================================================================================
			var dataSrcElements = this.contentWrapper.querySelectorAll( '[data-src]' );

			for ( var i = 0; i < dataSrcElements.length; i++ ) {

				dataSrcElements[ i ].src = dataSrcElements[ i ].getAttribute( 'data-src' );

				// UPDATE IMAGE SOURCES TO USE 640 WIDTH
				if ( dataSrcElements[ i ].tagName == 'IMG' ) {

					dataSrcElements[ i ].src = dataSrcElements[ i ].src.replace( /\/[0-9](?=\?wx)/, '/640' );

					dataSrcElements[ i ].style.height = 'auto';

				}

			}


			// UPDATE DATA-HEIGHT ON IMAGE LOAD
			// =====================================================================================
			var imageElements = this.contentWrapper.querySelectorAll( 'img' ),
				imageLoadCount = 0;

			var updateLoadCount = function( e ) {

				// REMEOVE THE EVENT LISTENER
				e.target.removeEventListener( 'load', updateLoadCount );
				e.target.removeEventListener( 'error', updateLoadCount );

				imageLoadCount++;

				if ( imageLoadCount === imageElements.length )
					$this.updateHeight();
			};

			Array.prototype.forEach.call( imageElements, function( img ) {

				// CHECK TO SEE IF THE IMAGE IS ALREADY LOADED
				if ( img.complete && img.naturalWidth !== 0 ) imageLoadCount++;

				// OTHERWISE ADD A LISTENER FOR WHEN IT DOES
				else {
					img.addEventListener( 'load', updateLoadCount );
					img.addEventListener( 'error', updateLoadCount );
				}

				// IF AT THIS STAGE ALL IMAGES ARE LOADED, SET TO STATE AND RENDER
				if ( imageLoadCount === imageElements.length )
					$this.updateHeight();
			});


			// DISPLAY ERROR FOR POLL IFRAMES
			// =====================================================================================
			var polls = this.contentWrapper.getElementsByClassName( 'vote_iframe' );

			for ( var i = 0; i < polls.length; i++ ) {

				var poll = polls[ i ];

				// REMOVE SOURCE ATTRIBUTE
				poll.removeAttribute( 'src' );

				// IF IFRAME HAS A DATA-DISPLAY-STYLE ATTRIBUTE › SET STYLE TO THAT ATTRIBUTE
				if ( poll.getAttribute( 'data-display-style' ) )
					poll.setAttribute( 'style', poll.getAttribute( 'data-display-style' ) );

				if ( poll.classList.contains( 'vote_iframe' ) && poll.contentDocument ) {

					// CREATE NOTIFICATION THAT POLL WONT BE LOADED
					poll.addEventListener( 'load', function () {

						// EMPTY IFRAME › CREATE ELEMENTS
						if ( poll.contentDocument.body.children.length === 0 ) {

							// CREATE ELEMENTS
							var notAvailableEl = document.createElement( 'div' ),
								notAvailableNode = document.createElement( 'p' );

							poll.contentDocument.body.style.margin = '0';

							// STYLING FOR PARENT
							notAvailableEl.classList.add( 'fn-not-available' );
							notAvailableEl.style.backgroundColor = '#F2F2F2';
							notAvailableEl.style.position = 'absolute';
							notAvailableEl.style.height = '100%';
							notAvailableEl.style.width = '100%';
							notAvailableEl.style.top = '0';
							notAvailableEl.style.left = '0';

							// STYLING FOR TEXT
							notAvailableNode.style.position = 'absolute';
							notAvailableNode.style.left = '50%';
							notAvailableNode.style.top = '50%';
							notAvailableNode.style.transform = 'translate( -50%, -50% )';
							notAvailableNode.style.margin = '0';
							notAvailableNode.style.fontFamily = "'Open Sans', Helvetica, sans-serif";

							// WARNING TEXT
							notAvailableNode.innerHTML = 'Poll preview not available.';

							// APPEND ELEMENTS
							notAvailableEl.appendChild( notAvailableNode );
							poll.contentDocument.body.appendChild( notAvailableEl );

						}

					});

				}

			}

		};


		// =========================================================================================
		this.updateVideoDimensions = function() {

			var videoIframes = this.contentWrapper.getElementsByClassName( 'iframe-video' );

			for ( var i = 0; i < videoIframes.length; i++ ) {

				var aspectRatio = Number( videoIframes[ i ].dataset.ratio ),
					width = Number( videoIframes[ i ].parentNode.getBoundingClientRect().width ),
					height = width / aspectRatio;

				videoIframes[ i ].width = width;
				videoIframes[ i ].height = height;
			}
		};


		// =========================================================================================
		this.updateHeight = function() {

			var event;

			try {

				// IF HEIGHT IS GOING TO CHANGE › DISPATCH EVENT
				if ( !this.el.getAttribute( 'data-content-height' ) || this.el.getAttribute( 'data-content-height' ) !== this.mainWrapper.offsetHeight.toString() )
					event = new Event( 'content-height-change' );

				// UPDATE THE HEIGHT
				this.el.setAttribute( 'data-content-height', this.mainWrapper.offsetHeight.toString() );

				// IF THE HEIGHT CHANGED › DISPATCH AN EVENT
				if ( event ) this.el.dispatchEvent( event );

			} catch ( e ) {

				if ( typeof window.CustomEvent === "function" ) return false; //If not IE

				var CustomEvent = function ( event, params ) {
					params = params || { bubbles: false, cancelable: false, detail: undefined };
					var evt = document.createEvent( 'CustomEvent' );
					evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
					return evt;
				};

				CustomEvent.prototype = window.Event.prototype;

				window.CustomEvent = CustomEvent;

				// FIX FOR INTERNET EXPLORER / EDGE
				if ( !this.el.getAttribute( 'data-content-height' ) || this.el.getAttribute( 'data-content-height' ) !== this.mainWrapper.offsetHeight.toString() )
					event = CustomEvent( 'content-height-change' );

				// UPDATE THE HEIGHT
				this.el.setAttribute( 'data-content-height', this.mainWrapper.offsetHeight.toString() );

				if ( event ) this.el.dispatchEvent( event );
			}

		}
	}

	return articlePreview;
}));
