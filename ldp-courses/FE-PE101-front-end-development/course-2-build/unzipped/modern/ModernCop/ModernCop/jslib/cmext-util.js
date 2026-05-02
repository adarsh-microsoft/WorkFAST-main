//* @reference('cmext.ref.js')

var CmX = {};
CmX.ObjectFlags = {
    None:           0x0,
    Call:           0x1, // object type can be called
    UserType:       0x2, // object type can be used as a type (eg, in type comments)
    Construct:      0x4, // object type can be constructed (ie, it is a constructor)
    Function:       0x8, // object type represents a function
};
CmX.FunctionRoles = {
    Constructor:    0x1, // function is a constructor
    DirectInvoke:   0x2, // function can be called directly
};
CmX.MemberAttributes = {
    None:           0x0,
    Read:           0x1, // member can be read from
    Write:          0x2, // member can be written to
};

CmX.utils = {};
CmX.utils.createNamespace = function(
    /* @type{String} */ns
){
    var /* @type{IObject} */newNs,
        /* @type{IObject} */parent;

    parent = Coffeemaker.getGlobalObject();
    newNs = CmX.utils.createNamespaceInObject(
        parent,
        ns);

    return newNs;
};

CmX.utils.createNamespaceInObject = function(
    /* @type{IObject} */parent,
    /* @type{String} */ns
){
    var /* @type Array<String> */parts,
        /* @type IObject */obj,
        /* @type Number */partsIdx;

    /*
     * ns is a string, and we'll now get each namespace part
     */
    parts  = ns.split('.');

    /*
     * obj will contain the current level in the namespace chain that we
     * are examining -- we'll start at the global scope
     */
    obj = parent;

    /*
     * and then for each part, we'll either ensure it, or fail if it
     * already exists, and is not an object
     */
    partsIdx = 0;
    parts.forEach(
        function (namePart)
        {
            var /* @type IType */type;
            var /* @type IObject */newObj;

            /*
             * in case there was an error in a previous iteration
             */
            if (null == obj)
            {
                return;
            }

            /*
             * we'll get the type for the member with the current name
             */
            type = obj.getMemberType(namePart);

            /*
             * if we didn't find it, we will check to see if we need to look
             * in the reference documents
             */
            if (null == type &&
                0 == partsIdx &&
                obj == Coffeemaker.getGlobalObject())
            {
                type = Coffeemaker.getTypeOfSymbolInRef(namePart);
            }

            /*
             * finally, create the object member if we need to
             */
            if (null == type)
            {
                /*
                 * this is the easy case, member was not found
                 * we'll create it
                 */

                newObj = Coffeemaker.createObject(CmX.ObjectFlags.None);
                type = newObj.type;
                if (!(obj.addMember(namePart, type)))
                {
                    /*
                     * something went very wrong
                     */
                    debugger;
                }
            }
            else
            {
                newObj = type.getObject();
                if (null == newObj)
                {
                    /*
                     * this is a non-object type
                     */

                    var /* @type String */errPath;

                    errPath = parts.slice(0, partsIdx + 1).join('.');
                    Coffeemaker.extensions.raiseError('\'' + errPath + '\' already defined, but it is not an object');
                }
            }
            obj = newObj;
            partsIdx++;
        });

    /*
     * return the newly-created object (of type IObject)
     * or null in case of error
     */
    return obj;
};

CmX.utils.mix = function(
    /* @type IType */src,
    /* @type IType */dest,
    /* @type Boolean */deep,
    /* @type Boolean */rebind,
    /* @type Boolean */clobber
){
    var /* @type IObject */srcObj,
        /* @type IObject */destObj;

    srcObj = src.getObject();
    destObj = dest.getObject();
    if (null == srcObj ||
        null == destObj)
    {
        /*
         * either source or destionation are not objects
         * can't mix them
         */
        var /* @type String */errObjName;

        errObjName = null == srcObj ? 'source' : 'destination';
        Coffeemaker.extensions.raiseError(errObjName + ' object is not an object');
        return;
    }

    srcObj.scan(
        function (name)
        {
            var /* @type IType */ srcMemberType,
                /* @type IType */ destMemberType,
                /* @type Boolean */srcMemberIsObj;

            srcMemberType = srcObj.getMemberType(name);
            srcMemberIsObj = srcMemberType.isObject();

            destMemberType = destObj.getMemberType(name);
            if (null != destMemberType)
            {
                /*
                 * destionation already has a member with this name
                 * two interesting options in here
                 *
                 * 1) both are members objects (additional checks required)
                 * 2) incompatible types in source and destination
                 */
                if (srcMemberIsObj &&
                    destMemberType.isObject())
                {
                    /*
                     * both are objects
                     *
                     * if we are deep-mixing them, we can simply recurse
                     * else, this is an error
                     */
                    if (deep)
                    {
                        CmX.utils.mix(srcMemberType, destMemberType, deep, rebind, clobber);
                    }
                    else
                    {
                        if (!clobber ||
                            !destObj.setMemberType(name, srcMemberType))
                        {
                            Coffeemaker.extensions.raiseError('destination object already contains a member \'' + name + '\'');
                        }
                    }
                }
                else
                {
                    Coffeemaker.extensions.raiseError('cannot mix member \'' + name + '\' into destination');
                }
                return;
            }

            destObj.addMember(name, srcMemberType);

            /*
             * finally, we will rebind the source functions
             */
            if (rebind &&
                srcMemberIsObj)
            {
                var /* @type{IObject} */srcMemberObj,
                    /* @type{IFunction} */func,
                    /* @type{Number} */funcRole;

                srcMemberObj = srcMemberType.getObject();
                if (srcMemberObj.isFunction())
                {
                    func = srcMemberObj.asFunction();
                    funcRole = func.role;
                    if (0 === (funcRole & CmX.FunctionRoles.Constructor))
                    {
                        func.setThisBinding(dest);
                    }
                }
            }
        });
};

/* @returns{IType} */
CmX.utils.getTypeForQualifiedName = function(
    /* @type String */name,
    /* @type IObject, @optional */scope
){
    var /* @type Array<String> */parts,
        /* @type IObject */obj,
        /* @type IType */type,
        /* @type Boolean */first;

    /*
     * if we don't have a scope, we'll use the global scope
     */
    obj = scope || Coffeemaker.getGlobalObject();
    first = true;

    /*
     * name is a string, and we'll now get each namespace part
     */
    parts  = name.split('.');
    parts.forEach(
        function (namePart)
        {
            if (obj)
            {
                type = obj.getMemberType(namePart);
                obj = type && type.getObject();
            }
            else
            {
                type = null;
            }

            if (!type && first && !scope)
            {
                /*
                 * all the following are true:
                 * - this is the first name in the qualified name
                 * - we didn't find this name in the global scope
                 * - a specific scope wasn't supplied
                 * then we'll try to look in the reference documents
                 */
                type = Coffeemaker.getTypeOfSymbolInRef(namePart);
                if (type)
                {
                    obj = type.getObject();
                }
            }
            first = false;
        });

    return type;
};
