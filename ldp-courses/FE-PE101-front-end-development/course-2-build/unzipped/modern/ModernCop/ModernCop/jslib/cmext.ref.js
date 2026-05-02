//
// Copyright(C) 2009-2012 Microsoft Corporation
// All rights reserved.
//

//* @module(CoffeemakerExtensions)

var /* @typedec */IObject;
var /* @typedec */IType;
var /* @typedec */IParameter;
var /* @typedec */IFunction;
var /* @typedec */IAnalysis;

var Coffeemaker = {
    extensions: {
        load:               /* @returns{Boolean} */function(/* @type{String} */filename){},
        raiseError:         /* @returns{void} */function(/* @type{String} */message, /* @type{Boolean},@optional */suppressible){},
        raiseWarning:       /* @returns{void} */function(/* @type{String} */message){},
    },
    types: {
        get nullType()      /* @returns{IType} */{},
        get undefinedType() /* @returns{IType} */{},
        get dynamicType()   /* @returns{IType} */{},
    },
    createObject:           /* @returns{IObject} */function(/* @type{Number} */flags, /* @type{IType},@optional */prototype){},
    getGlobalObject:        /* @returns{IObject} */function(){},
    getTypeOfSymbolInScope: /* @returns{IType} */function(/* @type{String} */name){},
    getTypeOfSymbolInRef:   /* @returns{IType} */function(/* @type{String} */name){},
};

IObject.prototype = {
    addMember:              /* @returns{Boolean} */function(/* @type{String} */name, /* @type{IType} */type, /* @type{Number},@optional */attrs){},
    asFunction:             /* @returns{IFunction} */function(){},
    getMemberType:          /* @returns{IType} */function(/* @type{String} */name){},
    hasMember:              /* @returns{Boolean} */function(/* @type{String} */name){},
    isFunction:             /* @returns{Boolean} */function(){},
    isSameAs:               /* @returns{Boolean} */function(/* @type{IObject} */obj){},
    scan:                   /* @returns{void} */function(/* @type{String -> void} */action){},
    setMemberType:          /* @returns{Boolean} */function(/* @type{String} */name, /* @type{IType} */type){},
    get type()              /* @returns{IType} */{},
};

IType.prototype = {
    getObject:              /* @returns{IObject} */function(){},
    isDynamic:              /* @returns{Boolean} */function(){},
    isNull:                 /* @returns{Boolean} */function(){},
    isObject:               /* @returns{Boolean} */function(){},
    isSameAs:               /* @returns{Boolean} */function(/* @type{IType} */type){},
    isSubtypeOf:            /* @returns{Boolean} */function(/* @type{IType} */type){},
    isUndefined:            /* @returns{Boolean} */function(){},
};

IFunction.prototype = {
    addOverload:            /* @returns{void}, @varargs */function(/* @type{IType} */retType){},
    analyze:                /* @returns{void} */function(){},
    getPrototype:           /* @returns{IType} */function(){},
    role:                   /* @static_cast{Number} */0,
    schedule:               /* @returns{void} */function(){},
    setThisBinding:         /* @returns{Boolean} */function(/* @type{IType} */type){},
};

IParameter.prototype = {
    get type()              /* @returns{IType} */{},
    get value()             /* @returns{*} */{},
};

IAnalysis.prototype = {
    returnType:             /* @static_cast{IType} */null,
};
