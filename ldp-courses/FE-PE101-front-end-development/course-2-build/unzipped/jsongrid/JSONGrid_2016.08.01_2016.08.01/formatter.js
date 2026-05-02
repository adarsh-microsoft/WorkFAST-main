/// <disable>JS2028.UseCPlusPlusStyleComments,JS2032.PlaceLiteralsOnRightSideInComparisons,JS3057.AvoidImplicitTypeCoercion,JS3092.DeclarePropertiesBeforeUse</disable>
/// <dictionary>d-mmm-yy</dictionary>
//// Count without suppression: 79
// JSCOP count: 3, 8 September, 2014
// Current JSCOP count: 3, 8 September, 2014
"use strict";
// thousandFormatter: Formats the number in comma separator format (xxxK/M/B).
function thousandFormatter(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "0";
    } else if (!sInput || isNaN(sInput)) {
        return "N/A";
    }

    // Check for validity of decimal places parameter
    if (!iDecimalPlaces || isNaN(iDecimalPlaces)) {
        iDecimalPlaces = 0; // Default value is 0
    }

    var fTempValue = parseFloat(sInput);
    if (fTempValue < 0) {
        sInput = -1 * fTempValue;
    } else {
        sInput = fTempValue;
    }
    var sTempValue = sInput.toString();

    if (-1 !== sTempValue.indexOf(".")) {
        var decimalLength = sTempValue.substring(sTempValue.indexOf(".") + 1).length;
        if (iDecimalPlaces < decimalLength) {
            sTempValue = parseFloat(sInput.toFixed(iDecimalPlaces)).toString();
        }
    }
    var aDigits = sTempValue.split("."), sIntegerDigits = aDigits[0], sFractionDigits = aDigits.length > 1 ? "." + aDigits[1] : "";

    // Converting thousand to M
    var bConvert = false, kConvert = false, iTempValue = parseInt(sIntegerDigits), sCurrency = "";
    if (iTempValue >= 1000000000) {
        sIntegerDigits = iTempValue / 1000000000;
        sCurrency = "B";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 1000000000 && iTempValue >= 1000000) {
        sIntegerDigits = iTempValue / 1000000;
        sCurrency = "M";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 1000000 && iTempValue >= 1000) {
        sIntegerDigits = iTempValue / 1000;
        sCurrency = "K";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    }

    var rPattern = /(\d+)(\d{3})/;
    while (rPattern.test(sIntegerDigits)) {
        sIntegerDigits = sIntegerDigits.replace(rPattern, "$1" + "," + "$2");
    }
    if (parseInt(sIntegerDigits) || sFractionDigits) {
        return ((fTempValue < 0) ? "-" : "") + sIntegerDigits + sFractionDigits + sCurrency;
    } else {
        return "0";
    }
}
;

// insertCommasOnly: Formats the number in comma separator format (x,xxx,xxx.xx).
function insertCommasOnly(sInput, iDecimalPlaces) {
    if (!sInput || isNaN(sInput)) {
        return "N/A";
    }

    // Check for validity of decimal places parameter
    if (!iDecimalPlaces || isNaN(iDecimalPlaces)) {
        iDecimalPlaces = 0; // Default value is 0
    }
    var fTempValue = parseFloat(sInput), sTempValue = fTempValue.toString();

    if (-1 !== sTempValue.indexOf(".")) {
        var decimalLength = sTempValue.substring(sTempValue.indexOf(".") + 1).length;
        if (iDecimalPlaces < decimalLength) {
            sTempValue = fTempValue.toFixed(iDecimalPlaces).toString();
        }
    }
    var aDigits = sTempValue.split("."), sIntegerDigits = aDigits[0], sFractionDigits = aDigits.length > 1 ? "." + aDigits[1] : "";

    sIntegerDigits = sIntegerDigits.toString();
    var rPattern = /(\d+)(\d{3})/;
    while (rPattern.test(sIntegerDigits)) {
        sIntegerDigits = sIntegerDigits.replace(rPattern, "$1" + "," + "$2");
    }

    var sFinalValue = sIntegerDigits + sFractionDigits;
    if (0 === parseFloat(sFinalValue)) {
        return "0";
    }
    return sFinalValue;
}
;

