//
// Copyright(C) 2009-2012 Microsoft Corporation
// All rights reserved.
//

/*
 * We will explicitly assign to prototype members in here (as opposed to
 * assigning a new prototype object) because the latter will create a new
 * object for the prototype, which will cause errors
 */

//* @module(W3C)


/*
 * interfaces
 */
var /*@interface*/ Window;
var /*@interface*/ console;
var /*@interface*/ History;
var /*@interface*/ HTMLElement;
var /*@interface*/ Event;
var /*@interface*/ Location;
var /*@interface*/ Navigator;
var /*@interface*/ Screen;
var /*@interface*/ Style;
var /*@interface*/ HTMLSelectElement;
var /*@interface*/ HTMLDivElement;
var /*@interface*/ HTMLCollection;
var /*@interface*/ MSBlobHelper;
var /*@interface*/ Blob;
var /*@interface*/ HTMLImageElement;
var /*@interface*/ MessageEvent;
var /*@interface*/ CSSStyleSheet;
var /*@interface*/ CSSRuleList;
var /*@interface*/ CSSStyleRule;
var /*@interface*/ Document;
var /*@interface*/ EventTarget;
var /*@interface*/ EventListener;


/*
 * global variables
 */

var window = this;
var self = window;
var /*@type(Window)*/parent;
var /*@type(Window)*/opener;
var /*@type(Window)*/top;
var /*@type(Boolean)*/closed;
var /*@type(String)*/defaultStatus;
var /*@type(Document)*/document;
var /*@type(Event)*/event;
var /*@type(Array)*/frames;
var /*@type(History)*/history;
var /*@type(Number)*/innerHeight;
var /*@type(Number)*/innerWidth;
var /*@type(Number)*/length;
var /*@type(Location)*/location;
var /*@type(String)*/name;
var /*@type(Navigator)*/navigator;
var /*@type(Number)*/outerHeight;
var /*@type(Number)*/outerWidth;
var /*@type(Number)*/pageXOffset;
var /*@type(Number)*/pageYOffset;
var /*@type(Screen)*/screen;
var /*@type(Number)*/screenLeft;
var /*@type(Number)*/screenTop;
var /*@type(Number)*/screenX;
var /*@type(Number)*/screenY;
var /*@type(String)*/status;


/*
 * Window
 */

Window.prototype = window;


/*
 * Console
 */
 
console.log    		= function(/*@type(String)*/message){};
console.info    	= function(/*@type(String)*/message){};
console.warn    	= function(/*@type(String)*/message){};
console.error    	= function(/*@type(String)*/message){};
console.clear  		= function(){};
console.assert  	= function(/*@type(Boolean)*/condition, /*@type(String)*/message) {};
console.dir  		= function(/*@type(*)*/object) {};
console.profile  	= function() {/*@type(String), @optional*/id};
console.profileEnd  = function() {/*@type(String), @optional*/id};

/*
 * History
 */

History.prototype.length    = /*@static_cast(Number)*/null;
History.prototype.back      = function(){};
History.prototype.forward   = function(){};
History.prototype.go        = function(arg1){};


/*
 * HTMLElement
 */

