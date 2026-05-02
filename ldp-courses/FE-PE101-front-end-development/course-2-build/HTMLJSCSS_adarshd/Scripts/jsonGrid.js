/// <reference path="../../../scripts/typings/jquery/winjs.d.ts" />
/// <reference path="formatters.ts" />
/// <reference path="maqutility.ts" />
/// <disable>S1003.SemanticAnalysisHalted,JS3092.DeclarePropertiesBeforeUse,JS2032.PlaceLiteralsOnRightSideInComparisons,JS3057.AvoidImplicitTypeCoercion,JS3054.NotAllCodePathsReturnValue</disable>
/// <dictionary target='member'>Config,sortby,sortorder,viewrecords,oParam, Param, aTrs</dictionary>
/// <dictionary target='variable'>arr,Config</dictionary>
// Count without suppression: 292.
// JS Cop count: 2; September 3, 2014.
// Current JS Cop count: 2; September 8, 2014.
if ("undefined" === typeof MAQ) {
    var MAQ = {};
}

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
MAQ.gridName = [];
MAQ.gridObject = [];
function newRecords(oElement, sGridName) {
    if (oElement) {
        if (!oElement.getAttribute("data-pageId")) {
            oElement = oElement.childNodes[0];
        }
        if (oElement.getAttribute("data-pageId")) {
            var iGridObjectPosition = MAQ.gridName.indexOf(sGridName), iCurrentPage = parseInt(oElement.getAttribute("data-pageId")), iLastPage = parseInt(MAQ.gridObject[iGridObjectPosition].totalPages) + 1;
            MAQUtility.addClass(oElement, "SelectedPage");
            if (iCurrentPage) {
                MAQ.getPage(iCurrentPage, iLastPage, MAQ.gridObject[iGridObjectPosition]);
            }
        }
    }
}
MAQ.getAdjustedRowChunk = function (inputData, width) {
    return '<div class="jsonGridOverflow" title="' + inputData + '" style="width: ' + width + 'px;">' + inputData + "</div>";
};
MAQ.getAdjustedRowChunkAndToolTip = function (inputData, width) {
    width = width || "100";
    width = width.replace("%", "").replace("px", "");
    return '<span class="jsonGridOverflow" title="' + inputData + '" style="width: ' + (width - 15 >= 15 ? width - 15 : 15) + 'px;">' + inputData + "</span>";
};
MAQ.setViewRecords = function (oCurrentGridConfiguration) {
    /// <disable>JS3058</disable>
    var oGridElement = document.getElementById(oCurrentGridConfiguration.gridName), oViewRecords = document.getElementById(oCurrentGridConfiguration.gridName + "_ViewRecords"), iCurrentPage = (parseInt(oCurrentGridConfiguration.currentPage) || 0) + 1, iLastPage = (parseInt(oCurrentGridConfiguration.totalPages) || 0) + 1, iIterator, iStartIndex = 1, oElementDropDown = oGridElement.querySelector(".ListOption[data-pageId='" + iCurrentPage + "']"), iTotalPages = 0;

    MAQUtility.removeClass(oGridElement.querySelectorAll(".PageListItem"), "SelectedPage");
    MAQUtility.removeClass(oGridElement.querySelectorAll(".ListOption"), "SelectedPage");
    MAQUtility.addClass(oGridElement.querySelector(".PageListItem[data-pageId='" + iCurrentPage + "']"), "SelectedPage");
    MAQUtility.addClass(oElementDropDown, "SelectedPage");
    if (oElementDropDown) {
        oElementDropDown.selected = true;
    }

    // Create Pagination list
    iTotalPages = iLastPage < (iCurrentPage + 4) ? iLastPage : (iCurrentPage + 4);
    MAQ.generatePageList(oCurrentGridConfiguration, iCurrentPage, iTotalPages);
    if (oCurrentGridConfiguration.serverGrid.enabled) {
        var oHiddenContainer = document.getElementById(oCurrentGridConfiguration.container + "_hidden");
        if (oHiddenContainer) {
            oHiddenContainer.setAttribute("data-currentPage", oCurrentGridConfiguration.currentPage);
        }
        MAQ.callService(oCurrentGridConfiguration);
    } else {
        MAQ.populateGrid(oCurrentGridConfiguration);
    }
};

// Generate page list to be displayed in pagination control
MAQ.generatePageList = function (oCurrentGridConfiguration, iCurrentPage, iTotalPages) {
    var oGridElement = document.getElementById(oCurrentGridConfiguration.container), oPage, oPageList = oGridElement.querySelector(".ViewRecordDiv > div"), iIterator = 0, iStartIndex = 1;

    // Change page numbers
    if (oPageList) {
        // Clear existing page list
        oPageList.innerHTML = "";
        iStartIndex = (((iTotalPages - 4) > 0) && iCurrentPage >= (iTotalPages - 4)) ? iTotalPages - 4 : iCurrentPage;
        iStartIndex = iTotalPages <= 5 ? 1 : iStartIndex;
        for (iIterator = iStartIndex; iIterator <= iTotalPages; iIterator++) {
            // Regenerate pages
            oPage = document.createElement("div");
            oPage.innerText = insertCommasOnly(iIterator, 0);
            if (iIterator === iCurrentPage) {
                MAQUtility.addClass(oPage, "SelectedPage");
            }
            MAQUtility.addClass(oPage, "PageListItem");
            oPage.setAttribute("data-pageId", iIterator);
            oPage.setAttribute("onclick", "newRecords(this,'" + oCurrentGridConfiguration.gridName + "')");
            oPageList.appendChild(oPage);
        }
    }
};
MAQ.getPage = function (iCurrentPageNum, iLastPageNum, oCurrentGridConfiguration) {
    var iCurrentPage = parseInt(iCurrentPageNum.toString()), iLastPage = parseInt(iLastPageNum.toString()), oFirst = document.getElementById(oCurrentGridConfiguration.gridName + "_First"), oLast = document.getElementById(oCurrentGridConfiguration.gridName + "_Last");
    if (iCurrentPage <= 1) {
        MAQ.goFirst(oFirst, oCurrentGridConfiguration.gridName);
    } else if (iCurrentPage >= iLastPage) {
        MAQ.goLast(oLast, oCurrentGridConfiguration.gridName);
    } else {
        // Go to respective page
        oCurrentGridConfiguration.currentPage = iCurrentPageNum - 1;
        if (!oCurrentGridConfiguration.serverGrid.enabled) {
            MAQ.enablePrev(oCurrentGridConfiguration.gridName);
            MAQ.enableNext(oCurrentGridConfiguration.gridName);
        }
        MAQ.setViewRecords(oCurrentGridConfiguration);
    }
};
MAQ.populateGrid = function (oCurrentGridConfiguration) {
    var htmlGridObject = oCurrentGridConfiguration.gridObject, numberOfRows, rowCounter, iRowsRight;
    if (htmlGridObject) {
        numberOfRows = oCurrentGridConfiguration.tblBody.rows.length;
        for (rowCounter = 0; rowCounter < numberOfRows; rowCounter += 1) {
            oCurrentGridConfiguration.tblBody.deleteRow(-1);
        }
        if (oCurrentGridConfiguration.fixedHeaderEnd) {
            for (rowCounter = 0; rowCounter < numberOfRows; rowCounter += 1) {
                oCurrentGridConfiguration.tblBodyRight.deleteRow(-1);
            }
        }
        MAQ.CreateHTMLTableRow(oCurrentGridConfiguration);
    }
};
MAQ.disablePrev = function (sGridName) {
    var previous = document.getElementById(sGridName + "_Prev");
    MAQUtility.addClass(previous, "click-disabled");
    previous.setAttribute("src", "../SiteAssets/MAQCharts_Dev/Images/previous-disabled.png");
};
MAQ.enablePrev = function (sGridName) {
    var previous = document.getElementById(sGridName + "_Prev");
    MAQUtility.removeClass(previous, "click-disabled");
    previous.setAttribute("src", "../SiteAssets/MAQCharts_Dev/Images/previous.svg");
};
MAQ.disableNext = function (sGridName) {
    var next = document.getElementById(sGridName + "_Next");
    MAQUtility.addClass(next, "click-disabled");
    next.setAttribute("src", "../SiteAssets/MAQCharts_Dev/Images/next-disabled.png");
};
MAQ.enableNext = function (sGridName) {
    var next = document.getElementById(sGridName + "_Next");
    MAQUtility.removeClass(next, "click-disabled");
    next.setAttribute("src", "../SiteAssets/MAQCharts_Dev/Images/next.svg");
};
MAQ.goLast = function (oElement, sGridName) {
    var gridObjectPosition, oCurrentGridConfiguration;
    if (!MAQUtility.hasClass(oElement, "click-disabled")) {
        if (MAQ.gridName.length) {
            gridObjectPosition = MAQ.gridName.indexOf(sGridName);
            if (-1 < gridObjectPosition) {
                oCurrentGridConfiguration = MAQ.gridObject[gridObjectPosition];
                oCurrentGridConfiguration.currentPage = oCurrentGridConfiguration.totalPages;
                MAQ.setViewRecords(oCurrentGridConfiguration);
                if (!oCurrentGridConfiguration.serverGrid.enabled) {
                    MAQ.disableNext(oCurrentGridConfiguration.gridName);
                    MAQ.enablePrev(oCurrentGridConfiguration.gridName);
                }
            }
        }
    }
};
MAQ.goFirst = function (oElement, sGridName) {
    var gridObjectPosition, oCurrentGridConfiguration;
    if (!MAQUtility.hasClass(oElement, "click-disabled")) {
        if (MAQ.gridName.length) {
            gridObjectPosition = MAQ.gridName.indexOf(sGridName);
            if (-1 < gridObjectPosition) {
                oCurrentGridConfiguration = MAQ.gridObject[gridObjectPosition];
                oCurrentGridConfiguration.currentPage = 0;
                MAQ.setViewRecords(oCurrentGridConfiguration);
                if (!oCurrentGridConfiguration.serverGrid.enabled) {
                    MAQ.disablePrev(oCurrentGridConfiguration.gridName);
                    MAQ.enableNext(oCurrentGridConfiguration.gridName);
                    MAQ.populateGrid(oCurrentGridConfiguration);
                }
            }
        }
    }
};
MAQ.goPrevious = function (oElement, sGridName) {
    var gridObjectPosition, oCurrentGridConfiguration;
    if (!MAQUtility.hasClass(oElement, "click-disabled")) {
        if (MAQ.gridName.length > 0) {
            gridObjectPosition = MAQ.gridName.indexOf(sGridName);
            if (-1 < gridObjectPosition) {
                oCurrentGridConfiguration = MAQ.gridObject[gridObjectPosition];
                oCurrentGridConfiguration.currentPage = parseInt(oCurrentGridConfiguration.currentPage.toString()) - 1;
                MAQ.setViewRecords(oCurrentGridConfiguration);
                if (!oCurrentGridConfiguration.serverGrid.enabled) {
                    if (!oCurrentGridConfiguration.currentPage) {
                        MAQ.disablePrev(oCurrentGridConfiguration.gridName);
                        MAQ.enableNext(oCurrentGridConfiguration.gridName);
                    }
                    if (parseInt(oCurrentGridConfiguration.currentPage.toString()) > 0) {
                        MAQ.enableNext(oCurrentGridConfiguration.gridName);
                    }
                }
            }
        }
    }
};
MAQ.goNext = function (oElement, sGridName) {
    var gridObjectPosition, oCurrentGridConfiguration;
    if (!MAQUtility.hasClass(oElement, "click-disabled")) {
        if (MAQ.gridName.length > 0) {
            gridObjectPosition = MAQ.gridName.indexOf(sGridName);
            if (-1 < gridObjectPosition) {
                oCurrentGridConfiguration = MAQ.gridObject[gridObjectPosition];
                oCurrentGridConfiguration.currentPage = parseInt(oCurrentGridConfiguration.currentPage.toString()) + 1;
                MAQ.setViewRecords(oCurrentGridConfiguration);
                if (!oCurrentGridConfiguration.serverGrid.enabled) {
                    if (oCurrentGridConfiguration.currentPage > 0) {
                        MAQ.enablePrev(oCurrentGridConfiguration.gridName);
                    }
                    if (oCurrentGridConfiguration.currentPage === oCurrentGridConfiguration.totalPages) {
                        MAQ.disableNext(oCurrentGridConfiguration.gridName);
                        MAQ.enablePrev(oCurrentGridConfiguration.gridName);
                    }
                }
            }
        }
    }
};

