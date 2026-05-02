/// <disable>JS2076.IdentifierIsMiscased,JS3056.DeclareVariablesOnceOnly,JS3092.DeclarePropertiesBeforeUse,JS2032.PlaceLiteralsOnRightSideInComparisons,JS3057.AvoidImplicitTypeCoercion,JS3054.NotAllCodePathsReturnValue</disable>
/// <dictionary target='comment'>maqutility</dictionary>
/// <dictionary>maqutility</dictionary>
// Count without suppression: 37
// JSCOP count: 0; June 19, 2014.
// Current JSCOP count: 0;  June 19, 2014.
if ("undefined" === typeof oGridConstants) {
    var oGridConstants = {
        sNAN: "NaN",
        sNA: "N/A",
        sParseDate: "parseDate",
        sParseDollar: "parseUSD",
        sParseInteger: "parseInteger",
        sParseFloat: "parseDecimal",
        sParseString: "parseString",
        sParseSalesStage: "parseSalesStage",
        sError: "Unable to copy oObject! Its type isn't supported.",
        sFunction: "function",
        sPaginationText: "Jump to",
        sDefaultWidth: "250px",
        iDropDownLimit: 20
    };
}
var MAQUtility;
(function (MAQUtility) {
    function getParents(oNode, sClassSelector) {
        var aParents = [], oCurrentNode = oNode.parentNode, oTempNode;
        while (oCurrentNode !== document) {
            oTempNode = oCurrentNode;
            if (!sClassSelector || !sClassSelector.length || (-1 < oTempNode.className.indexOf(sClassSelector))) {
                aParents.push(oTempNode);
            }
            oCurrentNode = oTempNode.parentNode;
        }
        return aParents;
    }
    MAQUtility.getParents = getParents;
    function applyStyleToObject(oNode, oStyleObject) {
        var oStyles, iCounter;
        if (typeof oStyleObject === "undefined") {
            return;
        }
        oStyles = Object.keys(oStyleObject), iCounter = 0;
        for (iCounter; iCounter < oStyles.length; iCounter += 1) {
            try {
                oNode.style[oStyles[iCounter]] = oStyleObject[oStyles[iCounter]];
            } catch (exception) {
            }
        }
        return;
    }
    MAQUtility.applyStyleToObject = applyStyleToObject;
    function hasClass(oElement, sName) {
        if (oElement && oElement.className) {
            return new RegExp("(\\s|^)" + sName + "(\\s|$)").test(oElement.className);
        }
        return;
    }
    MAQUtility.hasClass = hasClass;
    function removeClass(oElement, sName) {
        var iIterator;
        if (oElement && oElement.length > 0) {
            for (iIterator = 0; iIterator < oElement.length; iIterator++) {
                if (hasClass(oElement[iIterator], sName)) {
                    oElement[iIterator].className = oElement[iIterator].className.replace(new RegExp("(\\s|^)" + sName + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, "");
                }
            }
        } else {
            if (oElement && hasClass(oElement, sName)) {
                oElement.className = oElement.className.replace(new RegExp("(\\s|^)" + sName + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, "");
            }
        }
    }
    MAQUtility.removeClass = removeClass;
    function addClass(oElement, sName) {
        var iIterator;
        if (oElement && oElement.length > 1) {
            for (iIterator = 0; iIterator < oElement.length; iIterator++) {
                if (!hasClass(oElement[iIterator], sName)) {
                    oElement[iIterator].className += (oElement[iIterator].className ? " " : "") + sName;
                }
            }
        } else {
            if (oElement && !hasClass(oElement, sName)) {
                oElement.className += (oElement.className ? " " : "") + sName;
            }
        }
    }
    MAQUtility.addClass = addClass;
    function sortBy(field, reverse, primer) {
        var key = function (x) {
            return primer ? primer(x[field]) : x[field];
        }, time = function (x) {
            if (x[field]) {
                return Date.parse(x[field]);
            }
            return 0;
        }, trimUSD = function (x) {
            if (x[field] && x[field] !== oGridConstants.sNA) {
                return parseInt(x[field].substring(1, x[field].length).split(",").join(""));
            }
            return 0;
        }, trimSalesStage = function (x) {
            if (x[field] && x[field] !== oGridConstants.sNA) {
                var oStageInfo = x[field].split(" ");
                return parseInt(oStageInfo[oStageInfo.length - 1].slice(0, oStageInfo[oStageInfo.length - 1].length - 1));
            }
            return 0;
        }, stringConvert = function (x) {
            if (x[field] && x[field] !== oGridConstants.sNA) {
                return x[field].toString();
            }
            return 0;
        }, parseInteger = function (x) {
            if (x[field]) {
                return parseInt(x[field]);
            }
            return 0;
        }, parseDecimal = function (x) {
            if (x[field]) {
                return parseFloat(x[field]);
            }
            return 0;
        }, parseString = function (x) {
            if (x[field]) {
                return x[field].toString();
            }
            return "";
        };
        return function (a, b) {
            var iFirstValue, iSecondValue;
            if (primer === oGridConstants.sParseDate) {
                iFirstValue = time(a), iSecondValue = time(b);
            } else if (primer === oGridConstants.sParseDollar) {
                iFirstValue = trimUSD(a), iSecondValue = trimUSD(b);
            } else if (primer === oGridConstants.sParseSalesStage) {
                iFirstValue = trimSalesStage(a), iSecondValue = trimSalesStage(b);
            } else if (primer === oGridConstants.sParseInteger) {
                iFirstValue = parseInteger(a), iSecondValue = parseInteger(b);
            } else if (primer === oGridConstants.sParseFloat) {
                iFirstValue = parseDecimal(a), iSecondValue = parseDecimal(b);
            } else if (primer === oGridConstants.sParseString) {
                iFirstValue = parseString(a), iSecondValue = parseString(b);
            } else {
                if (primer === parseFloat || primer === parseInt) {
                    iFirstValue = key(a), iSecondValue = key(b);
                    if (String(iFirstValue) === oGridConstants.sNAN) {
                        iFirstValue = 0;
                    }
                    if (String(iSecondValue) === oGridConstants.sNAN) {
                        iSecondValue = 0;
                    }
                } else {
                    iFirstValue = (key(a) || "").toString().toLowerCase(), iSecondValue = key(b).toLowerCase();
                }
            }
            return ((iFirstValue < iSecondValue) ? -1 : (iFirstValue > iSecondValue) ? +1 : 0) * [-1, 1][+!!reverse];
        };
    }
    MAQUtility.sortBy = sortBy;
    function clone(oObject) {
        // Handle the 3 simple types, and null or undefined
        var copy, len, i = 0, attribute;
        if (oObject && oObject.length) {
            len = oObject.length;
        }
        ;
        if (null === oObject || "object" !== typeof oObject) {
            return oObject;
        }

        // Handle Date
        if (oObject instanceof Date) {
            copy = new Date();
            copy.setTime(oObject.getTime());
            return copy;
        }

        // Handle Array
        if (oObject instanceof Array) {
            copy = [];
            for (i = 0; i < len; i++) {
                copy[i] = MAQUtility.clone(oObject[i]);
            }
            return copy;
        }

        // Handle Object
        if (oObject instanceof Object) {
            copy = {};
            for (attribute in oObject) {
                if (oObject.hasOwnProperty(attribute)) {
                    copy[attribute] = MAQUtility.clone(oObject[attribute]);
                }
            }
            return copy;
        }
        throw new Error(oGridConstants.sError);
    }
    MAQUtility.clone = clone;

    // MAQUtility.applyFormatter: applies formatting to data
    function applyFormatter(sText, sFormatterName, oConfiguration, iIterator) {
        if (typeof oConfiguration === "undefined") { oConfiguration = {}; }
        if (typeof iIterator === "undefined") { iIterator = 0; }
        if (sFormatterName) {
            if (typeof (window[sFormatterName]) === 'function') {
                sText = window[sFormatterName](sText, oConfiguration, iIterator);
            } else if (typeof sFormatterName === 'function') {
                sText = sFormatterName(sText, oConfiguration, iIterator);
            }
        }
        return sText;
    }
    MAQUtility.applyFormatter = applyFormatter;
    ;
})(MAQUtility || (MAQUtility = {}));
/// <disable>JS2025.InsertSpaceBeforeCommentText</disable>
//# sourceMappingURL=maqUtility.js.map
