Coffeemaker.extensions.load('cmext-util.js');

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
function objectCreate(
    /* @type{IType} */prototype
){
    var /* @type{IType} */p;
    var /* @type{IObject} */retObject;

    p = void 0;

    /*
     * verify that the prototype is either an object or null, per section
     * 15.2.3.5 of ECMA-262
     */
    if (Boolean(prototype))
    {
        if (prototype.isNull())
        {
            p = null;
        }
        else if (assertObject(prototype, 'parameter \'proto\' is not an object'))
        {
            p = prototype;
        }
    }

    /*
     * the type is not valid, just quit
     * Coffeemaker should have already errored, and will fallback to the
     * default behavior
     */
    if (void 0 === p)
    {
        return null;
    }

    /*
     * create the object with the requested prototype
     */
    retObject = Coffeemaker.createObject(CmX.ObjectFlags.None, p);
    return retObject;
}

function Object_create(
    /* @type{Array<IParameter>} */parameters,
    /* @type{IAnalysis} */analysis
){
    var /* @type{IParameter} */protoParam;
    var /* @type{IParameter} */propertiesParam;
    var /* @type{IType} */type;
    var /* @type{IType} */prototype;
    var /* @type{IObject} */retObject;
    var /* @type{IObject} */propObject;

    if (parameters.length < 1)
    {
        return;
    }

    /*
     * try to construct the object, and fallback to the default behavior
     * if something went wrong
     */
    protoParam = parameters[0];
    retObject = objectCreate(protoParam.type);
    if (!retObject)
    {
        return;
    }

    /*
     * if additional properties were specified, try to add them
     * the next parameter being present, but undefined, is valid -
     * so we need to check for that
     */
    if (2 == parameters.length)
    {
        propertiesParam = parameters[1];
        type = propertiesParam.type;

        if (!(type.isUndefined) &&
            assertObject(type, 'parameter \'properties\' is not an object'))
        {
            CmX.utils.mix(type, retObject.type, false, true, false);
        }
    }

    analysis.returnType = retObject.type;
}