HTMLElement.prototype.accessKey         = /*@static_cast(String)*/null;
HTMLElement.prototype.attributes        = /*@static_cast(Array)*/null;
HTMLElement.prototype.childNodes        = /*@static_cast(Array)*/null;
HTMLElement.prototype.className         = /*@static_cast(String)*/null;
HTMLElement.prototype.clientHeight      = /*@static_cast(Number)*/null;
HTMLElement.prototype.clientWidth       = /*@static_cast(Number)*/null;
HTMLElement.prototype.contentWindow     = /*@static_cast(Window)*/null;
HTMLElement.prototype.dir               = /*@static_cast(String)*/null;
HTMLElement.prototype.disabled          = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.firstChild        = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.height            = /*@static_cast(String)*/null;
HTMLElement.prototype.id                = /*@static_cast(String)*/null;
HTMLElement.prototype.innerHTML         = /*@static_cast(String)*/null;
HTMLElement.prototype.lang              = /*@static_cast(String)*/null;
HTMLElement.prototype.lastChild         = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.length            = /*@static_cast(Number)*/null;
HTMLElement.prototype.nextSibling       = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.nodeName          = /*@static_cast(String)*/null;
HTMLElement.prototype.nodeType          = /*@static_cast(Number)*/null;
HTMLElement.prototype.nodeValue         = /*@static_cast(String)*/null;
HTMLElement.prototype.offsetHeight      = /*@static_cast(Number)*/null;
HTMLElement.prototype.offsetLeft        = /*@static_cast(Number)*/null;
HTMLElement.prototype.offsetParent      = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.offsetTop         = /*@static_cast(Number)*/null;
HTMLElement.prototype.offsetWidth       = /*@static_cast(Number)*/null;
HTMLElement.prototype.ownerDocument     = /*@static_cast(Document)*/null;
HTMLElement.prototype.parentNode        = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.previousSibling   = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.scrollHeight      = /*@static_cast(Number)*/null;
HTMLElement.prototype.scrollLeft        = /*@static_cast(Number)*/null;
HTMLElement.prototype.scrollTop         = /*@static_cast(Number)*/null;
HTMLElement.prototype.scrollWidth       = /*@static_cast(Number)*/null;
HTMLElement.prototype.style             = /*@static_cast(Style)*/null;
HTMLElement.prototype.tabIndex          = /*@static_cast(Number)*/null;
HTMLElement.prototype.tagName           = /*@static_cast(String)*/null;
HTMLElement.prototype.title             = /*@static_cast(String)*/null;
HTMLElement.prototype.width             = /*@static_cast(String)*/null;
HTMLElement.prototype.charset           = /*@static_cast(String)*/null;
HTMLElement.prototype.href              = /*@static_cast(String)*/null;
HTMLElement.prototype.hreflang          = /*@static_cast(String)*/null;
HTMLElement.prototype.name              = /*@static_cast(String)*/null;
HTMLElement.prototype.rel               = /*@static_cast(String)*/null;
HTMLElement.prototype.rev               = /*@static_cast(String)*/null;
HTMLElement.prototype.target            = /*@static_cast(String)*/null;
HTMLElement.prototype.type              = /*@static_cast(String)*/null;

HTMLElement.prototype.alt               = /*@static_cast(String)*/null;
HTMLElement.prototype.coords            = /*@static_cast(String)*/null;
HTMLElement.prototype.hash              = /*@static_cast(String)*/null;
HTMLElement.prototype.host              = /*@static_cast(String)*/null;
HTMLElement.prototype.hostname          = /*@static_cast(String)*/null;
HTMLElement.prototype.noHref            = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.pathname          = /*@static_cast(String)*/null;
HTMLElement.prototype.port              = /*@static_cast(String)*/null;
HTMLElement.prototype.protocol          = /*@static_cast(String)*/null;
HTMLElement.prototype.search            = /*@static_cast(String)*/null;
HTMLElement.prototype.shape             = /*@static_cast(String)*/null;

HTMLElement.prototype.aLink             = /*@static_cast(String)*/null;
HTMLElement.prototype.background        = /*@static_cast(String)*/null;
HTMLElement.prototype.bgColor           = /*@static_cast(String)*/null;
HTMLElement.prototype.link              = /*@static_cast(String)*/null;
HTMLElement.prototype.text              = /*@static_cast(String)*/null;
HTMLElement.prototype.vLink             = /*@static_cast(String)*/null;

HTMLElement.prototype.form              = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.value             = /*@static_cast(String)*/null;

