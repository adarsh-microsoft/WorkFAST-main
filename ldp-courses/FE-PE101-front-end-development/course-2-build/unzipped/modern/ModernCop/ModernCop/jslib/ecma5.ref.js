//
// Copyright(C) 2009-2012 Microsoft Corporation
// All rights reserved.
//

/*
 * We will explicitly assign to prototype members in here (as opposed to
 * assigning a new prototype object) because this file is loaded after all
 * the built-in types have been built by the time this file get loaded
 * This is especially important for Object and Function
 */

//* @module(ECMA5)


/*
 * global variables
 */

var NaN=0;
var Infinity=0;
var undefined=void 0;


/*
 * Math
 */

var Math = {
    E:       0,
    LN10:    0,
    LN2:     0,
    LOG2E:   0,
    LOG10E:  0,
    PI:      0,
    SQRT1_2: 0,
    SQRT2:   0,

    abs:     /* @type{Number} */function(/* @type{Number} */arg1){},
    acos:    /* @type{Number} */function(/* @type{Number} */arg1){},
    asin:    /* @type{Number} */function(/* @type{Number} */arg1){},
    atan:    /* @type{Number} */function(/* @type{Number} */arg1){},
    atan2:   /* @type{Number} */function(/* @type{Number} */arg1, /* @type{Number} */arg2) {},
    ceil:    /* @type{Number} */function(/* @type{Number} */arg1){},
    cos:     /* @type{Number} */function(/* @type{Number} */arg1){},
    exp:     /* @type{Number} */function(/* @type{Number} */arg1){},
    floor:   /* @type{Number} */function(/* @type{Number} */arg1){},
    log:     /* @type{Number} */function(/* @type{Number} */arg1){},
    max:     /* @type{Number}, @varargs */function(){},
    min:     /* @type{Number}, @varargs */function(){},
    pow:     /* @type{Number} */function(/* @type{Number} */arg1, /* @type{Number} */arg2){},
    random:  /* @type{Number} */function(){},
    round:   /* @type{Number} */function(/* @type{Number} */arg1){},
    sin:     /* @type{Number} */function(/* @type{Number} */arg1){},
    sqrt:    /* @type{Number} */function(/* @type{Number} */arg1){},
    tan:     /* @type{Number} */function(/* @type{Number} */arg1){}
};


/*
 * global functions
 */

/* @type{String} */function escape(/* @type{String} */arg1){}
/* @type{String} */function unescape(/* @type{String} */arg1){}
function eval(/* @type{String} */arg1){return void 0;}
/* @type{Number} */function parseInt(/* @type{String} */arg1,/* @type{Number}, @optional */arg2){}
/* @type{Number} */function parseFloat(/* @type{String} */arg1){}
/* @type{Boolean} */function isNaN(/* @type{Number} */arg1){}
/* @type{Boolean} */function isFinite(/* @type{Number} */arg1){}
/* @type{String} */function decodeURI(/* @type{String} */arg1){}
/* @type{String} */function decodeURIComponent(/* @type{String} */arg1){}
/* @type{String} */function encodeURI(/* @type{String} */arg1){}
/* @type{String} */function encodeURIComponent(/* @type{String} */arg1) { }


/*
 * Object
 */

/* @type{Object} */
function Object(/* @optional, @type{*} */arg1){}
Object.prototype.constructor           = Object;
Object.prototype.toString              = /* @type{String} */function(){};
Object.prototype.toLocaleString        = /* @type{String} */function(){};
Object.prototype.valueOf               = /* @type{Object} */function(){};
Object.prototype.hasOwnProperty        = /* @type{Boolean} */function(/* @type{String} */arg1){};
Object.prototype.isPrototypeOf         = /* @type{Boolean} */function(/* @type{Object} */arg1){};
Object.prototype.propertyIsEnumerable  = /* @type{Boolean} */function(/* @type{String} */arg1){};

Object.getPrototypeOf           = /*@type(Object)*/function(/*@type(Object)*/arg1){};
Object.getOwnPropertyDescriptor = /*@type(Object)*/function(/*@type(Object)*/arg1,/*@type(String)*/arg2){};
Object.getOwnPropertyNames      = /*@type(Array)*/function(/*@dynamic*/arg1){};
Object.create                   = /*@analysis('ecma5.ext.js','Object_create'),@type(Object)*/function(/*@type(Object)*/proto,/*@type(Object),@optional*/properties){};
Object.defineProperty           = /*^analysis('ecma5.ext.js','Object_defineProperty'),@type(Object)*/function (/*@type(Object)*/arg1, /*@type(String)*/arg2, /*@type(Object),@optional*/arg3) { };
Object.defineProperties         = /*@type(Object)*/function(/*@type(Object)*/arg1,/*@type(Object)*/arg2){};
Object.seal                     = /*@type(Object)*/function(/*@type(Object)*/arg1){};
Object.freeze                   = /*@type(Object)*/function(/*@type(Object)*/arg1){};
Object.preventExtensions        = /*@type(Object)*/function(/*@type(Object)*/arg1){};
Object.isSealed                 = /*@type(Boolean)*/function(/*@type(Object)*/arg1){};
Object.isFrozen                 = /*@type(Boolean)*/function(/*@type(Object)*/arg1){};
Object.isExtensible             = /*@type(Boolean)*/function(/*@type(Object)*/arg1){};
Object.keys                     = /*@type(Array)*/function(/*@dynamic*/arg1){};