// Check if text input is a number and call method to navigate to requested page
function isNumber(event, oElement, sGridName) {
    var iCharCode;
    event = (event) ? event : window.event;
    iCharCode = (event.which) ? event.which : event.keyCode;
    if (iCharCode > 31 && iCharCode !== 13 && (iCharCode < 48 || iCharCode > 57)) {
        return false;
    } else {
        MAQ.goToPage(iCharCode, oElement, sGridName);
    }
    return true;
}

// Navigate to page entered in text box
MAQ.goToPage = function (iCharCode, oElement, sGridName) {
    var iCurrentPage, iGridIndex, iLastPage = 0, oCurrentGridConfig;
    if (oElement && oElement.value) {
        iCurrentPage = parseInt(oElement.value);
        if (iCharCode === 13 && iCurrentPage) {
            if (MAQ.gridObject.length && MAQ.gridObject.length) {
                iGridIndex = MAQ.gridName.indexOf(sGridName + "_Grid");
                if (-1 < iGridIndex) {
                    oCurrentGridConfig = MAQ.gridObject[iGridIndex];
                    iLastPage = oCurrentGridConfig.totalPages + 1;
                    MAQ.getPage(iCurrentPage, iLastPage, oCurrentGridConfig);
                }
            }
        }
    }
};
MAQ.sortDataWithinGroup = function (oGridConfiguration, sFieldName, sSortFlag, sSortType) {
    var iCount = 0, iTotal = oGridConfiguration.groupedRowHeader.groupHeaderName.length, iInnerCount = 0, iInnerTotal = oGridConfiguration.data.length, arrTemp = [], arrSortedMerged = [];
    if (oGridConfiguration) {
        for (iCount = 0; iCount < iTotal; iCount++) {
            arrTemp = [];
            for (iInnerCount = 0; iInnerCount < iInnerTotal; iInnerCount++) {
                if (oGridConfiguration.groupedRowHeader.groupHeaderName[iCount] === oGridConfiguration.data[iInnerCount].groupHeaderName) {
                    arrTemp.push(MAQUtility.clone(oGridConfiguration.data[iInnerCount]));
                }
            }
            arrSortedMerged = arrSortedMerged.concat(MAQUtility.clone(arrTemp.sort(MAQUtility.sortBy(sFieldName, sSortFlag, sSortType))));
        }
        oGridConfiguration.data = MAQUtility.clone(arrSortedMerged);
    }
    return oGridConfiguration;
};
MAQ.sortJsonGrid = function (cellObject, sGridName, fieldName) {
    var gridObjectPosition, sortOrder, sortFlag, oCurrentGridConfiguration, columnCounter, sortType = String, sortKey = "", oSortIndicators, iCount, oArrow;
    if (MAQ.gridName.length > 0) {
        gridObjectPosition = MAQ.gridName.indexOf(sGridName);
        if (-1 < gridObjectPosition) {
            sortOrder = cellObject.getAttribute("sortorder");
            sortKey = cellObject.getAttribute("sortkey");
            sortFlag = false;
            if ("asc" === sortOrder) {
                sortFlag = true;
                cellObject.setAttribute("sortorder", "desc");
            } else {
                cellObject.setAttribute("sortorder", "asc");
            }
            oCurrentGridConfiguration = MAQ.gridObject[gridObjectPosition];
            oCurrentGridConfiguration.gridSort.sortby = fieldName;

            if (oCurrentGridConfiguration.serverGrid.enabled) {
                // Call service in case of service side grid
                var oHiddenContainer = document.getElementById(oCurrentGridConfiguration.container + "_hidden");
                if (oHiddenContainer) {
                    // Update sort order and sort by data values in hidden chunk
                    oHiddenContainer.setAttribute("data-sortOrder", sortOrder);
                    oHiddenContainer.setAttribute("data-sortKey", sortKey);
                    oHiddenContainer.setAttribute("data-sortBy", fieldName);
                    oHiddenContainer.setAttribute("data-currentPage", "0");
                }
                oCurrentGridConfiguration.currentPage = 0;
                MAQ.callService(oCurrentGridConfiguration);
            } else {
                for (columnCounter in oCurrentGridConfiguration.columnHeader) {
                    if (oCurrentGridConfiguration.columnHeader[columnCounter].name === fieldName && oCurrentGridConfiguration.columnHeader[columnCounter].sortType) {
                        if (oCurrentGridConfiguration.columnHeader[columnCounter].sortAttribute) {
                            fieldName = oCurrentGridConfiguration.columnHeader[columnCounter].sortAttribute;
                        }
                        sortType = oCurrentGridConfiguration.columnHeader[columnCounter].sortType;
                    }
                }
                if (oCurrentGridConfiguration.groupedRows && oCurrentGridConfiguration.groupedRowHeader && oCurrentGridConfiguration.groupedRowHeader.groupHeaderName) {
                    oCurrentGridConfiguration = MAQ.sortDataWithinGroup(oCurrentGridConfiguration, fieldName, sortFlag, sortType);
                } else {
                    oCurrentGridConfiguration.data.sort(MAQUtility.sortBy(fieldName, sortFlag, sortType));
                }
                oCurrentGridConfiguration.gridSort.sortby = fieldName;
                oSortIndicators = document.querySelectorAll("#" + sGridName + " .SortIndicator");
                for (iCount = 0; iCount < oSortIndicators.length; iCount++) {
                    MAQUtility.addClass(oSortIndicators[iCount], "itemHide");
                }
                oSortIndicators = document.querySelectorAll("#" + sGridName + "_right .SortIndicator");
                for (iCount = 0; iCount < oSortIndicators.length; iCount++) {
                    MAQUtility.addClass(oSortIndicators[iCount], "itemHide");
                }
                MAQUtility.removeClass(document.querySelector("#" + sGridName + "Head .jsonGridHeaderAlternate"), "jsonGridHeaderAlternate");
                oArrow = cellObject.querySelector("." + fieldName + "Hand");
                if ("asc" === cellObject.getAttribute("sortorder")) {
                    oArrow.innerHTML = '<img src="../SiteAssets/MAQCharts_Dev/Images/Table sort_Down active.svg">';
                    MAQUtility.removeClass(oArrow, "itemHide");
                } else {
                    oArrow.innerHTML = '<img src="../SiteAssets/MAQCharts_Dev/Images/Table sort_Up active.svg">';
                    MAQUtility.removeClass(oArrow, "itemHide");
                }
                MAQUtility.addClass(oArrow.parentNode, "jsonGridHeaderAlternate");
                if (!oCurrentGridConfiguration.pagination.retainPageOnSort && oCurrentGridConfiguration.totalPages) {
                    oCurrentGridConfiguration.currentPage = 0;
                    MAQ.setViewRecords(oCurrentGridConfiguration);
                    MAQ.disablePrev(oCurrentGridConfiguration.gridName);
                    MAQ.enableNext(oCurrentGridConfiguration.gridName);
                } else {
                    MAQ.populateGrid(oCurrentGridConfiguration);
                }
            }
        }
    }
};
MAQ.CreatePaginationControl = function (jsonGridConfiguration) {
    var paginationSpaceRow = jsonGridConfiguration.tblFoot.insertRow(0), row = jsonGridConfiguration.tblFoot.insertRow(1), rightRow, leftGrid, rightGrid, rightSpaceCell, spaceCell = paginationSpaceRow.insertCell(0), cell = row.insertCell(0), oPaginationContainer = document.createElement("div"), oPreviousDiv = document.createElement("div"), oViewRecords = document.createElement("div"), oNextDiv = document.createElement("div"), oLabel = document.createElement("div"), oDropDownContainer = document.createElement("div"), oTotalPagesLabel = document.createElement("div"), oPageList = document.createElement("div"), iIterator, oPage, oListOptionContainerParent = document.createElement("div"), oListOptionContainer, oListOption, oSelectedElement, iDropDownWidth = 0, iCurrentPage = jsonGridConfiguration.currentPage + 1, iLastPage = parseInt(jsonGridConfiguration.totalPages) + 1, iTotalPages = 0;
    oListOptionContainer = (iLastPage > oGridConstants.iDropDownLimit) ? document.createElement("input") : document.createElement("select");
    oTotalPagesLabel.innerText = " of " + insertCommasOnly(iLastPage, 0);
    MAQUtility.addClass(oTotalPagesLabel, "jsonFooterLabel totalPagesLabel");

    if (jsonGridConfiguration.fixedHeaderEnd) {
        if (jsonGridConfiguration.containerObject.clientWidth - jsonGridConfiguration.tblBody.clientWidth >= jsonGridConfiguration.tblBodyRight.clientWidth) {
            rightRow = jsonGridConfiguration.tblFootRight.insertRow(-1);
            rightSpaceCell = rightRow.insertCell(0);
            rightSpaceCell.colSpan = jsonGridConfiguration.columnHeader.length;
            MAQUtility.addClass(rightSpaceCell, "jsonPaginationMargin");
            rightRow = jsonGridConfiguration.tblFootRight.insertRow(-1);
            rightSpaceCell = rightRow.insertCell(0);
            rightSpaceCell.colSpan = jsonGridConfiguration.columnHeader.length;
            MAQUtility.addClass(rightSpaceCell, "jsonFooter");
        } else {
            leftGrid = document.querySelector("#" + jsonGridConfiguration.container + " .LeftGrid");
            rightGrid = document.querySelector("#" + jsonGridConfiguration.container + " .RightGrid");
            rightGrid.style.height = rightGrid.clientHeight + (leftGrid.clientHeight - rightGrid.clientHeight + 29) + "px";
            MAQUtility.addClass(rightGrid, "paginationBorder");
        }
    }

    // Update properties of pagination space
    spaceCell.colSpan = jsonGridConfiguration.columnHeader.length;
    MAQUtility.addClass(spaceCell, "jsonPaginationMargin");

    // Cell containing the pagination content
    cell.colSpan = jsonGridConfiguration.columnHeader.length;
    oLabel.innerText = oGridConstants.sPaginationText;
    MAQUtility.addClass(oLabel, "jsonFooterLabel");
    if (!jsonGridConfiguration.isWin8App) {
        // Disable previous only if current page is 0 i.e., first page
        if (0 === jsonGridConfiguration.currentPage) {
            oPreviousDiv.innerHTML = '<img id="' + jsonGridConfiguration.gridName + '_Prev" class="prev cur-pointer click-disabled" active="1" src = "../SiteAssets/MAQCharts_Dev/Images/previous-disabled.png" onclick="MAQ.goPrevious(this,\'' + jsonGridConfiguration.gridName + '\')" />';
        } else {
            oPreviousDiv.innerHTML = '<img id="' + jsonGridConfiguration.gridName + '_Prev" class="prev cur-pointer" active="1" src = "../SiteAssets/MAQCharts_Dev/Images/previous.svg" onclick="MAQ.goPrevious(this,\'' + jsonGridConfiguration.gridName + '\')" />';
        }
        if (iLastPage - 1 !== jsonGridConfiguration.currentPage) {
            oNextDiv.innerHTML = '<img id="' + jsonGridConfiguration.gridName + '_Next" class="next cur-pointer" active="0" src = "../SiteAssets/MAQCharts_Dev/Images/next.svg" onclick="MAQ.goNext(this,\'' + jsonGridConfiguration.gridName + '\')" />';
        }
    } else {
        MSApp.execUnsafeLocalFunction(function () {
            if (0 === jsonGridConfiguration.currentPage) {
                WinJS.Utilities.setInnerHTML(oPreviousDiv, '<img id="' + jsonGridConfiguration.gridName + '_Prev" class="prev cur-pointer click-disabled" active="1" src = "../SiteAssets/MAQCharts_Dev/Images/previous-disabled.png" width="24" onclick="MAQ.goPrevious(this,\'' + jsonGridConfiguration.gridName + '\')" />');
            } else {
                WinJS.Utilities.setInnerHTML(oPreviousDiv, '<img id="' + jsonGridConfiguration.gridName + '_Prev" class="prev cur-pointer" active="1" src = "../SiteAssets/MAQCharts_Dev/Images/previous.svg" width="24" onclick="MAQ.goPrevious(this,\'' + jsonGridConfiguration.gridName + '\')" />');
            }
            WinJS.Utilities.setInnerHTML(oNextDiv, '<img id="' + jsonGridConfiguration.gridName + '_Next" class="next cur-pointer" active="0" src = "../SiteAssets/MAQCharts_Dev/Images/next.svg" width="24" onclick="MAQ.goNext(this,\'' + jsonGridConfiguration.gridName + '\')" />');
        });
    }
    oPreviousDiv.className = "PaginationPrevArrowDiv";
    oViewRecords.id = jsonGridConfiguration.gridName + "_ViewRecords";
    MAQUtility.addClass(oViewRecords, "ViewRecordDiv");
    oDropDownContainer.id = jsonGridConfiguration.gridName + "_DropDownRecords";
    MAQUtility.addClass(oDropDownContainer, "DropDownRecords");
    if (!jsonGridConfiguration.viewrecords) {
        oViewRecords.style.visibility = "hidden";
    }

    oNextDiv.className = "PaginationNextArrowDiv";
    oPaginationContainer.className = "jsonGridFooter";
    oPaginationContainer.appendChild(oPreviousDiv);
    oPaginationContainer.appendChild(oViewRecords);
    oPaginationContainer.appendChild(oNextDiv);
    oPaginationContainer.appendChild(oLabel);
    oPaginationContainer.appendChild(oDropDownContainer);
    oPaginationContainer.appendChild(oTotalPagesLabel);
    cell.appendChild(oPaginationContainer);
    MAQUtility.addClass(cell, "jsonFooter");

    // Create Page List
    if (oViewRecords) {
        if (!jsonGridConfiguration.isWin8App) {
            oViewRecords.appendChild(oPageList);
        } else {
            MSApp.execUnsafeLocalFunction(function () {
                WinJS.Utilities.setInnerHTML(oViewRecords, oPageList.innerHTML);
            });
        }
        iTotalPages = iLastPage < (iCurrentPage + 4) ? iLastPage : (iCurrentPage + 4);
        MAQ.generatePageList(jsonGridConfiguration, iCurrentPage, iTotalPages);
    }

    // Create drop down
    MAQUtility.addClass(oListOptionContainerParent, "ListOptionContainerParent");
    MAQUtility.addClass(oListOptionContainer, "ListOptionContainer");

    oListOptionContainerParent.appendChild(oListOptionContainer);
    oDropDownContainer.appendChild(oListOptionContainerParent);
    if (iLastPage > oGridConstants.iDropDownLimit) {
        // Create text box
        oListOptionContainer.type = "text";
        oListOptionContainer.value = parseInt(jsonGridConfiguration.currentPage) + 1;
        oListOptionContainer.setAttribute("onkeypress", "isNumber(event,this,'" + jsonGridConfiguration.container + "')");
    } else {
        for (iIterator = 1; iIterator <= iLastPage; iIterator++) {
            oListOption = document.createElement("option");
            oListOption.innerText = iIterator;
            MAQUtility.addClass(oListOption, "ListOption");
            oListOption.setAttribute("data-pageId", iIterator.toString());
            oListOption.setAttribute("onclick", "newRecords(this,'" + jsonGridConfiguration.gridName + "')");
            oListOptionContainer.appendChild(oListOption);
        }
        oSelectedElement = document.querySelector("#" + jsonGridConfiguration.gridName + " .ListOption[data-pageId='" + iCurrentPage + "']");
        MAQUtility.addClass(oSelectedElement, "SelectedPage");
        oSelectedElement.selected = true;
    }
    if (jsonGridConfiguration.pagination.maxRows && jsonGridConfiguration.pagination.maxRows > jsonGridConfiguration.data.length) {
        if (!jsonGridConfiguration.serverGrid.enabled) {
            MAQUtility.addClass(document.querySelector("#" + jsonGridConfiguration.gridName + "_Last"), "click-disabled");
            MAQ.disableNext(jsonGridConfiguration.gridName);
        }
    }
};