HTMLElement.prototype.acceptCharset     = /*@static_cast(String)*/null;
HTMLElement.prototype.action            = /*@static_cast(String)*/null;
HTMLElement.prototype.elements          = /*@static_cast(Array)*/null;
HTMLElement.prototype.enctype           = /*@static_cast(String)*/null;
HTMLElement.prototype.method            = /*@static_cast(String)*/null;
HTMLElement.prototype.align             = /*@static_cast(String)*/null;
HTMLElement.prototype.contentDocument   = /*@static_cast(Document)*/null;
HTMLElement.prototype.frameBorder       = /*@static_cast(Number)*/null;
HTMLElement.prototype.longDesc          = /*@static_cast(String)*/null;
HTMLElement.prototype.marginHeight      = /*@static_cast(Number)*/null;
HTMLElement.prototype.marginWidth       = /*@static_cast(Number)*/null;
HTMLElement.prototype.noResize          = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.scrolling         = /*@static_cast(String)*/null;
HTMLElement.prototype.src               = /*@static_cast(String)*/null;
HTMLElement.prototype.cols              = /*@static_cast(*)*/null;
HTMLElement.prototype.rows              = /*@static_cast(*)*/null;
HTMLElement.prototype.border            = /*@static_cast(Number)*/null;
HTMLElement.prototype.complete          = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.hspace            = /*@static_cast(Number)*/null;
HTMLElement.prototype.lowsrc            = /*@static_cast(String)*/null;
HTMLElement.prototype.useMap            = /*@static_cast(String)*/null;
HTMLElement.prototype.vspace            = /*@static_cast(Number)*/null;

HTMLElement.prototype.checked           = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.defaultChecked    = /*@static_cast(Boolean)*/null;

HTMLElement.prototype.accept            = /*@static_cast(String)*/null;
HTMLElement.prototype.defaultValue      = /*@static_cast(String)*/null;
HTMLElement.prototype.maxLength         = /*@static_cast(Number)*/null;
HTMLElement.prototype.readOnly          = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.size              = /*@static_cast(Number)*/null;

HTMLElement.prototype.media             = /*@static_cast(String)*/null;

HTMLElement.prototype.content           = /*@static_cast(String)*/null;
HTMLElement.prototype.httpEquiv         = /*@static_cast(String)*/null;
HTMLElement.prototype.scheme            = /*@static_cast(String)*/null;

HTMLElement.prototype.archive           = /*@static_cast(String)*/null;
HTMLElement.prototype.code              = /*@static_cast(String)*/null;
HTMLElement.prototype.codeBase          = /*@static_cast(String)*/null;
HTMLElement.prototype.data              = null;
HTMLElement.prototype.declare           = null;
HTMLElement.prototype.standby           = /*@static_cast(String)*/null;

HTMLElement.prototype.defaultSelected   = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.index             = /*@static_cast(Number)*/null;
HTMLElement.prototype.label             = /*@static_cast(String)*/null;
HTMLElement.prototype.selected          = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.multiple          = /*@static_cast(Boolean)*/null;
HTMLElement.prototype.selectedIndex     = /*@static_cast(Number)*/null;

HTMLElement.prototype.caption           = /*@static_cast(String)*/null;
HTMLElement.prototype.cellPadding       = /*@static_cast(Number)*/null;
HTMLElement.prototype.cellSpacing       = /*@static_cast(Number)*/null;
HTMLElement.prototype.cells             = /*@static_cast(Array)*/null;
HTMLElement.prototype.frame             = /*@static_cast(Number)*/null;
HTMLElement.prototype.rules             = /*@static_cast(Number)*/null;
HTMLElement.prototype.summary           = /*@static_cast(String)*/null;
HTMLElement.prototype.tBodies           = /*@static_cast(Array)*/null;
HTMLElement.prototype.tFoot             = /*@static_cast(HTMLElement)*/null;
HTMLElement.prototype.tHead             = /*@static_cast(HTMLElement)*/null;

HTMLElement.prototype.abbr              = /*@static_cast(String)*/null;
HTMLElement.prototype.axis              = /*@static_cast(String)*/null;
HTMLElement.prototype.cellIndex         = /*@static_cast(Number)*/null;
HTMLElement.prototype.ch                = /*@static_cast(String)*/null;
HTMLElement.prototype.chOff             = /*@static_cast(String)*/null;
HTMLElement.prototype.colSpan           = /*@static_cast(Number)*/null;
HTMLElement.prototype.headers           = /*@static_cast(String)*/null;
HTMLElement.prototype.rowSpan           = /*@static_cast(Number)*/null;
HTMLElement.prototype.scope             = /*@static_cast(String)*/null;
HTMLElement.prototype.vAlign            = /*@static_cast(String)*/null;
HTMLElement.prototype.rowIndex          = /*@static_cast(Number)*/null;
HTMLElement.prototype.sectionRowIndex   = /*@static_cast(Number)*/null;