// insertCommasOnlyWithOnePlace: Returns data with 1 decimal place in format (x,xxx,xxx.xx)
function insertCommasOnlyWithOnePlace(sInput) {
    if (0 === parseFloat(sInput)) {
        return "0";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return insertCommasOnly(sInput, 1);
    }
}

// revenueFormatter: Formats the number in revenue format ($x,xx.xxK).
function revenueFormatter(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "$0";
    } else if (!sInput || isNaN(sInput)) {
        return "N/A";
    }

    // Check for validity of decimal places parameter
    if (!iDecimalPlaces || isNaN(iDecimalPlaces)) {
        iDecimalPlaces = 1; // Default value is 0
    }
    var sTempValue = thousandFormatter(sInput, iDecimalPlaces);
    return ((parseFloat(sTempValue) < 0) ? "-$" + sTempValue.substr(1) : "$" + sTempValue);
}
;

// roundNoDecimalPercent: Formats the number with percentage and removes decimal places (xx%).
function roundNoDecimalPercent(sCellValue) {
    if ("N/A" !== sCellValue) {
        return Math.round(sCellValue) + "%";
    }
    return sCellValue;
}
;

// insertPercentages: Formats the number with percentage after multiplying by 100 (xx.xx%).
function insertPercentages(sCellValue, iDecimalPlaces) {
    if (0 === parseFloat(sCellValue)) {
        return "0%";
    } else if (!sCellValue || isNaN(sCellValue)) {
        return "N/A";
    }
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 0; // Default value is 0
    }
    sCellValue = sCellValue * 100;
    var sTempValue = insertCommasOnly(sCellValue, iDecimalPlaces);
    return sTempValue + "%";
}
;

// insertPercentageOnly: Formats the number with percentage (xx.xx%).
function insertPercentageOnly(sCellValue, iDecimalPlaces) {
    if (0 === parseFloat(sCellValue)) {
        return "0%";
    } else if (!sCellValue || isNaN(parseFloat(sCellValue))) {
        return "N/A";
    }
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 0; // Default value is 0
    }
    var sTempValue = insertCommasOnly(sCellValue, iDecimalPlaces);
    return sTempValue + "%";
}
;

// insertPercentageWithThousandFormatter: Returns data with decimal place in format x.xK/M/B%
function insertPercentageWithThousandFormatter(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "0%";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return thousandFormatter(sInput, iDecimalPlaces) + "%";
    }
}
;

// insertPercentageWithThousandFormatter: Returns data with decimal place in format x.xK/M/B%
function insertPercentageWithThousandFormatterOneDecimal(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "0%";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return thousandFormatter(sInput, 1) + "%";
    }
}
;

// insertPercentageWithThousandFormatter: Returns data with decimal place in format for tile x.xK/M/B%
function insertPercentageWithThousandFormatterForTile(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "0" + "<span class='tileUnitSymbol'>%</span>";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return thousandFormatter(sInput, 1) + "<span class='tileUnitSymbol'>%</span>";
    }
}
;

// dateStringToMonthFormatter: Converts the date passed as string to mmm, yyyy format
function dateStringToMonthFormatter(sInput) {
    if (sInput) {
        var dInputDate = new Date(sInput);
        if ("Invalid Date" !== dInputDate.toDateString()) {
            return formatDateFunction(dInputDate, "mmm, yyyy");
        }
        return "N/A";
    }
    return "N/A";
}

// formatDateFunction: Date formatting function.
function formatDateFunction(formatDate, formatString) {
    if (formatDate instanceof Date) {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var sFullYear = formatDate.getFullYear();
        var yy = sFullYear.toString().substring(2);
        var m = formatDate.getMonth();
        var mm = m < 10 ? "0" + m : m;
        var sMonthName = months[m];
        var d = formatDate.getDate();
        var dd = d < 10 ? "0" + d : d;

        var h = formatDate.getHours();
        var hh = h < 10 ? "0" + h : h;
        var n = formatDate.getMinutes();
        var nn = n < 10 ? "0" + n : n;
        var s = formatDate.getSeconds();
        var ss = s < 10 ? "0" + s : s;

        formatString = formatString.toLowerCase();
        formatString = formatString.replace("hh", hh);
        formatString = formatString.replace("h", h);
        formatString = formatString.replace("nn", nn);
        formatString = formatString.replace("n", n);
        formatString = formatString.replace("ss", ss);
        formatString = formatString.replace("s", s);
        formatString = formatString.replace("dd", dd);
        formatString = formatString.replace("d", d);
        formatString = formatString.replace("yyyy", sFullYear);
        formatString = formatString.replace("yy", yy);
        formatString = formatString.replace("mmm", sMonthName);
        formatString = formatString.replace("mm", (mm + 1));
        formatString = formatString.replace("m", (m + 1));
        return formatString;
    }
    return "";
}
;

