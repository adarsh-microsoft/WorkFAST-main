Coffeemaker.extensions.load('cmext-util.js');

/*
 * NOTE:
 * for the functions below, we don't need to error in case something differs
 * from the expected value, since Coffeemaker (or auxiliary extension libs)
 * will have errored with a parameter count mismatch (if it didn't, the host
 * is disabling its error, in which case we don't want to error anyway)
 */

/* @returns{Boolean} */
function assertObject(
    /* @type{IType} */type,
    /* @type{String}, @optional */errMsg
){
    if (!(type.isObject()))
    {
        if (errMsg)
        {
            Coffeemaker.extensions.raiseError(errMsg);
        }
        return false;
    }
    return true;
}

/* @returns{IObject} */
function assertFunctionObject(
    /* @type{IType} */type,
    /* @type{String}, @optional */errMsg
){
    var /* @type{IObject} */obj;

    obj = type.getObject();
    if (!obj ||
        !obj.isFunction())
    {
        if (errMsg)
        {
            Coffeemaker.extensions.raiseError(errMsg);
        }
        return null;
    }

    return obj;
}

function defineNamespace(
    /* @type{IParameter} */nameParam,
    /* @type{IParameter} */membersParam,
    /* @type{IObject} */root
){
    var /* @type{String} */name,
        /* @type{IType} */membersType,
        /* @type{IObject} */newNsObj;

    name = nameParam.value;
    if (!name)
    {
        return;
    }

    membersType = membersParam.type;
    if (!membersType ||
        membersType.isNull() ||
        !assertObject(membersType, 'parameter \'members\' is not an object'))
    {
        return;
    }

    newNsObj = CmX.utils.createNamespaceInObject(root, name);
    if (!newNsObj)
    {
        return;
    }

    CmX.utils.mix(
        membersType,
        newNsObj.type,
        /* deep */false,
        /* rebind */true,
        /* clobber */true);
}

function WinJS_Namespace_defineExtension(
    /* @type{Array<IParameter>} */parameters,
    /* @type{IAnalysis} */analysis
){
    var /* @type{IParameter} */nameParam,
        /* @type{IParameter} */membersParam,
        /* @type{IObject} */globalObj;

    if (parameters.length < 2)
    {
        return;
    }

    nameParam = parameters[0];
    membersParam = parameters[1];

    globalObj = Coffeemaker.getGlobalObject();
    defineNamespace(nameParam, membersParam, globalObj);
}

function WinJS_Namespace_defineWithParentExtension(
    /* @type{Array<IParameter>} */parameters,
    /* @type{IAnalysis} */analysis
){
    var /* @type{IParameter} */parentNamespaceParam,
        /* @type{IParameter} */nameParam,
        /* @type{IParameter} */membersParam,
        /* @type{IObject} */parentNsObj;

    if (parameters.length < 3)
    {
        return;
    }

    parentNamespaceParam = parameters[0];
    nameParam = parameters[1];
    membersParam = parameters[2];

    parentNamespaceType = parentNamespaceParam.type;
    if (!parentNamespaceType ||
        !assertObject(parentNamespaceType, 'parameter \'parentNamespace\' is not an object'))
    {
        return;
    }

    parentNsObj = parentNamespaceType.getObject();
    defineNamespace(nameParam, membersParam, parentNsObj);
}

/* @returns{IFunction} */
function mixIntoFunction(
    /* @type{IObject} */funcObj,
    /* @type{IType} */funcType,
    /* @type{IType} */instMembers,
    /* @type{IType} */staticMembers
){
    var /* @type{IFunction} */func,
        /* @type{IType} */funcPrototype;

    func = funcObj.asFunction();
    if (!func)
    {
        return;
    }

    if (instMembers)
    {
        funcPrototype = func.getPrototype();
        CmX.utils.mix(
            instMembers,
            funcPrototype,
            /* deep */false,
            /* rebind */true,
            /* clobber */true);
    }
    if (staticMembers)
    {
        CmX.utils.mix(
            staticMembers,
            funcType,
            /* deep */false,
            /* rebind */false,
            /* clobber */true);
    }

    return func;
}