HTMLElement.prototype.addEventListener          = /*^analysis('security','AddEventListenerHandler')*/function (/*@type(String)*/type, /*@type(Function)*/listener, /*@type(Boolean)*/useCapture){};
HTMLElement.prototype.appendChild               = /*@type(HTMLElement)*/function (/*@type(HTMLElement)*/arg1){};
HTMLElement.prototype.blur                      = function(){};
HTMLElement.prototype.click                     = function(){};
HTMLElement.prototype.cloneNode                 = /*@type(HTMLElement)*/function (/*@type(Boolean)*/arg1){};
HTMLElement.prototype.focus                     = function(){};
HTMLElement.prototype.getAttribute              = /*@type(String)*/function(/*@type(String)*/arg1){};
HTMLElement.prototype.getElementsByClassName    = /*@type(Array)*/ function(/*@type(String)*/classNames){};
HTMLElement.prototype.getElementsByTagName      = /*@type(Array)*/function(/*@type(String)*/arg1){};
HTMLElement.prototype.hasChildNodes             = /*@type(Boolean)*/function(){};
HTMLElement.prototype.insertBefore              = /*@type(HTMLElement)*/function(/*@type(HTMLElement)*/arg1, /*@type(HTMLElement), @optional*/arg2){};
HTMLElement.prototype.item                      = /*@type(HTMLElement)*/function(/*@type(Number)*/arg1){};
HTMLElement.prototype.normalize                 = function(){};
HTMLElement.prototype.querySelector             = /*@type(HTMLElement)*/function (/*@type(String)*/selectors){};
HTMLElement.prototype.querySelectorAll          = /*@type(Array)*/function (/*@type(String)*/selectors){};
HTMLElement.prototype.removeAttribute           = function(/*@type(String)*/arg1){};
HTMLElement.prototype.removeChild               = /*@type(HTMLElement)*/function(/*@type(HTMLElement)*/arg1){};
HTMLElement.prototype.removeEventListener       = function(/*@type(String)*/type, /*@type(Function)*/listener, /*@type(Boolean)*/useCapture){};
HTMLElement.prototype.replaceChild              = /*@type(HTMLElement)*/function(/*@type(HTMLElement)*/arg1, /*@type(HTMLElement)*/arg2){};
HTMLElement.prototype.scrollIntoView            = function(/*@type(Boolean),@optional*/alignWithTop){};
HTMLElement.prototype.setAttribute              = function(/*@type(String)*/arg1, /*@type(String)*/arg2){};
HTMLElement.prototype.toString                  = /*@type(String)*/function(){};
HTMLElement.prototype.reset                     = function(){};
HTMLElement.prototype.submit                    = function(){};
HTMLElement.prototype.select                    = function(){};

HTMLElement.prototype.add                       = function(/*@type(HTMLElement)*/arg1, /*@type(HTMLElement),@optional*/arg2){};
HTMLElement.prototype.remove                    = function(/*@type(Number)*/arg1){};
HTMLElement.prototype.createCaption             = /*@type(HTMLElement)*/function(){};
HTMLElement.prototype.createTFoot               = /*@type(HTMLElement)*/function(){};
HTMLElement.prototype.createTHead               = /*@type(HTMLElement)*/function(){};
HTMLElement.prototype.deleteCaption             = function(){};
HTMLElement.prototype.deleteRow                 = function(/*@type(Number)*/arg1){};
HTMLElement.prototype.deleteTFoot               = function(){};
HTMLElement.prototype.deleteTHead               = function(){};
HTMLElement.prototype.insertRow                 = /*@type(HTMLElement)*/function(/*@type(Number)*/arg1){};
HTMLElement.prototype.deleteCell                = function (/*@type(Number)*/arg1){};
HTMLElement.prototype.insertCell                = /*@type(HTMLElement)*/function(/*@type(Number)*/arg1){};