// customRevenueFormatter: Formats the number in revenue format and returns object with sign, value and currency ({"$","x,xx.xx","K"})
function customRevenueFormatter(sInput, iDecimalPlaces) {
    if (0 === sInput) {
        return { sign: "$", value: 0, currency: "" };
    } else if (isNaN(sInput) || !sInput) {
        return { sign: "N/A" };
    }

    // Check for validity of decimal places parameter
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 0; // Default value is 2
    }
    var fTempValue = parseFloat(sInput);
    if (fTempValue < 0) {
        sInput = -1 * fTempValue;
    }

    // Check for validity of decimal places parameter
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 2; // Default value is 2
    }
    var sTempValue = sInput.toString();

    if (-1 !== sTempValue.indexOf(".")) {
        var decimalLength = sTempValue.substring(sTempValue.indexOf(".") + 1).length;
        if (iDecimalPlaces < decimalLength) {
            sTempValue = sInput.toFixed(iDecimalPlaces).toString();
        }
    }
    var aDigits = sTempValue.split("."), sIntegerDigits = aDigits[0], sFractionDigits = aDigits.length > 1 ? "." + aDigits[1] : "";

    // Converting thousand to M
    var bConvert = false, kConvert = false, iTempValue = parseInt(sIntegerDigits), sCurrency = "";
    if (iTempValue >= 1000000000) {
        sIntegerDigits = iTempValue / 1000000000;
        sCurrency = "B";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 1000000000 && iTempValue >= 1000000) {
        sIntegerDigits = iTempValue / 1000000;
        sCurrency = "M";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 1000000 && iTempValue >= 1000) {
        sIntegerDigits = iTempValue / 1000;
        sCurrency = "K";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    }

    var rPattern = /(\d+)(\d{3})/;
    while (rPattern.test(sIntegerDigits)) {
        sIntegerDigits = sIntegerDigits.replace(rPattern, "$1" + "," + "$2");
    }
    return { sign: ((fTempValue < 0) ? "-$" : "$"), value: sIntegerDigits + sFractionDigits, currency: sCurrency };
}
;

// customRevenueFormatter: Formats the number in revenue format and returns object with sign, value and currency ({"-","x,xx.xx","K"})
function customThousandFormatter(sInput, iDecimalPlaces) {
    if (0 === sInput) {
        return { sign: "", value: "0", currency: "" };
    } else if (isNaN(sInput) || !sInput) {
        return { sign: "N/A" };
    }

    // Check for validity of decimal places parameter
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 0; // Default value is 0
    }
    var fTempValue = parseFloat(sInput);
    if (fTempValue < 0) {
        sInput = -1 * fTempValue;
    }

    // Check for validity of decimal places parameter
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 2; // Default value is 2
    }
    var sTempValue = sInput.toString();

    if (-1 !== sTempValue.indexOf(".")) {
        var decimalLength = sTempValue.substring(sTempValue.indexOf(".") + 1).length;
        if (iDecimalPlaces < decimalLength) {
            sTempValue = parseFloat(sInput).toFixed(iDecimalPlaces).toString();
        }
    }
    var aDigits = sTempValue.split("."), sIntegerDigits = aDigits[0], sFractionDigits = aDigits.length > 1 ? "." + aDigits[1] : "";

    // Converting thousand to M
    var bConvert = false, kConvert = false, iTempValue = parseInt(sIntegerDigits), sCurrency = "";
    if (iTempValue >= 1000000000) {
        sIntegerDigits = iTempValue / 1000000000;
        sCurrency = "B";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 1000000000 && iTempValue >= 1000000) {
        sIntegerDigits = iTempValue / 1000000;
        sCurrency = "M";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 1000000 && iTempValue >= 1000) {
        sIntegerDigits = iTempValue / 1000;
        sCurrency = "K";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    }

    var rPattern = /(\d+)(\d{3})/;
    while (rPattern.test(sIntegerDigits)) {
        sIntegerDigits = sIntegerDigits.replace(rPattern, "$1" + "," + "$2");
    }
    return { sign: ((fTempValue < 0) ? "-" : ""), value: sIntegerDigits + sFractionDigits, currency: sCurrency };
}
;

