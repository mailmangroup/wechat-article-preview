!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.articlePreview=t()}(this,function(){"use strict";function e(e){var t=e.toLowerCase().replace(/ /g,"");return t}function t(e,t){var i,a={};for(i in e)Object.prototype.hasOwnProperty.call(e,i)&&(a[i]=e[i]);for(i in t)Object.prototype.hasOwnProperty.call(t,i)&&(a[i]=t[i]);return a}function i(e,t,i){return e=document.createElement(e),t&&(e.className=t),i&&i.appendChild(e),e}function a(n){var o=this;if(this.el=document.createElement("iframe"),this.el.id="article-preview",this.el.style.border="none",this.el.style.backgroundColor="#F3F3F3",this.el.style.maxWidth="100%",this.el.style.maxHeight="100%",!(this instanceof a))throw new TypeError("Preview constructor cannot be called as a function.");var n=t({container:"iphone4"},n);if(this.cssFilePath=n.cssFilePath,this.cssText=n.cssText,"object"==typeof n.container&&n.container.width&&n.container.height)"number"==typeof n.container.width&&"number"==typeof n.container.height&&(n.container.width=n.container.width+"px",n.container.height=n.container.height+"px"),this.el.style.width=n.container.width,this.el.style.height=n.container.height;else{if("string"!=typeof n.container)throw new TypeError("Container object contains invalid values");for(var s in r)r.hasOwnProperty(s)&&s===e(n.container)&&(this.el.style.width=r[s].width,this.el.style.height=r[s].height)}this.mainWrapper=i("div","rich_media_inner"),this.pageContent=i("div","preview-page-content",this.mainWrapper),this.mediaAreaPrimary=i("div","rich_media_area_primary",this.pageContent);var h=new MutationObserver(function(){o.updateHeight()});h.observe(this.mediaAreaPrimary,{childList:!0,attributes:!0,characterData:!0,subtree:!0}),window.addEventListener("resize",function(){o.updateHeight()}),n.onlyContent||(this.articleTitleEl=i("h2","rich_media_title rich_media_title_ios",this.mediaAreaPrimary),this.articleMetaList=i("div","rich_media_meta_list",this.mediaAreaPrimary),this.articleAuthorEl=i("em","rich_media_meta rich_media_meta_text",this.articleMetaList),this.accountNameEl=i("em","rich_media_meta rich_media_meta_link rich_media_meta_nickname",this.articleMetaList),this.articleDateEl=i("em","rich_media_meta rich_media_meta_text",this.articleMetaList)),this.contentWrapper=i("div","rich_media_content ",this.mediaAreaPrimary),n.onlyContent||(this.articleMetaData=i("div","rich_media_tool",this.mediaAreaPrimary),this.readMoreEl=i("a","media_tool_meta meta_primary",this.articleMetaData),this.articlePageviews=i("div","media_tool_meta tips_global_primary meta_primary",this.articleMetaData),this.articleLikes=i("span","media_tool_meta meta_extra meta_praise",this.articleMetaData),this.articleLikesIcon=i("i","icon_praise_gray",this.articleLikes),this.articleLikesNum=i("span","praise_num",this.articleLikes),this.clearFix=i("div","clearfix",this.articleMetaData)),this.el.addEventListener("load",function(){if(o.previous||(o.el.contentWindow.document.open(),o.el.contentWindow.document.write("<!DOCTYPE html>"),o.el.contentWindow.document.write("<html>"),o.el.contentWindow.document.write('<head><meta charset="utf-8"></head>'),o.el.contentWindow.document.write("<body></body>"),o.el.contentWindow.document.write("</html>"),o.el.contentWindow.document.close(),parseInt(o.el.style.width)>=375&&o.el.contentWindow.document.body.classList.add("article-preview-large-device")),o.mainWrapper.parentNode&&o.mainWrapper.parentNode===o.el.contentWindow.document.body||o.el.contentWindow.document.body.appendChild(o.mainWrapper),o.el.contentWindow.document.body.classList.add("appmsg_skin_default","appmsg_style_default","rich_media_empty_extra"),!e){var e,t=o.el.contentWindow.document.getElementsByTagName("head")[0],i=o.cssFilePath||"//mailmangroup.github.io/wechat-article-preview/dist/preview.css";o.cssText?(e=document.createElement("style"),e.innerHTML=o.cssText):(e=document.createElement("link"),e.rel="stylesheet",e.type="text/css",e.href=i),t.appendChild(e)}o.updateVideoDimensions(),o.updateHeight()}),this.generate=function(e){if(e=this.previous?t(this.previous,e):t({articleTitle:"输入标题",articleTime:Date.now(),articleAuthor:null,accountName:"账户名称",html:"开始写作",pageViews:0,pageLikes:0,readMore:!1},e),!e.html||this.previous&&this.previous.html===e.html?e.html&&""!==e.html||(this.contentWrapper.innerHTML="开始写作"):this.contentWrapper.innerHTML=e.html,this.formatContent(),n.onlyContent)return void(this.previous=e);!e.articleTitle||this.previous&&this.previous.articleTitle===e.articleTitle?e.articleTitle||(this.articleTitleEl.innerHTML="输入标题"):this.articleTitleEl.innerHTML=e.articleTitle,!e.accountName||this.previous&&this.previous.accountName===e.accountName?e.accountName||(this.accountNameEl.innerHTML="账户名称"):this.accountNameEl.innerHTML=e.accountName,!e.articleAuthor||this.previous&&this.previous.articleAuthor===e.articleAuthor?e.articleAuthor||(this.articleAuthorEl.innerHTML=""):this.articleAuthorEl.innerHTML=e.articleAuthor,!e.pageViews||this.previous&&this.previous.pageViews===e.pageViews?e.pageViews||(this.articlePageviews.innerHTML="阅读 0"):this.articlePageviews.innerHTML="阅读 "+e.pageViews,!e.pageLikes||this.previous&&this.previous.pageLikes===e.pageLikes?e.pageLikes||(this.articleLikesNum.innerHTML="赞"):this.articleLikesNum.innerHTML=e.pageLikes,e.readMore?(this.readMoreEl.innerHTML="阅读原文",this.readMoreEl.setAttribute("target","_blank"),/^(http|https):\/\//.test(e.readMore)||(e.readMore="http://"+e.readMore),this.readMoreEl.setAttribute("href",e.readMore)):this.readMoreEl.innerHTML="";var i=new Date("number"==typeof e.articleTime?Number(e.articleTime):Date.now()),a=i.getDate(),r=i.getMonth()+1;e.articleTime=r+"月"+a+"日",this.articleDateEl.innerHTML=e.articleTime,this.previous=e},this.formatContent=function(){for(var e=this.contentWrapper.getElementsByClassName("video_iframe"),t=0;t<e.length;t++){var a=i("div","video-description"),r=e[t].getAttribute("data-src");if(e[t].parentNode.insertBefore(a,e[t].nextSibling),r){var n=r.match(/(http|https):\/\/(\w+:{0,1}\w*@)?((v\.qq)+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g);n&&(a.innerHTML="腾讯视频")}}for(var s=this.contentWrapper.querySelectorAll("[data-src]"),t=0;t<s.length;t++)s[t].src=s[t].getAttribute("data-src"),"IMG"==s[t].tagName&&(s[t].src=s[t].src.replace(/\/[0-9](?=\?wx)/,"/640"),s[t].style.height="auto");var h=this.contentWrapper.querySelectorAll("img"),l=0,c=function(e){e.target.removeEventListener("load",c),e.target.removeEventListener("error",c),l++,l===h.length&&o.updateHeight()};Array.prototype.forEach.call(h,function(e){e.complete&&0!==e.naturalWidth?l++:(e.addEventListener("load",c),e.addEventListener("error",c)),l===h.length&&o.updateHeight()});for(var d=this.contentWrapper.getElementsByClassName("vote_iframe"),t=0;t<d.length;t++){var p=d[t];p.removeAttribute("src"),p.getAttribute("data-display-style")&&p.setAttribute("style",p.getAttribute("data-display-style")),p.classList.contains("vote_iframe")&&p.contentDocument&&p.addEventListener("load",function(){if(0===p.contentDocument.body.children.length){var e=document.createElement("div"),t=document.createElement("p");p.contentDocument.body.style.margin="0",e.classList.add("fn-not-available"),e.style.backgroundColor="#F2F2F2",e.style.position="absolute",e.style.height="100%",e.style.width="100%",e.style.top="0",e.style.left="0",t.style.position="absolute",t.style.left="50%",t.style.top="50%",t.style.transform="translate( -50%, -50% )",t.style.margin="0",t.style.fontFamily="'Open Sans', Helvetica, sans-serif",t.innerHTML="Poll preview not available.",e.appendChild(t),p.contentDocument.body.appendChild(e)}})}},this.updateVideoDimensions=function(){for(var e=this.contentWrapper.getElementsByClassName("iframe-video"),t=0;t<e.length;t++){var i=Number(e[t].dataset.ratio),a=Number(e[t].parentNode.getBoundingClientRect().width),r=a/i;e[t].width=a,e[t].height=r}},this.updateHeight=function(){var e;try{this.el.getAttribute("data-content-height")&&this.el.getAttribute("data-content-height")===this.mainWrapper.offsetHeight.toString()||(e=new Event("content-height-change")),this.el.setAttribute("data-content-height",this.mainWrapper.offsetHeight.toString()),e&&this.el.dispatchEvent(e)}catch(t){if("function"==typeof window.CustomEvent)return!1;var i=function(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var i=document.createEvent("CustomEvent");return i.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),i};i.prototype=window.Event.prototype,window.CustomEvent=i,this.el.getAttribute("data-content-height")&&this.el.getAttribute("data-content-height")===this.mainWrapper.offsetHeight.toString()||(e=i("content-height-change")),this.el.setAttribute("data-content-height",this.mainWrapper.offsetHeight.toString()),e&&this.el.dispatchEvent(e)}}}var r={iphone4:{height:"480px",width:"320px"},iphone5:{height:"568px",width:"320px"},iphone6:{height:"667px",width:"375px"},iphone6plus:{height:"736px",width:"414px"}};return a});