Event.prototype = {
    altKey: /*@static_cast(Boolean)*/null,
    bubbles: /*@static_cast(Boolean)*/null,
    button: /*@static_cast(Number)*/null,
    cancelable: /*@static_cast(Boolean)*/null,
    clientX: /*@static_cast(Number)*/null,
    clientY: /*@static_cast(Number)*/null,
    ctrlKey: /*@static_cast(Boolean)*/null,
    currentTarget: /*@static_cast(HTMLElement)*/null,
    metaKey: /*@static_cast(Boolean)*/null,
    preventDefault: /*@static_cast(Function)*/null,
    relatedTarget: /*@static_cast(HTMLElement)*/null,
    screenX: /*@static_cast(Number)*/null,
    screenY: /*@static_cast(Number)*/null,
    shiftKey: /*@static_cast(Boolean)*/null,
    target: /*@static_cast(HTMLElement)*/null,
    timeStamp: /*@static_cast(Number)*/null,
    type: /*@static_cast(String)*/null
};

Location.prototype = {
    hash: /*@static_cast(String)*/null,
    host: /*@static_cast(String)*/null,
    hostname: /*@static_cast(String)*/null,
    href: /*@static_cast(String)*/null,
    pathname: /*@static_cast(String)*/null,
    port: /*@static_cast(String)*/null,
    protocol: /*@static_cast(String)*/null,
    search: /*@static_cast(String)*/null,
    assign: function (/*@type(String)*/arg1) { },
    reload: function () { },
    replace: function (/*@type(String)*/arg1) { }
};

Navigator.prototype = {
    appCodeName: /*@static_cast(String)*/null,
    appName: /*@static_cast(String)*/null,
    appVersion: /*@static_cast(String)*/null,
    cookieEnabled: /*@static_cast(Boolean)*/null,
    platform: /*@static_cast(String)*/null,
    userAgent: /*@static_cast(String)*/null,
    javaEnabled: /*@static_cast(Boolean)*/function () { },
    taintEnabled: /*@static_cast(Boolean)*/function () { }
};

Screen.prototype = {
    availHeight: /*@static_cast(Number)*/null,
    availWidth: /*@static_cast(Number)*/null,
    colorDepth: /*@static_cast(Number)*/null,
    height: /*@static_cast(Number)*/null,
    pixelDepth: /*@static_cast(Number)*/null,
    width: /*@static_cast(Number)*/null
};