function customHighPercentFormatter(sInput, iDecimalPlaces) {
    var rPattern = /(\d+)(\d{3})/, sTempValue, bConvert, kConvert, iTempValue, sCurrency, decimalLength, fTempValue;
    if (0 === sInput) {
        return { sign: "", value: 0, currency: "" };
    } else if (isNaN(sInput) || !sInput) {
        return { sign: "N/A" };
    }

    // Check for validity of decimal places parameter
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 0; // Default value is 0
    }
    fTempValue = parseFloat(sInput);
    if (fTempValue < 0) {
        sInput = -1 * fTempValue;
    }

    // Check for validity of decimal places parameter
    if ((!iDecimalPlaces || isNaN(iDecimalPlaces)) && iDecimalPlaces !== 0) {
        iDecimalPlaces = 2; // Default value is 2
    }
    sTempValue = sInput.toString();

    if (-1 !== sTempValue.indexOf(".")) {
        decimalLength = sTempValue.substring(sTempValue.indexOf(".") + 1).length;
        if (iDecimalPlaces < decimalLength) {
            sTempValue = sInput.toFixed(iDecimalPlaces).toString();
        }
    }
    var aDigits = sTempValue.split("."), sIntegerDigits = aDigits[0], sFractionDigits = aDigits.length > 1 ? "." + aDigits[1] : "";

    // Converting thousand to M
    bConvert = false, kConvert = false, iTempValue = parseInt(sIntegerDigits), sCurrency = "";
    if (iTempValue >= 100000000) {
        sIntegerDigits = iTempValue / 1000000000;
        sCurrency = "B";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 100000000 && iTempValue >= 100000) {
        sIntegerDigits = iTempValue / 1000000;
        sCurrency = "M";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    } else if (iTempValue < 100000 && iTempValue >= 100) {
        sIntegerDigits = iTempValue / 1000;
        sCurrency = "K";
        sFractionDigits = "";
        sIntegerDigits = sIntegerDigits.toFixed(iDecimalPlaces).toString();
    }

    while (rPattern.test(sIntegerDigits)) {
        sIntegerDigits = sIntegerDigits.replace(rPattern, "$1" + "," + "$2");
    }
    return { sign: ((fTempValue < 0) ? "-" : ""), value: sIntegerDigits + sFractionDigits, currency: sCurrency };
}
;

// parseCustomBarChart: Renders bar chart and corresponding cell value
function parseCustomBarChart(cellValue, oRowJsonObject, oFormatterOptions) {
    var fMax = 1, sField, sNumberFormatter, fPercentValue = 0, sReturnValue, sBgColor, funFormatter, sCustomBarChartTemplate = "<div class='CustomerBarChartValue'>{2}</div><div style='width:{a}px' class='CustomerBarChart_Container'><div class='CustomerBarChart_{0}' style='width:{1}%; height:20px {3}'></div></div>", fParentWidth = 0;

    if (oFormatterOptions) {
        fMax = oFormatterOptions.maxValue;
        sField = oFormatterOptions.field;
        sNumberFormatter = oFormatterOptions.numberFormatter;
    }
    fParentWidth = (oFormatterOptions.fCell).replace("px", "").replace("%", "");

    if (!sNumberFormatter) {
        funFormatter = window["thousandFormatter"];
    } else {
        funFormatter = window[sNumberFormatter];
    }
    if (!cellValue || isNaN(parseFloat(cellValue))) {
        sReturnValue = sCustomBarChartTemplate.replace("{0}", sField).replace("{1}", "0").replace("{2}", "N/A").replace("{3}", "");
    } else {
        fPercentValue = parseFloat((parseFloat(cellValue) / fMax * 100).toFixed(2));
        if (oRowJsonObject.colorStyle && -1 !== oRowJsonObject.colorStyle.columnName.indexOf(sField)) {
            sBgColor = oRowJsonObject.colorStyle.color[oRowJsonObject.colorStyle.columnName.indexOf(sField)];
            sReturnValue = sCustomBarChartTemplate.replace("{0}", sField).replace("{1}", fPercentValue.toString()).replace("{2}", funFormatter(cellValue, 1)).replace("{3}", "; background-color:" + sBgColor).replace("{a}", (fParentWidth - 95).toString());
        } else {
            sReturnValue = sCustomBarChartTemplate.replace("{0}", sField + " CustomerBarChart_SingleColor").replace("{1}", fPercentValue.toString()).replace("{2}", funFormatter(cellValue, 1)).replace("{3}", "").replace("{a}", (fParentWidth - 105).toString());
        }
    }
    return sReturnValue;
}