/*
 * Function
 */

/* @type{Object}, @varargs*/
function Function(){}
Function.prototype.constructor  = Function;
Function.prototype.toString     = /*@type(String)*/function(){},
Function.prototype.apply        = function (/*@dynamic,@optional*/thisArg,/*@type(Array),@optional*/argArray){return undefined;};
Function.prototype.call         = /*@varargs*/function (/*@dynamic,@optional*/thisArg){return undefined;};
Function.prototype.bind         = /*@type(Function),@varargs*/function(/*@dynamic*/arg1){};


/*
 * Array
 */

/* @generic T = * , @type{Array} */
function Array(/* @type{Number} */arg1){}
Array.prototype.length          = 0;
Array.prototype.constructor     = Array;
Array.prototype.toString        = /*@type(String)*/function () { };
Array.prototype.toLocaleString  = /*@type(String)*/function () { };
Array.prototype.concat          = /*@type(Array),@varargs*/function () { };
Array.prototype.join            = /*@type(String)*/function (/*@type(String)*/arg1) { };
Array.prototype.pop             = function () { return undefined; };
Array.prototype.push            = /*@type(Number),@varargs*/function () { };
Array.prototype.reverse         = /*@type(Array)*/function () { };
Array.prototype.shift           = function () { return undefined; };
Array.prototype.slice           = /*@type(Array)*/function (/*@type(Number)*/start, /*@type(Number),@optional*/end) { };
Array.prototype.sort            = /*@type(Array)*/function (/*@type(Function),@optional*/arg1) { };
Array.prototype.splice          = /*@type(Array),@varargs*/function (/*@type(Number)*/arg1, /*@type(Number)*/arg2) { };
Array.prototype.unshift         = /*@type(Number),@varargs*/function () { };
Array.prototype.indexOf         = /*@type(Number)*/function (/*@dynamic*/arg1, /*@type(Number),@optional*/arg2) { };
Array.prototype.lastIndexOf     = /*@type(Number)*/function (/*@dynamic*/arg1, /*@type(Number),@optional*/arg2) { };
Array.prototype.every           = /*@type(Boolean)*/function (/*@type(Function)*/callback, /*@dynamic,@optional*/thisArg) { };
Array.prototype.some            = /*@type(Boolean)*/function (/*@type(Function)*/callback, /*@dynamic,@optional*/thisArg) { };
Array.prototype.forEach         = function (/*@type(Function)*/callback, /*@dynamic,@optional*/thisArg) { };
Array.prototype.map             = /*@type(Array)*/function (/*@type(Function)*/callback, /*@dynamic,@optional*/thisArg) { };
Array.prototype.filter          = /*@type(Array)*/function (/*@type(Function)*/callback, /*@dynamic,@optional*/thisArg) { };
Array.prototype.reduce          = function (/*@type(Function)*/callback, /*@dynamic,@optional*/initialValue) { };
Array.prototype.reduceRight     = function (/*@type(Function)*/callback, /*@dynamic,@optional*/initialValue) { };

Array.isArray = /*@type(Boolean)*/function(arg1){};


/*
 * String
 */