Style.prototype = {
    background: /*@static_cast(String)*/null,
    backgroundAttachment: /*@static_cast(String)*/null,
    backgroundColor: /*@static_cast(String)*/null,
    backgroundImage: /*@static_cast(String)*/null,
    backgroundPosition: /*@static_cast(String)*/null,
    backgroundPositionX: /*@static_cast(String)*/null,
    backgroundPositionY: /*@static_cast(String)*/null,
    backgroundRepeat: /*@static_cast(String)*/null,

    border: /*@static_cast(String)*/null,
    borderBottom: /*@static_cast(String)*/null,
    borderBottomColor: /*@static_cast(String)*/null,
    borderBottomStyle: /*@static_cast(String)*/null,
    borderBottomWidth: /*@static_cast(String)*/null,
    borderColor: /*@static_cast(String)*/null,
    borderLeft: /*@static_cast(String)*/null,
    borderLeftColor: /*@static_cast(String)*/null,
    borderLeftStyle: /*@static_cast(String)*/null,
    borderLeftWidth: /*@static_cast(String)*/null,
    borderRight: /*@static_cast(String)*/null,
    borderRightColor: /*@static_cast(String)*/null,
    borderRightStyle: /*@static_cast(String)*/null,
    borderRightWidth: /*@static_cast(String)*/null,
    borderStyle: /*@static_cast(String)*/null,
    borderTop: /*@static_cast(String)*/null,
    borderTopColor: /*@static_cast(String)*/null,
    borderTopStyle: /*@static_cast(String)*/null,
    borderTopWidth: /*@static_cast(String)*/null,
    borderWidth: /*@static_cast(String)*/null,

    margin: /*@static_cast(String)*/null,
    marginBottom: /*@static_cast(String)*/null,
    marginLeft: /*@static_cast(String)*/null,
    marginRight: /*@static_cast(String)*/null,
    marginTop: /*@static_cast(String)*/null,

    outline: /*@static_cast(String)*/null,
    outlineColor: /*@static_cast(String)*/null,
    outlineStyle: /*@static_cast(String)*/null,
    outlineWidth: /*@static_cast(String)*/null,

    padding: /*@static_cast(String)*/null,
    paddingBottom: /*@static_cast(String)*/null,
    paddingLeft: /*@static_cast(String)*/null,
    paddingRight: /*@static_cast(String)*/null,
    paddingTop: /*@static_cast(String)*/null,

    clear: /*@static_cast(String)*/null,
    clip: /*@static_cast(String)*/null,
    content: /*@static_cast(String)*/null,
    counterIncrement: /*@static_cast(String)*/null,
    counterReset: /*@static_cast(String)*/null,
    cssFloat: /*@static_cast(String)*/null,
    cursor: /*@static_cast(String)*/null,
    direction: /*@static_cast(String)*/null,
    display: /*@static_cast(String)*/null,
    height: /*@static_cast(String)*/null,
    markerOffset: /*@static_cast(String)*/null,
    marks: /*@static_cast(String)*/null,
    maxHeight: /*@static_cast(String)*/null,
    maxWidth: /*@static_cast(String)*/null,
    minHeight: /*@static_cast(String)*/null,
    minWidth: /*@static_cast(String)*/null,
    overflow: /*@static_cast(String)*/null,
    verticalAlign: /*@static_cast(String)*/null,
    visibility: /*@static_cast(String)*/null,
    width: /*@static_cast(String)*/null,

    listStyle: /*@static_cast(String)*/null,
    listStyleImage: /*@static_cast(String)*/null,
    listStylePosition: /*@static_cast(String)*/null,
    listStyleType: /*@static_cast(String)*/null,

    cssText: /*@static_cast(String)*/null,
    bottom: /*@static_cast(String)*/null,
    left: /*@static_cast(String)*/null,
    position: /*@static_cast(String)*/null,
    right: /*@static_cast(String)*/null,
    top: /*@static_cast(String)*/null,
    zIndex: /*@static_cast(String)*/null,
    orphans: /*@static_cast(String)*/null,
    page: /*@static_cast(String)*/null,
    pageBreakAfter: /*@static_cast(String)*/null,
    pageBreakBefore: /*@static_cast(String)*/null,
    pageBreakInside: /*@static_cast(String)*/null,
    size: /*@static_cast(String)*/null,
    widows: /*@static_cast(String)*/null,

    borderCollapse: /*@static_cast(String)*/null,
    borderSpacing: /*@static_cast(String)*/null,
    captionSide: /*@static_cast(String)*/null,
    emptyCells: /*@static_cast(String)*/null,
    tableLayout: /*@static_cast(String)*/null,

    color: /*@static_cast(String)*/null,
    font: /*@static_cast(String)*/null,
    fontFamily: /*@static_cast(String)*/null,
    fontSize: /*@static_cast(String)*/null,
    fontSizeAdjust: /*@static_cast(String)*/null,
    fontStretch: /*@static_cast(String)*/null,
    fontStyle: /*@static_cast(String)*/null,
    fontVariant: /*@static_cast(String)*/null,
    fontWeight: /*@static_cast(String)*/null,
    letterSpacing: /*@static_cast(String)*/null,
    lineHeight: /*@static_cast(String)*/null,
    quotes: /*@static_cast(String)*/null,
    textAlign: /*@static_cast(String)*/null,
    textDecoration: /*@static_cast(String)*/null,
    textIndent: /*@static_cast(String)*/null,
    textShadow: /*@static_cast(String)*/null,
    textTransform: /*@static_cast(String)*/null,
    unicodeBidi: /*@static_cast(String)*/null,
    whiteSpace: /*@static_cast(String)*/null,
    wordSpacing: /*@static_cast(String)*/null
};