MAQ.setDrillDown = function (sCellValue, iCurrentRow, oGridConfiguration, bEndRow) {
    var oDrillCellContainer = document.createElement("div"), oDrillCell = document.createElement("div"), iDrillIterator, iDrillDownCounter = 0, oRow, oDrillObject = [], oRowRight, level;
    MAQUtility.addClass(oDrillCell, "DrillExpandCell");
    MAQUtility.addClass(oDrillCell, "DrillExpandIcon");
    MAQUtility.addClass(oDrillCell, "HandIcon");
    for (iDrillIterator = 0; iDrillIterator < oGridConfiguration.columnHeader.length; iDrillIterator++) {
        if (bEndRow) {
            oDrillObject.push(oGridConfiguration.endRow.data[oGridConfiguration.columnHeader[iDrillIterator].name] || "");
        } else {
            oDrillObject.push(oGridConfiguration.data[iCurrentRow][oGridConfiguration.columnHeader[iDrillIterator].name] || "");
        }
    }
    if (oDrillObject.length) {
        if (oGridConfiguration.drillDown.dataMapping) {
            oDrillCell.setAttribute("data-mapping", oGridConfiguration.data[iCurrentRow][oGridConfiguration.drillDown.dataMapping]);
        } else {
            oDrillCell.setAttribute("data-mapping", oDrillObject);
        }
        if ("undefined" !== oGridConfiguration.inPlaceGrid && oGridConfiguration.inPlaceGrid.level) {
            level = oGridConfiguration.inPlaceGrid.level;
            oDrillCell.setAttribute("data-parent", level + "_Row" + (iCurrentRow + 1));
            oDrillCell.setAttribute("data-parentClass", level);
        }
        oDrillCell.setAttribute("data-currentRow", iCurrentRow + 1);
        oDrillCell.setAttribute("data-productID", oGridConfiguration.data[iCurrentRow]["C" + Object.keys(oGridConfiguration.data[iCurrentRow]).length]);
        oDrillCell.setAttribute("data-firstLoad", 1);
    }
    oDrillCell.setAttribute("data-expanded", "0");
    oDrillCell.setAttribute("onclick", "MAQ.drillDown(this,'" + (oGridConfiguration.drillDown.sDrillDownCall || "") + "','" + oGridConfiguration.container + "','" + oGridConfiguration.sGridName + "')");
    oDrillCellContainer.appendChild(oDrillCell);
    if ("undefined" !== typeof oGridConfiguration.inPlaceGrid) {
        if (oGridConfiguration.inPlaceGrid.enableRowInsert) {
            oRow = oGridConfiguration.tblBody.insertRow(-1);
            if (oGridConfiguration.fixedHeaderEnd) {
                oRowRight = oGridConfiguration.tblBodyRight.insertRow(-1);
            }
            MAQUtility.addClass(oRow, "HiddenSection");
            MAQUtility.addClass(oRowRight, "HiddenSection");
            MAQUtility.addClass(oRow, "InnerRow");
            MAQUtility.addClass(oRowRight, "InnerRow");
            oDrillCell = oRow.insertCell(0);
        }
    }

    if (oGridConfiguration.fixedHeaderEnd) {
        oDrillCell.setAttribute("colspan", oGridConfiguration.fixedHeaderEnd);
        oDrillCell = oRowRight.insertCell(0);
        oDrillCell.setAttribute("colspan", oGridConfiguration.columnHeader.length - oGridConfiguration.fixedHeaderEnd + iDrillDownCounter);
    } else {
        oDrillCell.setAttribute("colspan", oGridConfiguration.columnHeader.length + iDrillDownCounter);
    }
    return oDrillCellContainer.innerHTML + sCellValue;
};
MAQ.CreateHTMLTableRow = function (jsonGridConfiguration) {
    /// <disable>JS3058</disable>
    var startIndex, endIndex, cell = null, cellCounter, drillCounter = 0, numberOfColumns = jsonGridConfiguration.columnHeader.length, oCurrentObject = this, sIsNegativeLevel = "0", iInnerCounter = 0, iEndIndex, iCounter, row, iCount, iTotal, fMaxValue, fCurrent, sFieldName, cellBlank, innerRow, staticRow, iGroupedRowIndex = 0, iTotalGroupedRows = 0, iCurrentRowIndex = 0, bIsGroupedRow = (jsonGridConfiguration.groupedRows && jsonGridConfiguration.groupedRowHeader && jsonGridConfiguration.groupedRowHeader.data), oGroupHeaderRow, sGroupHeaderChunk, oFormatterOptions = {}, iCellCounter, iCellCounterRight, oRowRight, sReturnValue, oStaticHeader, sStaticColumnName, leftGrid, rightGrid, oConfig = {}, sHeaderName = "", iHeaderIndex = 0;
    if (jsonGridConfiguration.serverGrid.enabled) {
        startIndex = 0;
    } else {
        startIndex = jsonGridConfiguration.currentPage * jsonGridConfiguration.pagination.maxRows;
    }
    endIndex = (startIndex + jsonGridConfiguration.pagination.maxRows) <= jsonGridConfiguration.data.length ? (startIndex + jsonGridConfiguration.pagination.maxRows) : jsonGridConfiguration.data.length;
    endIndex = endIndex <= 0 ? jsonGridConfiguration.data.length : endIndex;
    if (jsonGridConfiguration.dataConfiguration.calculateMaximum) {
        MAQ.calculateMinMax(jsonGridConfiguration, startIndex, endIndex);
    }
    oStaticHeader = jsonGridConfiguration.staticHeaderRows;
    sStaticColumnName = oStaticHeader.columnName;
    if (oStaticHeader.enabled) {
        iEndIndex = oStaticHeader.staticHeader.length - 1;
    }
    if (bIsGroupedRow) {
        iTotalGroupedRows = jsonGridConfiguration.groupedRowHeader.data.length;
    }

    if ("undefined" !== jsonGridConfiguration.inPlaceGrid.parentContainer && jsonGridConfiguration.inPlaceGrid.parentContainer) {
        var parentBodyContainer = document.getElementById(jsonGridConfiguration.inPlaceGrid.parentContainer).getElementsByTagName("tbody")[0];
        jsonGridConfiguration.tblBody = parentBodyContainer;
        var appendAfterRowID = (jsonGridConfiguration.gridName.substr(0, jsonGridConfiguration.gridName.lastIndexOf("_")) || ""), insert = document.querySelector("#" + jsonGridConfiguration.inPlaceGrid.parentContainer + " #" + appendAfterRowID), iParentRowID = insert.id, insertRowAt = MAQ.getChildPosition(insert, parentBodyContainer);
    }
    for (this.rowPosition = startIndex; this.rowPosition < endIndex; this.rowPosition += 1) {
        iCellCounter = 0;
        iCellCounterRight = 0;
        iCounter = this.rowPosition;
        if ("undefined" !== jsonGridConfiguration.inPlaceGrid.parentContainer && jsonGridConfiguration.inPlaceGrid.parentContainer) {
            row = insert.parentNode.insertRow(insertRowAt + this.rowPosition + 1);
        } else {
            row = jsonGridConfiguration.tblBody.insertRow(-1);
        }

        if (jsonGridConfiguration.fixedHeaderEnd) {
            oRowRight = jsonGridConfiguration.tblBodyRight.insertRow(-1);
            MAQUtility.addClass(oRowRight, "GridRow");
        }
        iInnerCounter = 0;
        if (oStaticHeader.enabled) {
            iEndIndex = oStaticHeader.staticHeader.length - 1;
        }
        for (iInnerCounter; iInnerCounter <= iEndIndex; iInnerCounter++) {
            if (oStaticHeader.enabled && "0" === oStaticHeader.staticHeader[iInnerCounter][sStaticColumnName]) {
                // Append static header after level 0 is encountered
                if (oStaticHeader.staticHeader[iInnerCounter][sStaticColumnName] === jsonGridConfiguration.data[this.rowPosition][sStaticColumnName]) {
                    staticRow = jsonGridConfiguration.tblBody.insertRow(-1);
                    staticRow.innerHTML = "<td colspan=" + numberOfColumns + " class=" + oStaticHeader.staticHeader[iInnerCounter].className + ">" + oStaticHeader.staticHeader[iInnerCounter].columnText + "</td>";
                    MAQUtility.addClass(staticRow, "GridRow");
                }
            } else if ((iCounter) < (endIndex - 1) && oStaticHeader.enabled && "-1" === oStaticHeader.staticHeader[iInnerCounter][sStaticColumnName]) {
                // Append static header before level -1 is encountered
                if (oStaticHeader.staticHeader[iInnerCounter][sStaticColumnName] === jsonGridConfiguration.data[++iCounter][sStaticColumnName] && "1" !== sIsNegativeLevel) {
                    sIsNegativeLevel = "1";
                    staticRow = jsonGridConfiguration.tblBody.insertRow(-1);
                    staticRow.innerHTML = "<td colspan=" + numberOfColumns + " class=" + oStaticHeader.staticHeader[iInnerCounter].className + ">" + oStaticHeader.staticHeader[iInnerCounter].columnText + "</td>";
                    MAQUtility.addClass(staticRow, "GridRow");
                }
            }
        }
        if (bIsGroupedRow) {
            // Insert group header before first data row
            if ((iCounter === startIndex) || (jsonGridConfiguration.data[iCounter - 1]["groupHeaderName"] !== jsonGridConfiguration.data[iCounter]["groupHeaderName"])) {
                if (iCounter === startIndex) {
                    iGroupedRowIndex = 0;
                    iCurrentRowIndex = 0;
                } else {
                    iCurrentRowIndex = iGroupedRowIndex + iCounter;
                }
                sHeaderName = jsonGridConfiguration.data[iCounter]["groupHeaderName"];
                iHeaderIndex = 0;
                jsonGridConfiguration.groupedRowHeader.data.forEach(function (element) {
                    if (element.name === sHeaderName) {
                        iHeaderIndex = jsonGridConfiguration.groupedRowHeader.data.indexOf(element);
                    }
                });
                oGroupHeaderRow = jsonGridConfiguration.tblBody.insertRow(iCurrentRowIndex);
                oGroupHeaderRow.innerHTML = "<td colspan=" + numberOfColumns + " class='" + jsonGridConfiguration.groupedRowHeader.data[iHeaderIndex].headerClassName + "'>" + jsonGridConfiguration.groupedRowHeader.data[iHeaderIndex].columnText + "</td>";
                MAQUtility.addClass(oGroupHeaderRow, "GroupHeaderRow");
                if (jsonGridConfiguration.groupedRowHeader.data[iHeaderIndex].style) {
                    MAQ.applyStyleToObject(oGroupHeaderRow, jsonGridConfiguration.groupedRowHeader.data[iHeaderIndex].style);
                }
                iGroupedRowIndex++;
            }
        }
        if (!jsonGridConfiguration.rows.alternate) {
            MAQUtility.addClass(row, jsonGridConfiguration.rows.rowClassName || "GridRow");
        } else if (this.rowPosition % 2) {
            MAQUtility.addClass(row, (jsonGridConfiguration.rows.rowClassName || "GridRow") + "_alt");
        } else {
            MAQUtility.addClass(row, jsonGridConfiguration.rows.rowClassName || "GridRow");
        }
        if ("undefined" !== jsonGridConfiguration.inPlaceGrid && jsonGridConfiguration.inPlaceGrid.level) {
            var level = jsonGridConfiguration.inPlaceGrid.level;
            if ("" === jsonGridConfiguration.inPlaceGrid.parentContainer) {
                appendAfterRowID = jsonGridConfiguration.container + "_" + level + "_Row" + (this.rowPosition + 1) + "_";
                row.setAttribute("id", appendAfterRowID);
            } else {
                var sAllParentContainer = level + "_Row" + (this.rowPosition + 1) + iParentRowID;
                row.setAttribute("data-rowParentID", appendAfterRowID);
                row.setAttribute("id", sAllParentContainer);
            }

            MAQUtility.addClass(row, level || "GridRow");
        }
        iCount = 0;
        for (cellCounter = 0; cellCounter < numberOfColumns; cellCounter++) {
            if (jsonGridConfiguration.fixedHeaderEnd && parseInt(jsonGridConfiguration.fixedHeaderEnd) <= cellCounter) {
                cell = oRowRight.insertCell(iCellCounterRight++);
            } else {
                cell = row.insertCell(iCellCounter++);
            }
            cell.setAttribute("class", "jsonGridRow");
            cell.style.textAlign = jsonGridConfiguration.columnHeader[cellCounter].align;

            // To add which report to invoke
            if (jsonGridConfiguration.columnHeader[cellCounter]["data-name"]) {
                cell.setAttribute("data-name", jsonGridConfiguration.columnHeader[cellCounter]["data-name"]);
            }

            // Doing this to avoid overlapping of last column values and the scroll bar
            if (jsonGridConfiguration.columnHeader[cellCounter].noOverlap) {
                if (cellCounter === numberOfColumns - 1) {
                    cell.style.paddingRight = String(20) + "px";
                    MAQUtility.addClass(cell, "noOverlap");
                }
            }

            //// TODO: Update code below to add style.
            if (jsonGridConfiguration.altRowColor && this.rowPosition % 2 !== 0) {
                cell.style.backgroundColor = jsonGridConfiguration.altRowColor;
            }
            if (jsonGridConfiguration.columnHeader[cellCounter].style) {
                MAQ.applyStyleToObject(cell, jsonGridConfiguration.columnHeader[cellCounter].style);
            }
            if (!jsonGridConfiguration.columnHeader[cellCounter].formatter) {
                if (jsonGridConfiguration.columnHeader[cellCounter].trimOnOverflow) {
                    sReturnValue = MAQ.getAdjustedRowChunk((jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name] || oGridConstants.sNA), jsonGridConfiguration.columnHeader[cellCounter].style.width);
                } else {
                    if (jsonGridConfiguration.columnHeader[cellCounter].trimOnOverflowAndShowToolTip) {
                        sReturnValue = MAQ.getAdjustedRowChunkAndToolTip((jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name] || oGridConstants.sNA), jsonGridConfiguration.columnHeader[cellCounter].style.width);
                    } else {
                        sReturnValue = (jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name] || oGridConstants.sNA);
                    }
                }
            } else {
                sReturnValue = "";
                if (window[jsonGridConfiguration.columnHeader[cellCounter].formatter] || jsonGridConfiguration.columnHeader[cellCounter].formatter === "trimOnOverflowAndShowToolTip") {
                    switch (jsonGridConfiguration.columnHeader[cellCounter].formatter) {
                        case "parseCustomBarChart":
                            iCount = 0, iTotal = 0, fMaxValue = 1, fCurrent = 0, sFieldName = jsonGridConfiguration.columnHeader[cellCounter].name;
                            if (jsonGridConfiguration.data.length) {
                                iTotal = jsonGridConfiguration.data.length;
                                for (iCount = 0; iCount < iTotal; iCount++) {
                                    fCurrent = parseFloat(jsonGridConfiguration.data[iCount][sFieldName]);
                                    if (!bIsGroupedRow || jsonGridConfiguration.data[this.rowPosition].groupHeaderName === jsonGridConfiguration.data[iCount].groupHeaderName) {
                                        if (!isNaN(fCurrent)) {
                                            if (fMaxValue < fCurrent) {
                                                fMaxValue = fCurrent;
                                            }
                                        }
                                    }
                                }
                            }
                            oFormatterOptions = {
                                maxValue: fMaxValue,
                                field: sFieldName,
                                numberFormatter: jsonGridConfiguration.columnHeader[cellCounter].chartValueFormatter,
                                fCell: (cell.style.width || oGridConstants.sDefaultWidth)
                            };

                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], oFormatterOptions);
                            break;
                        case "parseDealValue":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name]);
                            break;
                        case "parsePastDueDeals":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.dataConfiguration.maxConfig);
                            break;
                        case "parseOpportunitiesTrack":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.dataConfiguration.maxConfig, cell.style.width || "");
                            break;
                        case "parseOpportunitiesMissing":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.dataConfiguration.maxConfig, cell.style.width || "");
                            break;
                        case "parseQuotaCoverage":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.dataConfiguration.maxConfig);
                            break;
                        case "calculatePercentByTotal":
                            oFormatterOptions = {
                                maxConfig: jsonGridConfiguration.dataConfiguration.maxConfig,
                                field: jsonGridConfiguration.endRow.data,
                                fCell: cell.style.width || "",
                                cellCounter: this.rowPosition,
                                barColor: jsonGridConfiguration.columnHeader[2].barColors[this.rowPosition],
                                barColors: jsonGridConfiguration.columnHeader[2].barColors,
                                dataSeries: jsonGridConfiguration.data
                            };
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.gridName, jsonGridConfiguration.columnHeader[cellCounter].name, oFormatterOptions);

                            break;
                        case "trimOnOverflowAndShowToolTip":
                            sReturnValue = MAQ.getAdjustedRowChunkAndToolTip((jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name] || oGridConstants.sNA), jsonGridConfiguration.columnHeader[cellCounter].style.width);
                            break;
                        case "customPipelineBar":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.data, jsonGridConfiguration.endRow.data);
                            break;

                        default:
                            oFormatterOptions = {
                                maxConfig: jsonGridConfiguration.dataConfiguration.maxConfig,
                                field: jsonGridConfiguration.endRow.data,
                                fCell: cell.style.width || "",
                                cellCounter: this.rowPosition,
                                headerProperties: jsonGridConfiguration.columnHeader[cellCounter],
                                dataSeries: jsonGridConfiguration.data,
                                oInPlaceGridData: jsonGridConfiguration.inPlaceGrid,
                                customSecondaryFormatter: jsonGridConfiguration.dataConfiguration.customSecondaryFormatter,
                                stackedBarConfig: jsonGridConfiguration.dataConfiguration.stackedBar
                            };
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.data[this.rowPosition][jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.data[this.rowPosition], jsonGridConfiguration.gridName, jsonGridConfiguration.columnHeader[cellCounter].name, oFormatterOptions);
                            break;
                    }
                }
            }

            // Format cell for drill down
            if (jsonGridConfiguration.drillDown.enabled && jsonGridConfiguration.drillDown.columnId === cellCounter) {
                sReturnValue = MAQ.setDrillDown(sReturnValue, this.rowPosition, jsonGridConfiguration, false);
                MAQUtility.addClass(cell, "DrillDownCell");
            }

            // Format cell for drill down end
            if (!jsonGridConfiguration.isWin8App) {
                cell.innerHTML = sReturnValue;
            } else {
                MSApp.execUnsafeLocalFunction(function () {
                    WinJS.Utilities.setInnerHTML(cell, sReturnValue);
                });
            }
        }
    }
    if (!jsonGridConfiguration.serverGrid.enabled && jsonGridConfiguration.fixedHeaderEnd && parseInt(jsonGridConfiguration.fixedHeaderEnd) <= cellCounter && jsonGridConfiguration.pagination.paginate && jsonGridConfiguration.totalPages && (endIndex - startIndex < jsonGridConfiguration.pagination.maxRows || 1 === jsonGridConfiguration.pagination.iLast)) {
        leftGrid = document.querySelector("#" + jsonGridConfiguration.container + " .LeftGrid");
        rightGrid = document.querySelector("#" + jsonGridConfiguration.container + " .RightGrid");
        rightGrid.style.height = (leftGrid.clientHeight - 38) + "px";
        jsonGridConfiguration.pagination.iLast *= -1;
    }
    if (jsonGridConfiguration.endRow.enableEndRow) {
        // Use only data array
        iCellCounter = 0;
        iCellCounterRight = 0;
        jsonGridConfiguration.endRow.endRowPosition = parseInt(jsonGridConfiguration.endRow.endRowPosition);
        if (!isNaN(jsonGridConfiguration.endRow.endRowPosition) && jsonGridConfiguration.endRow.endRowPosition >= -1 && jsonGridConfiguration.endRow.endRowPosition < jsonGridConfiguration.data.length) {
            if (jsonGridConfiguration.drillDown.enabled) {
                if ("undefined" !== typeof jsonGridConfiguration.inPlaceGrid && "levelOne" !== jsonGridConfiguration.inPlaceGrid.level) {
                    jsonGridConfiguration.endRow.endRowPosition = 2 * jsonGridConfiguration.endRow.endRowPosition;
                }
            }
            row = jsonGridConfiguration.tblBody.insertRow(jsonGridConfiguration.endRow.endRowPosition);
            if (jsonGridConfiguration.fixedHeaderEnd) {
                oRowRight = jsonGridConfiguration.tblBodyRight.insertRow(jsonGridConfiguration.endRow.endRowPosition);
                MAQUtility.addClass(oRowRight, jsonGridConfiguration.endRow.className);
            }

            MAQUtility.addClass(row, jsonGridConfiguration.endRow.className);
            for (cellCounter = 0; cellCounter < numberOfColumns; cellCounter++) {
                if (jsonGridConfiguration.fixedHeaderEnd && parseInt(jsonGridConfiguration.fixedHeaderEnd) <= cellCounter) {
                    cell = oRowRight.insertCell(iCellCounterRight++);
                } else {
                    cell = row.insertCell(iCellCounter++);
                }

                // Doing this to avoid overlapping of last column values and the scroll bar
                if (jsonGridConfiguration.columnHeader[cellCounter].noOverlap) {
                    if (cellCounter === numberOfColumns - 1) {
                        cell.style.paddingRight = String(20) + "px";
                        MAQUtility.addClass(cell, "noOverlap");
                    }
                }
                if (jsonGridConfiguration.columnHeader[cellCounter].style) {
                    MAQ.applyStyleToObject(cell, jsonGridConfiguration.columnHeader[cellCounter].style);
                }
                MAQUtility.addClass(cell, "jsonGridRow");
                MAQUtility.addClass(cell, "GridEndRow");
                cell.style.textAlign = jsonGridConfiguration.columnHeader[cellCounter].align;
                if (jsonGridConfiguration.endRow.includeFormatters && jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]) {
                    switch (jsonGridConfiguration.columnHeader[cellCounter].formatter) {
                        case "parseDealValue":
                            sReturnValue = window[jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]](jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.endRow.data, jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name]);
                            break;
                        case "parsePastDueDeals":
                            sReturnValue = window[jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]](jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.endRow.data, jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name]);
                            break;
                        case "parseOpportunitiesTrack":
                            sReturnValue = window[jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]](jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.endRow.data, jsonGridConfiguration.dataConfiguration.maxConfig, cell.style.width || oGridConstants.sDefaultWidth);
                            break;
                        case "parseOpportunitiesMissing":
                            sReturnValue = window[jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]](jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.endRow.data, jsonGridConfiguration.dataConfiguration.maxConfig, cell.style.width || oGridConstants.sDefaultWidth);
                            break;
                        case "parseQuotaCoverage":
                            sReturnValue = window[jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]](jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.endRow.data, jsonGridConfiguration.dataConfiguration.maxConfig);
                            break;
                        case "customPipelineBar":
                            sReturnValue = window[jsonGridConfiguration.columnHeader[cellCounter].formatter](jsonGridConfiguration.endRow.data, jsonGridConfiguration.data, jsonGridConfiguration.endRow.data);
                            break;
                        default:
                            sReturnValue = window[jsonGridConfiguration.endRow.includeFormatters[jsonGridConfiguration.columnHeader[cellCounter].name]](jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name], jsonGridConfiguration.endRow.data, jsonGridConfiguration.gridName, jsonGridConfiguration.columnHeader[cellCounter].name);
                            break;
                    }
                } else {
                    sReturnValue = (jsonGridConfiguration.endRow.data[jsonGridConfiguration.columnHeader[cellCounter].name] || oGridConstants.sNA);
                }

                if (jsonGridConfiguration.drillDown.enabled && jsonGridConfiguration.drillDown.enableForEndRow && jsonGridConfiguration.drillDown.columnId === cellCounter) {
                    sReturnValue = MAQ.setDrillDown(sReturnValue, 0, jsonGridConfiguration, true);
                    MAQUtility.addClass(cell, "DrillDownCell");
                }

                if (!jsonGridConfiguration.isWin8App) {
                    cell.innerHTML = sReturnValue;
                } else {
                    MSApp.execUnsafeLocalFunction(function () {
                        WinJS.Utilities.setInnerHTML(cell, sReturnValue);
                    });
                }
            }
            if (jsonGridConfiguration) {
                // Add 15px split row above total row
                if ("undefined" !== typeof jsonGridConfiguration.endRow.isSplitRowEnabled && jsonGridConfiguration.endRow.isSplitRowEnabled && window[jsonGridConfiguration.endRow.splitRowFormatter]) {
                    window[jsonGridConfiguration.endRow.splitRowFormatter](jsonGridConfiguration.container, jsonGridConfiguration.data.length);
                }
            }
        }
    }
};