function String(/* @optional, @dynamic */arg1){ return ''; }
String.prototype.length             = 0;
String.prototype.constructor        = String;
String.prototype.toString           = /*@type(String)*/function () { };
String.prototype.valueOf            = /*@type(String)*/function () { };
String.prototype.charAt             = /*@type(String)*/function (/*@type(Number)*/arg1) { };
String.prototype.charCodeAt         = /*@type(Number)*/function (/*@type(Number)*/arg1) { };
String.prototype.concat             = /*@type(String),@varargs*/function () { };
String.prototype.indexOf            = /*@type(Number)*/function (/*@type(String)*/arg1, /*@type(Number),@optional*/arg2) { };
String.prototype.lastIndexOf        = /*@type(Number)*/function (/*@type(String)*/arg1, /*@type(Number),@optional*/arg2) { };
String.prototype.localeCompare      = /*@type(Number)*/function (/*@type(String)*/arg1) { };
String.prototype.match              = /*@type(Array)*/function (/*@type(RegExp)*/arg1) { };
String.prototype.replace            = /*@type(String)*/function (/*@dynamic*/arg1, /*@dynamic*/arg2) { };
String.prototype.search             = /*@type(Number)*/function (/*@type(RegExp)*/arg1) { };
String.prototype.slice              = /*@type(String)*/function (/*@type(Number)*/arg1, /*@type(Number),@optional*/arg2) { };
String.prototype.split              = /*@type(Array)*/function (/*@dynamic*/arg1, /*@type(Number),@optional*/arg2) { };
String.prototype.substr             = /*@type(String)*/function (/*@type(Number)*/arg1, /*@type(Number),@optional*/arg2) { };
String.prototype.substring          = /*@type(String)*/function (/*@type(Number)*/arg1, /*@type(Number),@optional*/arg2) { };
String.prototype.toLowerCase        = /*@type(String)*/function () { };
String.prototype.toLocaleLowerCase  = /*@type(String)*/function () { };
String.prototype.toUpperCase        = /*@type(String)*/function () { };
String.prototype.toLocaleUpperCase  = /*@type(String)*/function () { };
String.prototype.trim               = /*@type(String)*/function () { };

String.fromCharCode = /*@type(String),@varargs*/function(){};


/*
 * Boolean
 */

function Boolean(arg1){ return false; }
Boolean.prototype.length       = 0;
Boolean.prototype.constructor  = Boolean;
Boolean.prototype.toString     = /* @type{String} */function(){};
Boolean.prototype.valueOf      = /* @type{Boolean} */function(){};


/*
 * Number
 */

function Number(/* @optional, @dynamic */arg1){ return 0; }
Number.prototype.length          = 0;
Number.prototype.constructor     = Number;
Number.prototype.toString        = /*@type(String)*/function (/*@type(Number),@optional*/arg1){};
Number.prototype.toLocaleString  = /*@type(String)*/function (){};
Number.prototype.valueOf         = /*@type(Number)*/function (){};
Number.prototype.toFixed         = /*@type(String)*/function (/*@type(Number)*/arg1){};
Number.prototype.toExponential   = /*@type(String)*/function (/*@type(Number)*/arg1){};
Number.prototype.toPrecision     = /*@type(String)*/function (/*@type(Number)*/arg1){};

Number.MAX_VALUE         = 0;
Number.MIN_VALUE         = 0;
Number.NaN               = 0;
Number.NEGATIVE_INFINITY = 0;
Number.POSITIVE_INFINITY = 0;


/*
 * Date
 */

/* @type{String} */function Date(){}
/* @type{String} */function Date(/* @type{Number} */value){}
/* @type{String} */function Date(/* @type{String} */value){}
/* @type{String} */function Date(/* @type{Number} */year, /* @type{Number} */month, /* @type{Number}, @optional */date, /* @type{Number}, @optional */hours, /* @type{Number}, @optional */minutes, /* @type{Number}, @optional */seconds, /* @type{Number}, @optional */ms){}
Date.prototype.constructor         = Date;
Date.prototype.toString            = /* @type{String} */function(){};
Date.prototype.toDateString        = /* @type{String} */function(){};
Date.prototype.toTimeString        = /* @type{String} */function(){};
Date.prototype.toLocaleString      = /* @type{String} */function(){};
Date.prototype.toLocaleDateString  = /* @type{String} */function(){};
Date.prototype.toLocaleTimeString  = /* @type{String} */function(){};
Date.prototype.valueOf             = /* @type{Number} */function(){};
Date.prototype.getTime             = /* @type{Number} */function(){};
Date.prototype.getFullYear         = /* @type{Number} */function(){};
Date.prototype.getUTCFullYear      = /* @type{Number} */function(){};
Date.prototype.getMonth            = /* @type{Number} */function(){};
Date.prototype.getUTCMonth         = /* @type{Number} */function(){};
Date.prototype.getDate             = /* @type{Number} */function(){};
Date.prototype.getUTCDate          = /* @type{Number} */function(){};
Date.prototype.getDay              = /* @type{Number} */function(){};
Date.prototype.getUTCDay           = /* @type{Number} */function(){};
Date.prototype.getHours            = /* @type{Number} */function(){};
Date.prototype.getUTCHours         = /* @type{Number} */function(){};
Date.prototype.getMinutes          = /* @type{Number} */function(){};
Date.prototype.getUTCMinutes       = /* @type{Number} */function(){};
Date.prototype.getSeconds          = /* @type{Number} */function(){};
Date.prototype.getUTCSeconds       = /* @type{Number} */function(){};
Date.prototype.getMilliseconds     = /* @type{Number} */function(){};
Date.prototype.getUTCMilliseconds  = /* @type{Number} */function(){};
Date.prototype.getTimezoneOffset   = /* @type{Number} */function(){};
Date.prototype.setTime             = /* @type{Number} */function(/* @type{Number} */arg1){};
Date.prototype.setMilliseconds     = /* @type{Number} */function(/* @type{Number} */arg1){};
Date.prototype.setUTCMilliseconds  = /* @type{Number} */function(/* @type{Number} */arg1){};
Date.prototype.setSeconds          = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2){};
Date.prototype.setUTCSeconds       = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2){};
Date.prototype.setMinutes          = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2, /*@type(Number),@optional*/arg3){};
Date.prototype.setUTCMinutes       = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2, /*@type(Number),@optional*/arg3){};
Date.prototype.setHours            = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2, /*@type(Number),@optional*/arg3, /*@type(Number),@optional*/arg4){};
Date.prototype.setUTCHours         = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2, /*@type(Number),@optional*/arg3, /*@type(Number),@optional*/arg4){};
Date.prototype.setDate             = /* @type{Number} */function(/* @type{Number} */arg1){};
Date.prototype.setUTCDate          = /* @type{Number} */function(/* @type{Number} */arg1){};
Date.prototype.setMonth            = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2){};
Date.prototype.setUTCMonth         = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2){};
Date.prototype.setFullYear         = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2, /*@type(Number),@optional*/arg3){};
Date.prototype.setUTCFullYear      = /* @type{Number} */function(/* @type{Number} */arg1, /*@type(Number),@optional*/arg2, /*@type(Number),@optional*/arg3){};
Date.prototype.toUTCString         = /* @type{String} */function(){};
Date.prototype.toISOString         = /* @type{String} */function(){};
Date.prototype.toJSON              = /* @type{String} */function(/*@optional,@dynamic*/arg1){};

