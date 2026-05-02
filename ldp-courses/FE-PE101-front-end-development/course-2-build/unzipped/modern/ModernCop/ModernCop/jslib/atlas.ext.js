function RegisterNamespaceAnalysisExtension(
    /* @type{Coffeemaker.IDocument} */document,
    /* @type{Array<Coffeemaker.IParameter>} */parameters,
    /* @type{Coffeemaker.IAnalysisAction} */action
){
    var nspar = parameters[0];
    if (Coffeemaker.SourceElementKind.String != nspar.kind) {
        return;
    }

    var /* @type{String} */ns = nspar.getValue();
    var parts = ns.split('.');

    var obj = document.getObject(null);
    parts.forEach(
        function (part) {
            // in case of error
            if (null == obj)
                return;

            type = obj.getMember(part);
            if (null == type) {
                // need to construct this object
                type = document.getSymbolType('Object.prototype');
                var newType = document.createType(type, false);
                obj.addMember(part, newType);
                return;
            }
            else if (null == (obj = type.getObject())) {
                // this is a non-object type
                // TODO: raise error?
                obj = null;
                return;
            }
        });
}