/* @returns{IType} */
function getPrototypeType(
    /* @type{IParameter} */funcParam,
    /* @type{String} */paramName
){
    var /* @type{IType} */funcType,
        /* @type{IObject} */funcObj,
        /* @type{IFunction} */func;

    if (funcParam)
    {
        funcType = funcParam.type;
        if (!funcType ||
            !assertObject(funcType, 'parameter \'' + paramName + '\' is not an object'))
        {
            return null;
        }

        funcObj = assertFunctionObject(
            funcType,
            'parameter \'' + paramName + '\' is not a function');
        if (!funcObj)
        {
            return null;
        }

        func = funcObj.asFunction();
        if (!func)
        {
            /*
             * something is wrong...
             */
            debugger;
            return null;
        }
        funcType = func.getPrototype();
    }
    else
    {
        funcType = null;
    }

    return funcType;
}

/* @returns{IType} */
function defineClass(
    /* @type{IParameter} */functionParam,
    /* @type{IParameter} */instanceMembersParam,
    /* @type{IParameter} */staticMembersParam,
    /* @type{IParameter} */baseClassParam
){
    var /* @type{IType} */funcType,
        /* @type{IObject} */funcObj,
        /* @type{IType} */instanceMembersType,
        /* @type{IType} */staticMembersType,
        /* @type{IFunction} */func,
        /* @type{Boolean} */needsImpl,
        /* @type{IType} */baseClassType,
        /* @type{IType} */funcProto;

    needsImpl = false;

    /*
     * verify that we have an object for the instance members
     */
    instanceMembersType = instanceMembersParam.type;
    if (!instanceMembersType ||
        !assertObject(instanceMembersType, 'parameter \'instanceMembers\' is not an object'))
    {
        return null;
    }

    /*
     * verify that we have an object for the static members
     * (it is an optional parameter, so it is OK if it was not passed)
     */
    if (staticMembersParam)
    {
        staticMembersType = staticMembersParam.type;
        if (!staticMembersType ||
            !assertObject(staticMembersType, 'parameter \'staticMembers\' is not an object'))
        {
            return null;
        }
    }
    else
    {
        staticMembersType = null;
    }

    /*
     * finally, we'd better have the function parameter
     */
    funcType = functionParam.type;
    if (!funcType)
    {
        return null;
    }

    /*
     * now get the base type
     * 1) if baseClassParam is null and the constructor is being passed,
     *    then there's nothing to do here
     * 2) if baseClassParam is null and the constructor is null, then
     *    the funcProto is Function.prototype
     * 3) if baseClassParam is not null and the constructor is being passed,
     *    set that function's prototype to it
     * 4) if baseClassParam is not null and the constructor is null, then
     *    the funcProto is baseClassParam
     */
    baseClassType = getPrototypeType(
        baseClassParam,
        'baseClass');

    /*
     * either construct a new function (if the constructor parameter is null)
     * or verify that it is a function
     * post conditions: funcObj and funcType should both be set
     */
    if (funcType.isNull())
    {
        funcProto = baseClassType || CmX.utils.getTypeForQualifiedName('Function.prototype');
        funcObj = Coffeemaker.createObject(
            CmX.ObjectFlags.UserType | CmX.ObjectFlags.Construct | CmX.ObjectFlags.Function,
            funcProto);
        funcType = funcObj.type;

        needsImpl = true;
    }
    else
    {
        if (!assertObject(funcType, 'parameter \'constructor\' is not an object'))
        {
            return null;
        }

        funcObj = assertFunctionObject(
            funcType,
            'parameter \'constructor\' is not a function');
        if (!funcObj)
        {
            return null;
        }

        /*
         * we have a constructor being passed in, and a base class was specified
         * we need to set the function's prototype to the base class type
         */
        if (baseClassType)
        {
            funcObj.setMemberType('prototype', baseClassType);
        }
    }

    func = mixIntoFunction(
        funcObj,
        funcType,
        instanceMembersType,
        staticMembersType);
    func.role = CmX.FunctionRoles.Constructor;
    if (needsImpl)
    {
        func.addOverload(Coffeemaker.types.undefinedType);
    }
    else
    {
        func.schedule();
    }

    return funcType;
}