MAQ.CreateHTMLTableWithHeader = function (jsonGridConfiguration) {
    var tHead = jsonGridConfiguration.tblHead, row = "", cell = null, iLoopCounter, drillCounter = 0, iParentCounter = 0, numberOfHeaderColumns = jsonGridConfiguration.columnHeader.length, iParentHeaderCount = jsonGridConfiguration.headerTemplate.length, oRowRight, oHeaderRight, iGroupEnd, arrCurrentGroup = [], iCellCounter = 0, iCellCounterRight = 0;
    row = tHead.insertRow(-1);
    if (jsonGridConfiguration.fixedHeaderEnd) {
        oHeaderRight = jsonGridConfiguration.tblHeadRight;
        oRowRight = oHeaderRight.insertRow(-1);
    }
    for (iParentCounter = 0; iParentCounter < iParentHeaderCount; iParentCounter++) {
        if (jsonGridConfiguration.headerTemplate[iParentCounter] && jsonGridConfiguration.headerTemplate[iParentCounter].dataID) {
            arrCurrentGroup = jsonGridConfiguration.headerTemplate[iParentCounter].dataID.split(",");
            iGroupEnd = arrCurrentGroup[arrCurrentGroup.length - 1];
            if (jsonGridConfiguration.fixedHeaderEnd && parseInt(jsonGridConfiguration.fixedHeaderEnd) < parseInt(iGroupEnd)) {
                cell = oRowRight.insertCell(iCellCounterRight++);
            } else {
                cell = row.insertCell(iCellCounter++);
            }
        }
        cell.setAttribute("colspan", jsonGridConfiguration.headerTemplate[iParentCounter].colspan || 1);
        cell.innerHTML = jsonGridConfiguration.headerTemplate[iParentCounter].columnText || "";
        cell.setAttribute("dataID", jsonGridConfiguration.headerTemplate[iParentCounter].dataID || "parent");
        cell.setAttribute("onclick", jsonGridConfiguration.headerTemplate[iParentCounter].onclick || "");
        MAQUtility.addClass(cell, "jsonGridParentHeader");
        if (jsonGridConfiguration.headerTemplate[iParentCounter].headerClassName) {
            MAQUtility.addClass(cell, jsonGridConfiguration.headerTemplate[iParentCounter].headerClassName);
        }
        MAQ.applyStyleToObject(cell, jsonGridConfiguration.headerTemplate[iParentCounter].style || {});
    }

    if (iParentHeaderCount) {
        row = tHead.insertRow(-1);
        if (jsonGridConfiguration.fixedHeaderEnd) {
            oRowRight = oHeaderRight.insertRow(-1);
        }
    }
    iCellCounter = 0;
    iCellCounterRight = 0;
    for (iLoopCounter = 0; iLoopCounter < (numberOfHeaderColumns) ; iLoopCounter += 1) {
        if (jsonGridConfiguration.fixedHeaderEnd && parseInt(jsonGridConfiguration.fixedHeaderEnd) <= iLoopCounter) {
            cell = oRowRight.insertCell(iCellCounterRight++);
        } else {
            cell = row.insertCell(iCellCounter++);
        }
        cell.setAttribute("id", jsonGridConfiguration.columnHeader[iLoopCounter].id || "jsonGridHeader_" + iLoopCounter);
        MAQUtility.addClass(cell, jsonGridConfiguration.columnHeader[iLoopCounter].headerClassName);
        MAQUtility.addClass(cell, "jsonGridHeader");
        if (jsonGridConfiguration.columnHeader[iLoopCounter].style) {
            if (iLoopCounter === numberOfHeaderColumns - 1) {
                cell.style.width = (jsonGridConfiguration.scrolling.enabled) ? (jsonGridConfiguration.tblBody.rows[0].cells[iLoopCounter].clientWidth - 8) + "px" : jsonGridConfiguration.columnHeader[iLoopCounter].style.width;
            } else {
                cell.style.width = (jsonGridConfiguration.scrolling.enabled) ? (jsonGridConfiguration.tblBody.rows[0].cells[iLoopCounter].clientWidth - 30) + "px" : jsonGridConfiguration.columnHeader[iLoopCounter].style.width;
            }
            cell.style.textAlign = jsonGridConfiguration.columnHeader[iLoopCounter].style.textAlign;
        }
        if (iLoopCounter + 1 === numberOfHeaderColumns) {
            cell.style.paddingRight = 10 + "px";
        }

        // Add sorting functionality
        if (jsonGridConfiguration.columnHeader[iLoopCounter].sortable) {
            cell.setAttribute("onclick", 'MAQ.sortJsonGrid(this,"' + jsonGridConfiguration.container + '_Grid","' + jsonGridConfiguration.columnHeader[iLoopCounter].name + '")');
            cell.style.cursor = "pointer";
            if (jsonGridConfiguration.columnHeader[iLoopCounter].name === jsonGridConfiguration.gridSort.sortby) {
                if (jsonGridConfiguration.gridSort.sortorder === "asc") {
                    cell.setAttribute("sortorder", "desc");
                } else {
                    cell.setAttribute("sortorder", "asc");
                }
                if (jsonGridConfiguration.hiddenContainer) {
                    jsonGridConfiguration.hiddenContainer.setAttribute("data-sortKey", jsonGridConfiguration.columnHeader[iLoopCounter].sortKey);
                }
            } else {
                cell.setAttribute("sortorder", jsonGridConfiguration.gridSort.sortorder);
            }
            cell.setAttribute("sortKey", jsonGridConfiguration.columnHeader[iLoopCounter].sortKey);
        } else {
            cell.style.cursor = "default";
        }
        if (!jsonGridConfiguration.gridSort.sortby && jsonGridConfiguration.columnHeader[iLoopCounter].sortable) {
            jsonGridConfiguration.gridSort.sortby = jsonGridConfiguration.columnHeader[iLoopCounter].name;
        }
        if (jsonGridConfiguration.columnHeader[iLoopCounter].name === jsonGridConfiguration.gridSort.sortby && jsonGridConfiguration.columnHeader[iLoopCounter].sortable) {
            MAQUtility.addClass(cell, "jsonGridHeaderAlternate");
            MAQUtility.addClass(document.querySelectorAll("#" + jsonGridConfiguration.container + " .SortIndicator"), "itemHide");
            cell.innerHTML = "<span class='ColumnText'>" + jsonGridConfiguration.columnHeader[iLoopCounter].columnText + "</span>";
            if (jsonGridConfiguration.gridSort.sortorder === "asc") {
                cell.innerHTML += "<span class='SortIndicator " + jsonGridConfiguration.columnHeader[iLoopCounter].name + "Hand'>" + '<img src="../SiteAssets/MAQCharts_Dev/Images/Table sort_Up active.svg">' + "</span>";
            } else {
                cell.innerHTML += "<span class='SortIndicator " + jsonGridConfiguration.columnHeader[iLoopCounter].name + "Hand'>" + '<img src="../SiteAssets/MAQCharts_Dev/Images/Table sort_Down active.svg">' + "</span>";
            }
        } else if (jsonGridConfiguration.columnHeader[iLoopCounter].sortable) {
            cell.innerHTML = "<span class='ColumnText'>" + jsonGridConfiguration.columnHeader[iLoopCounter].columnText + "</span>";
            if (jsonGridConfiguration.columnHeader[iLoopCounter].sortable) {
                cell.innerHTML += "<span class='itemHide SortIndicator " + jsonGridConfiguration.columnHeader[iLoopCounter].name + "Hand'>" + '<img src="../SiteAssets/MAQCharts_Dev/Images/Table sort_Up active.svg">' + "</span>";
            }
        } else {
            cell.innerHTML = "<span class='ColumnText'>" + jsonGridConfiguration.columnHeader[iLoopCounter].columnText + "</span>";
        }
    }
};
MAQ.applyStyleToObject = function (oGridObject, oStyleObject) {
    var oStyles, iCounter;
    if (typeof oStyleObject === "undefined") {
        return;
    }
    oStyles = Object.keys(oStyleObject), iCounter = 0;
    for (iCounter; iCounter < oStyles.length; iCounter += 1) {
        try {
            oGridObject.style[oStyles[iCounter]] = oStyleObject[oStyles[iCounter]];
        } catch (e) {
        }
    }
};