/*^analysis('security','AddEventListenerHandler')*/ function addEventListener(/*@type(String)*/type, /*@type(Function)*/listener, /*@type(Boolean)*/useCapture) { };

function alert(/*@type(String)*/arg1) { }
function blur() { }
function clearInterval(/*@type(Number)*/arg1) { }
function clearTimeout(/*@type(Number)*/arg1) { }
function close() { }
/*@type(Boolean)*/function confirm(/*@type(String)*/arg1) { }
function focus() { }
function moveBy(/*@type(Number)*/arg1, /*@type(Number)*/arg2) { }
function moveTo(/*@type(Number)*/arg1, /*@type(Number)*/arg2) { }
/*@type(Window)*/function open(/*@type(String),@optional*/arg1, /*@type(String),@optional*/arg2, /*@type(String),@optional*/arg3, /*@type(Boolean),@optional*/arg4) { }
function print() { }
/*@type(String)*/function prompt(/*@type(String)*/arg1, /*@type(String),@optional*/arg2) { }
function resizeBy(/*@type(Number)*/arg1, /*@type(Number)*/arg2) { }
function resizeTo(/*@type(Number)*/arg1, /*@type(Number)*/arg2) { }
function scrollBy(/*@type(Number)*/arg1, /*@type(Number)*/arg2) { }
function scrollTo(/*@type(Number)*/arg1, /*@type(Number)*/arg2) { }
/*@type(Number)*/function setInterval(arg1, /*@type(Number)*/arg2, /*@type(String),@optional*/arg3) { }
/*@type(Number)*/function setTimeout(arg1, /*@type(Number)*/arg2, /*@type(String),@optional*/arg3) { }


HTMLSelectElement.prototype =
{
    options: null,
    selectedIndex: null,
  	addEventListener : /*^analysis('security','AddEventListenerHandler')*/function(/*@type(String)*/ type, /*@type(EventListener)*/ listener, /*@type(Boolean)*/ useCapture) { } ,
};

HTMLDivElement.prototype =
{
    children: /*@static_cast(HTMLCollection)*/null,
    length: /*@static_cast(Number)*/null,
    selectedIndex: null,
    title: /*@static_cast(String)*/null,
};

HTMLCollection.prototype =
{
	length : /*@static_cast(Number)*/null,

	item : /*@type(HTMLElement)*/function(/*@type(Object)*/nameOrIndex, /*@type(Object)*/optionalIndex) { },
    namedItem : /*@type(HTMLElement)*/function(/*@type(String)*/name) { },
	tags : /*@type(Object)*/function(/*@type(Object)*/tagName) { },
    urns : /*@type(Object)*/function(/*@type(Object)*/urn) { },
};

var /*@type(MSBlobHelper)*/msBlob;

MSBlobHelper.prototype = {
    /*@type(Blob)*/createFromImage : function (image) {},
    /*@type(Blob)*/createFromByteSeeker : function (type, seeker) {},
    /*@type(Blob)*/createFromFileItem : function (fileItem, callback, errorCallback) {},
};


Blob.prototype = {
	/*@type(String)*/url : null,
	/*@type(String)*/type : null,
	/*@type(Number)*/size : null,
	msByteReader : {}
};

HTMLImageElement.prototype = {
	/*@type(Number)*/ width : null,
	/*@type(Number)*/ height : null,
	/*@type(String)*/ src : null,
	addEventListener : /*^analysis('security','AddEventListenerHandler')*/function(/*@type(String)*/ type, /*@type(EventListener)*/ listener, /*@type(Boolean)*/ useCapture) { } ,
};