function WinJS_Class_defineExtension(
    /* @type{Array<IParameter>} */parameters,
    /* @type{IAnalysis} */analysis
){
    var /* @type{IParameter} */constructorParam,
        /* @type{IParameter} */instanceMembersParam,
        /* @type{IParameter} */staticMembersParam,
        /* @type{IType} */funcType;

    if (parameters.length < 2)
    {
        return;
    }

    constructorParam = parameters[0];
    instanceMembersParam = parameters[1];
    staticMembersParam = parameters.length > 2 ? parameters[2] : null;

    funcType = defineClass(
        constructorParam,
        instanceMembersParam,
        staticMembersParam,
        null);
    if (funcType)
    {
        analysis.returnType = funcType;
    }
}

function WinJS_Class_deriveExtension(
    /* @type{Array<IParameter>} */parameters,
    /* @type{IAnalysis} */analysis
){
    var /* @type{IParameter} */baseClassParam,
        /* @type{IParameter} */constructorParam,
        /* @type{IParameter} */instanceMembersParam,
        /* @type{IParameter} */staticMembersParam,
        /* @type{IType} */funcType;

    if (parameters.length < 3)
    {
        return;
    }

    baseClassParam = parameters[0];
    constructorParam = parameters[1];
    instanceMembersParam = parameters[2];
    staticMembersParam = parameters.length > 3 ? parameters[3] : null;

    funcType = defineClass(
        constructorParam,
        instanceMembersParam,
        staticMembersParam,
        baseClassParam);
    if (funcType)
    {
        analysis.returnType = funcType;
    }
}

function WinJS_Class_mixExtension(
    /* @type{Array<IParameter>} */parameters,
    /* @type{IAnalysis} */analysis
){
    var /* @type{IType} */funcType,
        /* @type{IObject} */funcObj,
        /* @type{IFunction} */func,
        /* @type{IType} */funcPrototype,
        /* @type{IType} */srcType,
        /* @type{Boolean} */needsImpl,
        /* @type{Number} */i,
        /* @type{Number} */len;

    if ((len = parameters.length) < 1)
    {
        return;
    }

    funcType = parameters[0].type;
    if (!funcType)
    {
        return;
    }

    needsImpl = false;

    /*
     * either construct a new function (if the constructor parameter is null)
     * or verify that it is a function
     * post conditions: funcObj and funcType should both be set
     */
    if (funcType.isNull())
    {
        funcObj = Coffeemaker.createObject(
            CmX.ObjectFlags.UserType | CmX.ObjectFlags.Construct | CmX.ObjectFlags.Function,
            CmX.utils.getTypeForQualifiedName('Function.prototype'));
        funcType = funcObj.type;

        needsImpl = true;
    }
    else
    {
        if (!assertObject(funcType, 'parameter \'constructor\' is not an object'))
        {
            return;
        }

        funcObj = assertFunctionObject(
            funcType,
            'parameter \'constructor\' is not a function');
        if (!funcObj)
        {
            return;
        }
    }
    analysis.returnType = funcType;

    func = funcObj.asFunction();
    if (!func)
    {
        /*
         * something is wrong...
         */
        debugger;
        return;
    }
    func.role = CmX.FunctionRoles.Constructor;
    if (needsImpl)
    {
        func.addOverload(Coffeemaker.types.undefinedType);
    }
    else
    {
        func.schedule();
    }

    funcPrototype = func.getPrototype();
    if (!funcPrototype)
    {
        /*
         * something is wrong...
         */
        debugger;
        return;
    }

    for (i = 1; i < len; i++)
    {
        srcType = parameters[i].type;
        if (!srcType ||
            !assertObject(srcType, null))
        {
            Coffeemaker.extensions.raiseError('parameter at position ' + String(i) + ' is not an object');
            continue;
        }

        CmX.utils.mix(
            srcType,
            funcPrototype,
            /* deep */false,
            /* rebind */true,
            /* clobber */true);
    }
}