// stringToDateFormatter: Converts the string passed into d-mmm-yy format
function stringToDateFormatter(sInput) {
    if (sInput) {
        var dInputDate = new Date(sInput);
        if ("Invalid Date" !== dInputDate.toDateString()) {
            return formatDateFunction(dInputDate, "d-mmm-yy");
        }
        return "N/A";
    }
    return "N/A";
}

// stringToNumericalDateFormatter: Converts the string passed into mm/dd/yyyy format
function stringToNumericalDateFormatter(sInput) {
    if (sInput) {
        var dInputDate = new Date(sInput);
        if ("Invalid Date" !== dInputDate.toDateString()) {
            return formatDateFunction(dInputDate, "m/d/yyyy");
        }
        return "N/A";
    }
    return "N/A";
}

// stringToDateFormatter: Converts the string passed into mmm d, yyyy format
function customStringToDateFormatter(sInput) {
    if (sInput) {
        var dInputDate = new Date(sInput);
        if ("Invalid Date" !== dInputDate.toDateString()) {
            return formatDateFunction(dInputDate, "mmm d, yyyy");
        }
        return "N/A";
    }
    return "N/A";
}

// insertCommasWithRevenueFormatter: Returns data in format $x,xxx,xxx.xx
function insertCommasWithRevenueFormatter(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "$0";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        var sTempValue = insertCommasOnly(sInput, iDecimalPlaces);
        return ((parseFloat(sTempValue) < 0) ? "-$" + sTempValue.substr(1) : "$" + sTempValue);
    }
}

// insertRevenueWithTwoPlaces: Returns data with 2 decimal places in format $xxx.xxK/M/B
function insertRevenueWithTwoPlaces(sInput) {
    if (0 === parseFloat(sInput)) {
        return "$0";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return revenueFormatter(sInput, 2);
    }
}

// insertRevenueWithTwoPlaces: Returns data with 2 decimal places in format $xxx.xxK/M/B
function insertPercentageWithTwoPlaces(sInput) {
    if (0 === parseFloat(sInput)) {
        return "0%";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return insertPercentageOnly(sInput, 2);
    }
}

// insertPercentageWithOnePlace: Returns data with 1 decimal place in format xx.x%
function insertPercentageWithOnePlace(sInput) {
    if (0 === parseFloat(sInput)) {
        return "0%";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return insertPercentageOnly(sInput, 1);
    }
}

// thousandFormatterWithOnePlace: Returns data with 1 decimal place in format xx.x%
function thousandFormatterWithOnePlace(sInput) {
    if (0 === parseFloat(sInput)) {
        return "0";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        return thousandFormatter(sInput, 1);
    }
}

// Add ellipsis after maxLength of characters
function trimMultiLine(sInput, maxLength) {
    if (!maxLength) {
        maxLength = 50; // Default is 25
    }
    var sOutput = sInput;
    if (sOutput.length > maxLength) {
        sOutput = sOutput.substr(0, maxLength - 3) + "...";
    }
    return sOutput;
}

/// <disable>JS2025.InsertSpaceBeforeCommentText</disable>
// insertCompetitorByRevLossFormatter: Returns data in format $x,xxx,xxx.x
function insertCompetitorByRevLossFormatter(sInput, iDecimalPlaces) {
    if (0 === parseFloat(sInput)) {
        return "$0";
    } else if (!sInput || isNaN(parseFloat(sInput))) {
        return "N/A";
    } else {
        var sTempValue = insertCommasOnly(sInput, 1);
        return ((parseFloat(sTempValue) < 0) ? "-$" + sTempValue.substr(1) : "$" + sTempValue);
    }
}
//# sourceMappingURL=formatters.js.map