MAQ.CreateHTMLTable = function (jsonGridConfiguration) {
    var gridContainer, grid, oRightGrid, oContainerDiv;
    if (jsonGridConfiguration.fixedHeaderEnd) {
        gridContainer = document.createElement("div");
        gridContainer.setAttribute("id", jsonGridConfiguration.gridName + "_HeaderParent");
    }
    grid = document.createElement("table");
    grid.setAttribute("id", jsonGridConfiguration.gridName);
    if ("string" === typeof (jsonGridConfiguration.container)) {
        grid.setAttribute("class", "jsonGrid");
    } else {
        grid.setAttribute("class", "InnerJsonGrid");
    }
    if (JSON.stringify(jsonGridConfiguration.style) !== "{}") {
        MAQ.applyStyleToObject(grid, jsonGridConfiguration.style);
    }
    if (jsonGridConfiguration.fixedHeaderEnd) {
        oContainerDiv = document.createElement("div");
        MAQUtility.addClass(oContainerDiv, "LeftGrid");
        oContainerDiv.appendChild(grid);
        gridContainer.appendChild(oContainerDiv);
        jsonGridConfiguration.containerObject.appendChild(gridContainer);
        if (jsonGridConfiguration.columnHeader.length === parseInt(jsonGridConfiguration.fixedHeaderEnd)) {
            oContainerDiv.style.width = "100%";
        }
        oRightGrid = document.createElement("table");
        oRightGrid.setAttribute("id", jsonGridConfiguration.gridName + "_right");
        MAQUtility.addClass(oRightGrid, "jsonGrid");
        MAQ.applyStyleToObject(oRightGrid, jsonGridConfiguration.style);
        oContainerDiv = document.createElement("div");
        MAQUtility.addClass(oContainerDiv, "RightGrid");
        oContainerDiv.appendChild(oRightGrid);
        gridContainer.appendChild(oContainerDiv);
    } else {
        jsonGridConfiguration.containerObject.appendChild(grid);
    }
    return (jsonGridConfiguration.fixedHeaderEnd) ? gridContainer : grid;
};