Date.parse = /* @type{Number} */function(/*@type(String)*/arg1){};
Date.UTC   = /* @type{Number} */function(/* @type{Number} */year, /* @type{Number} */month, /* @type{Number}, @optional */date, /* @type{Number}, @optional */hours, /* @type{Number}, @optional */minutes, /* @type{Number}, @optional */seconds, /* @type{Number}, @optional */ms){};
Date.now   = /* @type{Number} */function(){};


/*
 * JSON
 */

var JSON = {
    parse:      /* @type{Object} */function(/* @type{String} */text, /* @type{Function}, @optional */reviver){},
    stringify:  /* @type{String} */function(/* @dynamic*/value, /* @dynamic, @optional*/replacer, /* @dynamic, @optional */space){}
};


/*
* RegExp
*/

/* @type{RegExp} */
function RegExp(/*@type(String)*/arg1,/*@type(String),@optional*/arg2){}
RegExp.prototype.constructor    = RegExp;
RegExp.prototype.source         = '';
RegExp.prototype.global         = false;
RegExp.prototype.ignoreCase     = false;
RegExp.prototype.multiline      = false;
RegExp.prototype.lastIndex      = 0;
RegExp.prototype.exec           = /*@type(Array)*/function(/*@type(String)*/arg1){};
RegExp.prototype.test           = /*@type(Boolean)*/function(/*@type(String)*/arg1){};
RegExp.prototype.toString       = /*@type(String)*/function(){};


/*
 * Error
 */

/*@type{Error}*/
function Error(/*@type(String),@optional*/arg1){}
Error.prototype.constructor = Error;
Error.prototype.name        = '';
Error.prototype.message     = '';
Error.prototype.toString    = /*@type(String)*/function(){};

/*@type(EvalError)*/function EvalError(/*@type(String),@optional*/arg1){}
EvalError.prototype = new Error;

/*@type(RangeError)*/function RangeError(/*@type(String),@optional*/arg1){}
RangeError.prototype = new Error;

/*@type(ReferenceError)*/function ReferenceError(/*@type(String),@optional*/arg1){}
ReferenceError.prototype = new Error;

/*@type(SyntaxError)*/function SyntaxError(/*@type(String),@optional*/arg1){}
SyntaxError.prototype = new Error;

/*@type(TypeError)*/function TypeError(/*@type(String),@optional*/arg1){}
TypeError.prototype = new Error;

/*@type(URIError)*/function URIError(/*@type(String),@optional*/arg1){}
URIError.prototype = new Error;


/*
 * Arguments
 *
 * in theory, according to ECMA-262, section 10.6, these members are always
 * the same, and should be added to the arguments object on every instance
 * we, however, have this Arguments object to allow customizations
 * Coffeemaker will instantiate an arguments objects when necessary based on
 * the Arguments object defined below
 */

Arguments.length = 0;
Arguments.callee = /* @static_cast Function */null;
Arguments.caller = /* @static_cast Function */null;