MessageEvent.prototype = {
	// Fields
	/*@type(Boolean)*/ bubbles : null,
	/*@type(Boolean)*/ cancelable : null,
	/*@type(Boolean)*/ cancelBubble : null,
	/*@type(EventTarget)*/ currentTarget : null,
	/*@type(String)*/ data : null,
	/*@type(Boolean)*/ defaultPrevented : null,
	/*@type(Number)*/ eventPhase : null,
	/*@type(Boolean)*/ isTrusted : null,
	/*@type(String)*/ origin : null,
	/*@type(Window)*/ source : null,
	/*@type(HTMLElement)*/ srcElement : null,
	/*@type(EventTarget)*/ target : null,
	/*@type(Number)*/ timeStamp : null,
	/*@type(String)*/ type : null,

	// Functions
	initEvent : function(/*@type(String)*/ eventTypeArg, /*@type(Boolean)*/ canBubbleArg, /*@type(Boolean)*/ cancelableArg) { } ,
	initMessageEvent : function(/*@type(String)*/ typeArg, /*@type(Boolean)*/ canBubbleArg, /*@type(Boolean)*/ cancelableArg, /*@type(Object)*/ dataArg, /*@type(String)*/ originArg, /*@type(String)*/ lastEventIdArg, /*@type(Window)*/ sourceArg) { } ,
	preventDefault : function() { } ,
	stopImmediatePropagation : function() { } ,
	stopPropagation : function() { } 
};

CSSStyleSheet.prototype = {
    constructor: CSSStyleSheet,
    href: /*@static_cast(String)*/null,
    length: /*@static_cast(Number)*/null
};

CSSRuleList.prototype = {
    constructor: CSSRuleList,
    length: /*@static_cast(Number)*/null
};

CSSStyleRule.prototype = {
    constructor: CSSStyleRule,
    selectorText: /*@static_cast(String)*/null,
    cssText: /*@static_cast(String)*/null,
    style: /*@static_cast(Style)*/null
}


/*
 * Document
 */

Document.prototype.activeElement            = /*@static_cast(HTMLElement)*/null;
Document.prototype.anchors                  = /*@static_cast(Array)*/null;
Document.prototype.body                     = /*@static_cast(HTMLElement)*/null;
Document.prototype.cookie                   = /*@static_cast(String)*/null;
Document.prototype.documentElement          = /*@static_cast(HTMLElement)*/null;
Document.prototype.documentMode             = /*@static_cast(Number)*/null;
Document.prototype.domain                   = /*@static_cast(String)*/null;
Document.prototype.frames                   = /*@static_cast(Window)*/null;
Document.prototype.forms                    = /*@static_cast(Array)*/null;
Document.prototype.images                   = /*@static_cast(Array)*/null;
Document.prototype.lastModified             = /*@static_cast(String)*/null;
Document.prototype.links                    = /*@static_cast(Array)*/null;
Document.prototype.readyState               = /*@static_cast(String)*/null;
Document.prototype.referrer                 = /*@static_cast(String)*/null;
Document.prototype.title                    = /*@static_cast(String)*/null;
Document.prototype.URL                      = /*@static_cast(String)*/null;
Document.prototype.addEventListener         = /*^analysis('security','AddEventListenerHandler')*/function (/*@type(String)*/type, /*@type(Function)*/listener, /*@type(Boolean)*/useCapture){};
Document.prototype.close                    = function(){};
Document.prototype.createElement            = /*@type(HTMLElement)*/function(/*@type(String)*/sTag){};
Document.prototype.getElementById           = /*@type(HTMLElement)*/function(/*@type(String)*/sIDValue){};
Document.prototype.getElementsByName        = /*@type(Array)*/function(/*@type(String)*/sNameValue){};
Document.prototype.getElementsByClassName   = /*@type(Array)*/ function(/*@type(String)*/ classNames){};
Document.prototype.getElementsByTagName     = /*@type(Array)*/function(/*@type(String)*/sTagName){};
Document.prototype.open                     = /*@type(Document)*/function(/*@type(String),@optional*/sUrl, /*@type(String),@optional*/sName, /*@type(String),@optional*/sFeatures, /*@type(Boolean),@optional*/bReplace){};
Document.prototype.querySelector            = /*@type(HTMLElement)*/function(/*@type(String)*/selectors){};
Document.prototype.querySelectorAll         = /*@type(Array)*/function(/*@type(String)*/selectors){};
Document.prototype.removeEventListener      = function (/*@type(String)*/type, /*@type(Function)*/listener, /*@type(Boolean)*/useCapture){};
Document.prototype.write                    = /*@varargs*/function(){};
Document.prototype.writeln                  = /*@varargs*/function(){};