MAQ.CreateLegends = function (oGridConfiguration) {
    var sGridContainer, oLegendContainer = document.createElement("div"), oLegendSectionCover = document.createElement("div"), oLegendTitleSection = document.createElement("div"), oLegendTitleLabel = document.createElement("div"), oLegendSection = document.createElement("div"), oLegendSpace, oLegendLabel, oLegendIndicator, oLegendDivision, iIterator = 0, oData;
    MAQUtility.addClass(oLegendContainer, "LegendContainer");
    MAQUtility.addClass(oLegendSection, "LegendSection");
    if (oGridConfiguration.legends && oGridConfiguration.legends.legendTemplate) {
        MAQ.applyStyleToObject(oLegendContainer, oGridConfiguration.legends.containerStyle);
        oData = oGridConfiguration.legends.legendTemplate;
        for (iIterator = 0; iIterator < oData.length; iIterator++) {
            oLegendLabel = document.createElement("div");
            oLegendLabel.innerText = oData[iIterator].label;
            oLegendIndicator = document.createElement("div");
            oLegendDivision = document.createElement("div");
            oLegendIndicator.appendChild(oLegendDivision);
            MAQ.applyStyleToObject(oLegendDivision, oData[iIterator].indicatorStyle);
            MAQ.applyStyleToObject(oLegendLabel, oData[iIterator].labelStyle);
            if (!oGridConfiguration.legends.labelFirst) {
                oLegendSection.appendChild(oLegendIndicator);
                oLegendSection.appendChild(oLegendLabel);
            } else {
                oLegendSection.appendChild(oLegendLabel);
                oLegendSection.appendChild(oLegendIndicator);
            }
            oLegendSpace = document.createElement("div");
            oLegendSection.appendChild(oLegendSpace);
            MAQUtility.addClass(oLegendLabel, "LegendLabel");
            MAQUtility.addClass(oLegendSpace, "LegendSpace");
            MAQUtility.addClass(oLegendIndicator, "LegendIndicator");
            MAQ.applyStyleToObject(oLegendSpace, oGridConfiguration.legends.separationStyle);
        }
        oLegendTitleLabel.innerText = oGridConfiguration.legends.legendTitle || "";
        MAQ.applyStyleToObject(oLegendTitleLabel, oGridConfiguration.legends.titleStyle);
        oLegendTitleSection.appendChild(oLegendTitleLabel);
        oGridConfiguration.containerObject.appendChild(oLegendTitleSection);
        oLegendSectionCover.appendChild(oLegendSection);
        oLegendContainer.appendChild(oLegendSectionCover);
    }
    oGridConfiguration.containerObject.appendChild(oLegendContainer);
};
MAQ.JsonGrid = function (gridConfigurationOptions) {
    var oAttribute, tBody, checkKeys, bodyContainer, innerTable, indexPositionOfCurrentGrid, iIterator, iColumnIterator, iCount, iTotal, oTableBody, iColumnHeaderLength, iDataLength, iMargin, oAttributeObject, nCurrentValue, nCurrentColumn;
    if (typeof (gridConfigurationOptions.container) === "string") {
        this.containerObject = document.getElementById(gridConfigurationOptions.container);

        // Append data if grid already exists
        if (document.getElementById(gridConfigurationOptions.container + "_Grid")) {
            MAQ.appendDataToGrid(gridConfigurationOptions);
            return true;
        }
    } else {
        this.containerObject = gridConfigurationOptions.container;
    }
    if (gridConfigurationOptions.data.length <= 0) {
        return false;
    }
    if (this.containerObject) {
        this.gridOptions = {
            container: "",
            gridName: "",
            data: [],
            headerTemplate: [],
            columnHeader: [],
            style: {},
            altRowColor: "",
            gridSort: {
                sortby: "",
                sortorder: "asc",
                sortType: ""
            },
            serverGrid: {
                enabled: false,
                totalPages: 2,
                currentIndex: 1,
                sendRequestFunction: null
            },
            inPlaceGrid: {
                enableInPlaceGrid: false,
                disableHeader: false,
                parentContainer: "",
                level: "",
                enableRowInsert: false
            },
            viewrecords: true,
            pagination: {
                maxRows: 0,
                retainPageOnSort: true,
                iLast: -1,
                paginate: false
            },
            scrolling: {
                enabled: false,
                scrollStyle: {}
            },
            cellSpacing: 0,
            cellPadding: 0,
            rows: {
                alternate: true,
                rowClassName: ""
            },
            endRow: {
                enableEndRow: false,
                isTotalRow: false,
                includeFormatters: {},
                columnsExcluded: [],
                data: [],
                endRowPosition: -1,
                className: "",
                isSplitRowEnabled: false,
                splitRowFormatter: ""
            },
            drillDown: {
                enabled: false,
                enableForEndRow: false,
                currentLevel: 0,
                columnId: 0,
                dataMappings: [],
                sDrillDownCall: "",
                dataMapping: "",
                accordion: false
            },
            drilldownConfig: null,
            isWin8App: false,
            legends: {
                enableLegends: false,
                labelFirst: false,
                separationStyle: {},
                containerStyle: {},
                legendTemplate: []
            },
            groupedRows: false,
            groupedRowHeader: {
                groupHeaderName: [],
                data: []
            },
            fixedHeaderEnd: null,
            dataConfiguration: {
                calculateMaximum: false,
                columnsIncluded: [],
                maxConfig: {},
                includeEndRow: false,
                useAbsolutes: [],
                stackedBar: {
                    enabled: false,
                    stackedColumns: [],
                    color: [],
                    colorMapping: {
                        hasMultiColoredBars: false,
                        mappingColumn: "",
                        colorMap: []
                    },
                    hasRelativeRows: true,
                    relateByColumn: "",
                    displayRelateByColumn: false,
                    className: ""
                },
                customSecondaryFormatter: ""
            },
            staticHeaderRows: {
                enabled: false,
                columnName: "",
                staticHeader: []
            }
        };
        for (oAttribute in gridConfigurationOptions) {
            // Merge and clone for first level attributes
            if ("object" === typeof gridConfigurationOptions[oAttribute] && !(gridConfigurationOptions[oAttribute] instanceof Array)) {
                for (oAttributeObject in gridConfigurationOptions[oAttribute]) {
                    this.gridOptions[oAttribute][oAttributeObject] = MAQUtility.clone(gridConfigurationOptions[oAttribute][oAttributeObject]);
                }
            } else {
                this.gridOptions[oAttribute] = MAQUtility.clone(gridConfigurationOptions[oAttribute]);
            }
        }
        if (this.gridOptions.fixedHeaderEnd) {
            this.gridOptions.scrolling.enabled = false;
        }
        if (this.gridOptions.scrolling.enabled) {
            this.gridOptions.pagination.paginate = false;
        }
        if (!this.gridOptions.pagination.paginate) {
            this.gridOptions.pagination.maxRows = this.gridOptions.data.length;
        }
        this.gridOptions.containerObject = this.containerObject;
        if (this.gridOptions.legends.enableLegends) {
            new MAQ.CreateLegends(this.gridOptions);
        }
        this.gridOptions.currentPage = 0;
        if (this.gridOptions.pagination.maxRows > 0) {
            if (this.gridOptions.serverGrid.enabled) {
                this.gridOptions.totalPages = this.gridOptions.serverGrid.totalPages - 1;
            } else {
                this.gridOptions.totalPages = Math.ceil(this.gridOptions.data.length / this.gridOptions.pagination.maxRows) - 1;
            }
        } else {
            this.gridOptions.totalPages = 0;
        }

        // Disable drill down if invalid column Id is passed
        if (this.gridOptions.drillDown.enabled) {
            this.gridOptions.drillDown.columnId = parseInt(this.gridOptions.drillDown.columnId);
            if (!(!isNaN(this.gridOptions.drillDown.columnId) && this.gridOptions.drillDown.columnId >= -1 && this.gridOptions.drillDown.columnId <= this.gridOptions.columnHeader.length)) {
                this.gridOptions.drillDown.enabled = false;
            }
        }

        this.gridOptions.gridName = this.gridOptions.container + "_Grid";

        for (this.LoopCounter = 0; this.LoopCounter < this.gridOptions.columnHeader.length; this.LoopCounter += 1) {
            if (!(this.gridOptions.data[0].hasOwnProperty([this.gridOptions.columnHeader[this.LoopCounter].name].toString()) || "DUMMY" === this.gridOptions.columnHeader[this.LoopCounter].name)) {
                return false;
            }

            // Add color configuration for custom bar chart column
            if (this.gridOptions.columnHeader[this.LoopCounter].formatter && this.gridOptions.columnHeader[this.LoopCounter].formatter === "parseCustomBarChart") {
                iTotal = this.gridOptions.data.length;
                if (this.gridOptions.columnHeader[this.LoopCounter].chartColor && iTotal === this.gridOptions.columnHeader[this.LoopCounter].chartColor.length) {
                    for (iCount = 0; iCount < iTotal; iCount++) {
                        if (!this.gridOptions.data[iCount].colorStyle || !this.gridOptions.data[iCount].colorStyle.columnName || !this.gridOptions.data[iCount].colorStyle.color) {
                            this.gridOptions.data[iCount].colorStyle = {
                                columnName: [],
                                color: []
                            };
                        }
                        this.gridOptions.data[iCount].colorStyle.columnName.push(this.gridOptions.columnHeader[this.LoopCounter].name);
                        this.gridOptions.data[iCount].colorStyle.color.push(this.gridOptions.columnHeader[this.LoopCounter].chartColor[iCount]);
                    }
                }
            }
        }

        // Create Hidden grid to store parameters for server side grid.
        // Fork for client/server type grid.
        if (this.gridOptions.serverGrid.enabled) {
            MAQ.createHiddenChunk(this.gridOptions);

            // Add scroll handler if grid supports scrolling and Server Side is enabled.
            if (this.gridOptions.scrolling.enabled) {
                this.gridOptions.containerObject.addEventListener("scroll", function (oEvent) {
                    MAQ.handleGridScroll(oEvent.currentTarget);
                }, false);
            }
        } else {
            if (this.gridOptions.gridSort.sortby) {
                if (!this.gridOptions.groupedRows) {
                    if (this.gridOptions.gridSort.sortorder.toLowerCase() === "asc") {
                        this.gridOptions.data.sort(MAQUtility.sortBy(this.gridOptions.gridSort.sortby, true, this.gridOptions.gridSort.sortType));
                    }
                    if (this.gridOptions.gridSort.sortorder.toLowerCase() === "desc") {
                        this.gridOptions.data.sort(MAQUtility.sortBy(this.gridOptions.gridSort.sortby, false, this.gridOptions.gridSort.sortType));
                    }
                } else {
                    if (this.gridOptions.groupedRowHeader && this.gridOptions.groupedRowHeader.groupHeaderName) {
                        // Sort groups separately and then combine the data
                        if (this.gridOptions.gridSort.sortorder.toLowerCase() === "asc") {
                            this.gridOptions = MAQ.sortDataWithinGroup(this.gridOptions, this.gridOptions.gridSort.sortby, true, this.gridOptions.gridSort.sortType);
                        } else {
                            this.gridOptions = MAQ.sortDataWithinGroup(this.gridOptions, this.gridOptions.gridSort.sortby, false, this.gridOptions.gridSort.sortType);
                        }
                    }
                }
            }
        }

        iColumnHeaderLength = this.gridOptions.columnHeader.length;
        iDataLength = this.gridOptions.data.length;
        if (this.gridOptions.endRow.isTotalRow) {
            for (iColumnIterator = 0; iColumnIterator < iColumnHeaderLength; iColumnIterator++) {
                for (iIterator = 0; iIterator < iDataLength; iIterator++) {
                    if (this.gridOptions.endRow.columnsExcluded && this.gridOptions.endRow.columnsExcluded.indexOf(this.gridOptions.columnHeader[iColumnIterator].name) < 0) {
                        if ("undefined" === typeof this.gridOptions.endRow.data[this.gridOptions.columnHeader[iColumnIterator].name]) {
                            this.gridOptions.endRow.data[this.gridOptions.columnHeader[iColumnIterator].name] = 0;
                        } else if (isNaN(this.gridOptions.endRow.data[this.gridOptions.columnHeader[iColumnIterator].name])) {
                            this.gridOptions.endRow.data[this.gridOptions.columnHeader[iColumnIterator].name] = oGridConstants.sNA;
                            break;
                        }
                        nCurrentValue = parseFloat(this.gridOptions.data[iIterator][this.gridOptions.columnHeader[iColumnIterator].name]);
                        if (isNaN(nCurrentValue)) {
                            nCurrentValue = 0;
                        }
                        this.gridOptions.endRow.data[this.gridOptions.columnHeader[iColumnIterator].name] += nCurrentValue;
                    }
                }
            }
            nCurrentValue = 0;
        }
        if (this.gridOptions.dataConfiguration.calculateMaximum) {
            MAQ.calculateMinMax(this.gridOptions, 0, iDataLength);
        }
        if ("undefined" !== this.gridOptions.inPlaceGrid && !this.gridOptions.inPlaceGrid.enableInPlaceGrid) {
            this.gridObject = MAQ.CreateHTMLTable(this.gridOptions);
            if (this.gridOptions.fixedHeaderEnd) {
                this.gridOptions.tblHead = this.gridObject.childNodes[0].childNodes[0].createTHead();
                this.gridOptions.tblFoot = this.gridObject.childNodes[0].childNodes[0].createTFoot();
                this.gridOptions.tblHeadRight = this.gridObject.childNodes[1].childNodes[0].createTHead();
                this.gridOptions.tblFootRight = this.gridObject.childNodes[1].childNodes[0].createTFoot();
                tBody = document.createElement("tbody");
                oTableBody = document.createElement("tbody");
                this.gridObject.childNodes[0].childNodes[0].appendChild(tBody);
                this.gridObject.childNodes[1].childNodes[0].appendChild(oTableBody);
                this.gridOptions.tblBody = tBody;
                this.gridOptions.tblBodyRight = oTableBody;
                this.gridOptions.gridObject = this.gridObject;
            } else {
                this.gridOptions.tblHead = this.gridObject.createTHead();
                this.gridOptions.tblFoot = this.gridObject.createTFoot();
                tBody = document.createElement("tbody");
                this.gridObject.appendChild(tBody);
                this.gridOptions.tblBody = tBody;
                this.gridOptions.gridObject = this.gridObject;
            }
        }

        // Create Pagination if grid supports pagination
        if (this.gridOptions.pagination.paginate) {
            new MAQ.CreateHTMLTableWithHeader(this.gridOptions);
            new MAQ.CreateHTMLTableRow(this.gridOptions);
            if (this.gridOptions.totalPages) {
                new MAQ.CreatePaginationControl(this.gridOptions);
            }
        } else if (this.gridOptions.scrolling.enabled) {
            new MAQ.CreateHTMLTableRow(this.gridOptions);
            new MAQ.CreateHTMLTableWithHeader(this.gridOptions);
            iMargin = this.gridOptions.tblHead.clientHeight;
            this.gridOptions.tblHead.style.marginTop = "-" + iMargin + "px";
            this.gridOptions.containerObject.style.marginTop = iMargin + "px";
            this.gridOptions.gridObject.style.width = this.gridOptions.containerObject.clientWidth + "px";
            MAQUtility.addClass(this.gridOptions.tblHead, "jsonScrollHeader");
            MAQUtility.addClass(this.gridOptions.containerObject, "jsonScrollContainer");
        } else {
            if ("undefined" !== this.gridOptions.inPlaceGrid.disableHeader) {
                if (!this.gridOptions.inPlaceGrid.disableHeader) {
                    new MAQ.CreateHTMLTableWithHeader(this.gridOptions);
                }
            }
            new MAQ.CreateHTMLTableRow(this.gridOptions);
        }

        indexPositionOfCurrentGrid = MAQ.gridName.indexOf(this.gridOptions.gridName);
        if (indexPositionOfCurrentGrid > -1) {
            MAQ.gridObject[indexPositionOfCurrentGrid] = this.gridOptions;
        } else {
            MAQ.gridName.push(this.gridOptions.gridName);
            MAQ.gridObject.push(this.gridOptions);
        }
        this.containerObject = null;
        this.gridObject = null;
        this.LoopCounter = null;
    }
    return true;
};

// Function to create and update hidden chunk (this will be called only in case of server side grid)
MAQ.createHiddenChunk = function (gridOptions) {
    var sContainer = gridOptions.container, oHiddenContainer = document.getElementById(sContainer + "_hidden");
    if (oHiddenContainer) {
        gridOptions.currentPage = parseInt(oHiddenContainer.getAttribute("data-currentPage"));
        gridOptions.totalPages = parseInt(oHiddenContainer.getAttribute("data-totalPages"));
        gridOptions.pagination.maxRows = parseInt(oHiddenContainer.getAttribute("data-maxRows"));
        gridOptions.gridSort.sortby = oHiddenContainer.getAttribute("data-sortBy");
        gridOptions.gridSort.sortorder = oHiddenContainer.getAttribute("data-sortOrder");
    } else {
        oHiddenContainer = document.createElement("div");
        oHiddenContainer.id = sContainer + "_hidden";
        oHiddenContainer.setAttribute("data-totalPages", gridOptions.totalPages.toString());
        oHiddenContainer.setAttribute("data-currentPage", gridOptions.currentPage.toString());
        oHiddenContainer.setAttribute("data-maxRows", gridOptions.pagination.maxRows.toString());
        oHiddenContainer.setAttribute("data-sortBy", gridOptions.gridSort.sortby.toString());
        oHiddenContainer.setAttribute("data-sortOrder", gridOptions.gridSort.sortorder.toString());
        oHiddenContainer.setAttribute("data-sent", "0"); // To check if response is received or not in case of scrollable server side grid
        MAQUtility.addClass(oHiddenContainer, "Hidden");
        gridOptions.containerObject.parentElement.appendChild(oHiddenContainer);
        gridOptions.hiddenContainer = oHiddenContainer;
    }
};

// Function to send service request in case of server side grid
MAQ.callService = function (gridOptions) {
    var oHiddenContainer = document.getElementById(gridOptions.container + "_hidden"), sCallBack = gridOptions.serverGrid.sendRequestFunction;

    // Properties to be sent in request
    var oParameters = {
        maxRows: gridOptions.pagination.maxRows,
        sortOrder: oHiddenContainer.getAttribute("data-sortOrder"),
        sortBy: oHiddenContainer.getAttribute("data-sortBy"),
        sortKey: oHiddenContainer.getAttribute("data-sortKey"),
        startIndex: parseInt(oHiddenContainer.getAttribute("data-currentPage")) + 1,
        gridContainer: gridOptions.container
    };
    if (sCallBack && typeof window[sCallBack] === oGridConstants.sFunction) {
        if (gridOptions.pagination.paginate) {
            // Empty the container before fetching next set of data in case of server side pagination
            document.getElementById(gridOptions.container).innerHTML = "";
        }
        window[sCallBack](oParameters);
    }
};

// Function to add scroll handler
MAQ.handleGridScroll = function (oCurrentElement) {
    var oHiddenContainer, gridOptions, sRequestPending, iMaxPageNumber, iCurrentPage, iGridObjectPosition = MAQ.gridName.indexOf(oCurrentElement.id + "_Grid");
    if (-1 < iGridObjectPosition) {
        gridOptions = MAQ.gridObject[iGridObjectPosition];
        oHiddenContainer = document.getElementById(gridOptions.container + "_hidden");
        if (oHiddenContainer && oCurrentElement.scrollTop === (oCurrentElement.scrollHeight - oCurrentElement.offsetHeight)) {
            sRequestPending = oHiddenContainer.getAttribute("data-sent");
            iMaxPageNumber = parseInt(oHiddenContainer.getAttribute("data-totalPages")) || 0;
            iCurrentPage = (parseInt(oHiddenContainer.getAttribute("data-currentPage")) || 0) + 1;
            if ("1" !== sRequestPending && iCurrentPage <= iMaxPageNumber) {
                oHiddenContainer.setAttribute("data-currentPage", iCurrentPage);
                oHiddenContainer.setAttribute("data-sent", "1");
                MAQ.callService(gridOptions);
            }
        }
    }
};

// Function to append data to existing grid on scroll
MAQ.appendDataToGrid = function (gridOptions) {
    var oHiddenContainer = document.getElementById(gridOptions.container + "_hidden"), oGridConfigurationOptions, iGridObjectPosition = MAQ.gridName.indexOf(gridOptions.container + "_Grid");
    if (-1 < iGridObjectPosition) {
        oGridConfigurationOptions = MAQ.gridObject[iGridObjectPosition];
        oGridConfigurationOptions.data = gridOptions.data;
        oHiddenContainer.setAttribute("data-sent", "0");
        MAQ.CreateHTMLTableRow(oGridConfigurationOptions);
    }
};

MAQ.drillDown = function (oObject, sCallBack, sContainer) {
    var iGridObjectPosition = MAQ.gridName.indexOf(sContainer + "_Grid"), bAccordion = MAQ.gridObject[iGridObjectPosition].drillDown.accordion, oDrillSet = {}, oDrillIconSet = {}, oReferencedCell, oReferencedRow = oObject.parentNode.parentNode.nextSibling, bIsExpanded = "1" === oObject.getAttribute("data-expanded") ? true : false, iCount = 0, iTotal = 0;
    if (oReferencedRow && "undefined" !== typeof oReferencedRow) {
        oReferencedCell = oReferencedRow.childNodes[0];
    }
    if (bAccordion) {
        oDrillSet = document.querySelectorAll("#" + sContainer + "_Grid .InnerRow");
        oDrillIconSet = document.querySelectorAll("#" + sContainer + "_Grid .DrillCollpaseIcon");
        MAQUtility.addClass(oDrillSet, "HiddenSection");
        MAQUtility.removeClass(oDrillIconSet, "DrillCollpaseIcon");

        // Reset data-expanded to 0
        iTotal = oDrillIconSet.length;
        for (iCount = 0; iCount < iTotal; iCount++) {
            oDrillIconSet[iCount].setAttribute("data-expanded", "0");
        }
    }
    if (bIsExpanded) {
        MAQUtility.removeClass(oObject, "DrillCollpaseIcon");
        MAQUtility.addClass(oReferencedRow, "HiddenSection");
        oObject.setAttribute("data-expanded", "0");
    } else {
        MAQUtility.addClass(oObject, "DrillCollpaseIcon");
        MAQUtility.removeClass(oReferencedRow, "HiddenSection");
        oObject.setAttribute("data-expanded", "1");
    }

    if (sCallBack && "undefined" !== typeof window[sCallBack]) {
        window[sCallBack](oObject, sContainer, oReferencedCell);
    }
};

// Function to calculate max and min
MAQ.calculateMinMax = function (gridOptions, iStartIndex, iEndIndex) {
    var iColumnIncludedLength, iColumnIterator, nMax, nCurrentValue, nMin, nCurrentColumn, iIterator;
    iColumnIncludedLength = gridOptions.dataConfiguration.columnsIncluded.length;
    for (iColumnIterator = 0; iColumnIterator < iColumnIncludedLength; iColumnIterator++) {
        nCurrentColumn = gridOptions.dataConfiguration.columnsIncluded[iColumnIterator];
        nMax = 0, nMin = 0;
        for (iIterator = iStartIndex; iIterator < iEndIndex; iIterator++) {
            nCurrentValue = parseFloat(gridOptions.data[iIterator][nCurrentColumn]);
            if (isNaN(nCurrentValue)) {
                nCurrentValue = 0;
            }
            if (gridOptions.dataConfiguration.useAbsolutes.indexOf(nCurrentColumn) > -1) {
                if (Math.abs(nCurrentValue) > nMax) {
                    nMax = Math.abs(nCurrentValue);
                }
            } else {
                if (nCurrentValue > nMax) {
                    nMax = nCurrentValue;
                }
                if (nCurrentValue < nMin) {
                    nMin = nCurrentValue;
                }
            }
        }
        if (gridOptions.dataConfiguration.includeEndRow && gridOptions.endRow.enableEndRow) {
            nCurrentValue = parseFloat(gridOptions.endRow.data[nCurrentColumn]);
            if (isNaN(nCurrentValue)) {
                nCurrentValue = 0;
            }
            if (gridOptions.dataConfiguration.useAbsolutes.indexOf(nCurrentColumn) > -1) {
                if (Math.abs(nCurrentValue) > nMax) {
                    nMax = Math.abs(nCurrentValue);
                }
            } else {
                if (nCurrentValue > nMax) {
                    nMax = nCurrentValue;
                }

                if (nCurrentValue < nMin) {
                    nMin = nCurrentValue;
                }
            }
        }
        gridOptions.dataConfiguration.maxConfig[nCurrentColumn] = nMax;
        gridOptions.dataConfiguration.maxConfig[nCurrentColumn + "_Min"] = nMin;
    }
    return gridOptions;
};
MAQ.getChildPosition = function (oChildNode, oParentNode) {
    var index = -1, iCount, iTotal = oParentNode.querySelectorAll(oChildNode.tagName).length, aTrs = oParentNode.querySelectorAll(oChildNode.tagName);
    for (iCount = 0; iCount < iTotal; iCount++) {
        var oCurrentNode = aTrs[iCount];
        if (oChildNode === oCurrentNode) {
            index = iCount;
            return index;
            break;
        }
    }
};
/// <disable>JS2025.InsertSpaceBeforeCommentText</disable>
//# sourceMappingURL=jsonGrid.js.map
