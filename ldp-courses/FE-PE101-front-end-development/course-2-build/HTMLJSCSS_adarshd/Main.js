/*
 * Main.js
 * MAQ Software — HTML, JS, and CSS Assignment
 * Implements: dynamic tiles, MAQ column chart (SVG), JSONGrid initialization,
 *             two-level navigation behavior.
 */
(function () {
    "use strict";

    var COLOR_PALETTE = ["#4572a7", "#aa4643", "#89a54e", "#80699b", "#3d96ae", "#db843d"];
    var DEFAULT_CATEGORY = "Customer";

    var state = {
        tilesData: null,
        chartData: null,
        gridData: null
    };

    /* ============ Utilities ============ */
    function $(id) {
        return document.getElementById(id);
    }

    function fetchJson(url) {
        return fetch(url, { cache: "no-store" }).then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to fetch " + url + " (" + response.status + ")");
            }
            return response.json();
        });
    }

    /* ============ Tiles ============ */
    function renderTiles(category) {
        if (!state.tilesData || !state.tilesData[category]) {
            return;
        }
        var heading = $("tilesHeading");
        if (heading) {
            heading.textContent = category;
        }
        var items = state.tilesData[category];
        items.forEach(function (item) {
            var tile = $(item.id);
            if (!tile) {
                return;
            }
            var titleEl = tile.querySelector(".tile-title");
            var valueEl = tile.querySelector(".tile-value");
            if (titleEl) {
                titleEl.textContent = item.name;
            }
            if (valueEl) {
                valueEl.textContent = String(item.value);
            }
        });
    }

    /* ============ MAQ Chart (SVG column chart) ============ */
    function renderChart() {
        var container = $("maqChart");
        if (!container || !state.chartData) {
            return;
        }
        var data = state.chartData;
        var labels = data.xAxis.labelsSeries;
        var values = data.data[0].data;
        var colors = data.colorPalette || COLOR_PALETTE;

        var width = container.clientWidth || 800;
        var height = 360;
        var margin = { top: 20, right: 20, bottom: 60, left: 60 };
        var chartWidth = width - margin.left - margin.right;
        var chartHeight = height - margin.top - margin.bottom;

        var maxValue = Math.max.apply(null, values);
        var yMax = Math.ceil(maxValue / 100) * 100;
        var ySteps = 5;
        var stepValue = yMax / ySteps;

        var barCount = values.length;
        var barGap = 0.3;
        var bandWidth = chartWidth / barCount;
        var barWidth = bandWidth * (1 - barGap);

        var svgNs = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgNs, "svg");
        svg.setAttribute("class", "maq-chart-svg");
        svg.setAttribute("viewBox", "0 0 " + width + " " + height);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        var i;

        // Grid lines + Y axis labels
        for (i = 0; i <= ySteps; i++) {
            var yValue = i * stepValue;
            var yPos = margin.top + chartHeight - (yValue / yMax) * chartHeight;

            var gridLine = document.createElementNS(svgNs, "line");
            gridLine.setAttribute("class", "maq-chart-grid-line");
            gridLine.setAttribute("x1", String(margin.left));
            gridLine.setAttribute("y1", String(yPos));
            gridLine.setAttribute("x2", String(margin.left + chartWidth));
            gridLine.setAttribute("y2", String(yPos));
            svg.appendChild(gridLine);

            var yLabel = document.createElementNS(svgNs, "text");
            yLabel.setAttribute("class", "maq-chart-tick-label");
            yLabel.setAttribute("x", String(margin.left - 8));
            yLabel.setAttribute("y", String(yPos + 4));
            yLabel.setAttribute("text-anchor", "end");
            yLabel.textContent = String(yValue);
            svg.appendChild(yLabel);
        }

        // Y-axis title
        var yTitle = document.createElementNS(svgNs, "text");
        yTitle.setAttribute("class", "maq-chart-axis-title");
        yTitle.setAttribute("transform", "rotate(-90)");
        yTitle.setAttribute("x", String(-(margin.top + chartHeight / 2)));
        yTitle.setAttribute("y", String(16));
        yTitle.setAttribute("text-anchor", "middle");
        yTitle.textContent = data.yAxis.title;
        svg.appendChild(yTitle);

        // Bars + X labels
        for (i = 0; i < barCount; i++) {
            var value = values[i];
            var barHeight = (value / yMax) * chartHeight;
            var x = margin.left + i * bandWidth + (bandWidth - barWidth) / 2;
            var y = margin.top + chartHeight - barHeight;

            var rect = document.createElementNS(svgNs, "rect");
            rect.setAttribute("class", "maq-chart-bar");
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
            rect.setAttribute("width", String(barWidth));
            rect.setAttribute("height", String(barHeight));
            rect.setAttribute("fill", colors[i % colors.length]);

            var title = document.createElementNS(svgNs, "title");
            title.textContent = labels[i] + ": " + value + " orders";
            rect.appendChild(title);
            svg.appendChild(rect);

            var valueLabel = document.createElementNS(svgNs, "text");
            valueLabel.setAttribute("class", "maq-chart-bar-label");
            valueLabel.setAttribute("x", String(x + barWidth / 2));
            valueLabel.setAttribute("y", String(y - 6));
            valueLabel.textContent = String(value);
            svg.appendChild(valueLabel);

            var xLabel = document.createElementNS(svgNs, "text");
            xLabel.setAttribute("class", "maq-chart-tick-label");
            xLabel.setAttribute("x", String(x + barWidth / 2));
            xLabel.setAttribute("y", String(margin.top + chartHeight + 18));
            xLabel.setAttribute("text-anchor", "middle");
            xLabel.textContent = labels[i];
            svg.appendChild(xLabel);
        }

        // X-axis line
        var xAxisLine = document.createElementNS(svgNs, "line");
        xAxisLine.setAttribute("class", "maq-chart-axis-line");
        xAxisLine.setAttribute("x1", String(margin.left));
        xAxisLine.setAttribute("y1", String(margin.top + chartHeight));
        xAxisLine.setAttribute("x2", String(margin.left + chartWidth));
        xAxisLine.setAttribute("y2", String(margin.top + chartHeight));
        svg.appendChild(xAxisLine);

        // X-axis title
        var xTitle = document.createElementNS(svgNs, "text");
        xTitle.setAttribute("class", "maq-chart-axis-title");
        xTitle.setAttribute("x", String(margin.left + chartWidth / 2));
        xTitle.setAttribute("y", String(height - 12));
        xTitle.setAttribute("text-anchor", "middle");
        xTitle.textContent = data.xAxis.title;
        svg.appendChild(xTitle);

        container.innerHTML = "";
        container.appendChild(svg);
    }

    /* ============ JSONGrid ============ */
    function renderGrid() {
        if (!state.gridData) {
            return;
        }
        var columnHeader = [
            {
                columnText: "Sales Order ID",
                name: "SalesOrderID",
                sortable: true,
                sortType: "parseInteger",
                sortKey: "SalesOrderID",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "140px" }
            },
            {
                columnText: "Sales Order Detail ID",
                name: "SalesOrderDetailID",
                sortable: true,
                sortType: "parseInteger",
                sortKey: "SalesOrderDetailID",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "180px" }
            },
            {
                columnText: "Product ID",
                name: "ProductID",
                sortable: true,
                sortType: "parseInteger",
                sortKey: "ProductID",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "120px" }
            },
            {
                columnText: "Order Quantity",
                name: "OrderQty",
                sortable: true,
                sortType: "parseInteger",
                sortKey: "OrderQty",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "140px" }
            },
            {
                columnText: "Unit Price",
                name: "UnitPrice",
                sortable: true,
                sortType: "parseDecimal",
                sortKey: "UnitPrice",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "120px" }
            },
            {
                columnText: "Unit Price Discount",
                name: "UnitPriceDiscount",
                sortable: true,
                sortType: "parseDecimal",
                sortKey: "UnitPriceDiscount",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "180px" }
            },
            {
                columnText: "Line Total",
                name: "LineTotal",
                sortable: true,
                sortType: "parseDecimal",
                sortKey: "LineTotal",
                headerClassName: "gridHeader",
                style: { "textAlign": "left", "min-width": "140px" }
            }
        ];

        try {
            // eslint-disable-next-line no-undef
            var oJSONGrid = new MAQ.JsonGrid({
                container: "jsonGrid",
                gridName: "salesOrderGrid",
                data: state.gridData,
                columnHeader: columnHeader,
                pagination: {
                    maxRows: 10,
                    retainPageOnSort: true,
                    paginate: true
                },
                rows: { alternate: true },
                fixedHeaderEnd: "2",
                gridSort: {
                    sortby: "SalesOrderID",
                    sortorder: "asc",
                    sortType: "parseInteger"
                },
                scrolling: { enabled: true, scrollStyle: {} }
            });
            return oJSONGrid;
        } catch (err) {
            renderGridFallback(columnHeader);
            return null;
        }
    }

    function renderGridFallback(columnHeader) {
        var container = $("jsonGrid");
        if (!container) {
            return;
        }
        var pageSize = 10;
        var sortKey = "SalesOrderID";
        var sortAsc = true;
        var currentPage = 1;

        function compare(a, b) {
            var av = a[sortKey];
            var bv = b[sortKey];
            var an = parseFloat(av);
            var bn = parseFloat(bv);
            if (!isNaN(an) && !isNaN(bn)) {
                return sortAsc ? an - bn : bn - an;
            }
            av = String(av);
            bv = String(bv);
            if (av < bv) { return sortAsc ? -1 : 1; }
            if (av > bv) { return sortAsc ? 1 : -1; }
            return 0;
        }

        function draw() {
            var sorted = state.gridData.slice().sort(compare);
            var totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
            if (currentPage > totalPages) { currentPage = totalPages; }
            var start = (currentPage - 1) * pageSize;
            var pageRows = sorted.slice(start, start + pageSize);

            var html = "";
            html += "<div class=\"fallback-grid-wrap\">";
            html += "<table class=\"fallback-grid\">";
            html += "<thead><tr>";
            columnHeader.forEach(function (col) {
                var arrow = "";
                if (col.name === sortKey) {
                    arrow = sortAsc ? " &#9650;" : " &#9660;";
                }
                html += "<th data-key=\"" + col.name + "\" class=\"fallback-grid-header\">"
                    + col.columnText + arrow + "</th>";
            });
            html += "</tr></thead><tbody>";
            pageRows.forEach(function (row) {
                html += "<tr>";
                columnHeader.forEach(function (col) {
                    html += "<td>" + (row[col.name] !== undefined ? row[col.name] : "") + "</td>";
                });
                html += "</tr>";
            });
            html += "</tbody></table></div>";
            html += "<div class=\"fallback-grid-pager\">";
            html += "<button class=\"fallback-grid-prev\" " + (currentPage === 1 ? "disabled" : "") + ">Previous</button>";
            html += "<span class=\"fallback-grid-page-info\">Page " + currentPage + " of " + totalPages + "</span>";
            html += "<button class=\"fallback-grid-next\" " + (currentPage === totalPages ? "disabled" : "") + ">Next</button>";
            html += "</div>";
            container.innerHTML = html;

            container.querySelectorAll(".fallback-grid-header").forEach(function (th) {
                th.addEventListener("click", function () {
                    var key = th.getAttribute("data-key");
                    if (key === sortKey) { sortAsc = !sortAsc; } else { sortKey = key; sortAsc = true; }
                    currentPage = 1;
                    draw();
                });
            });
            var prev = container.querySelector(".fallback-grid-prev");
            var next = container.querySelector(".fallback-grid-next");
            if (prev) { prev.addEventListener("click", function () { if (currentPage > 1) { currentPage--; draw(); } }); }
            if (next) { next.addEventListener("click", function () { if (currentPage < totalPages) { currentPage++; draw(); } }); }
        }

        draw();
        injectFallbackStyles();
    }

    function injectFallbackStyles() {
        if ($("fallbackGridStyles")) { return; }
        var style = document.createElement("style");
        style.id = "fallbackGridStyles";
        style.textContent = ".fallback-grid-wrap{overflow-x:auto;border:1px solid #e1e4e8;border-radius:4px;}"
            + ".fallback-grid{width:100%;border-collapse:collapse;font-size:13px;}"
            + ".fallback-grid th,.fallback-grid td{padding:10px 14px;text-align:left;border-bottom:1px solid #f0f4f9;}"
            + ".fallback-grid thead{background-color:#4572a7;color:#fff;}"
            + ".fallback-grid th{cursor:pointer;user-select:none;}"
            + ".fallback-grid tbody tr:nth-child(even){background-color:#fafbfc;}"
            + ".fallback-grid tbody tr:hover{background-color:#f0f4f9;}"
            + ".fallback-grid-pager{display:flex;align-items:center;justify-content:center;gap:16px;padding:12px;}"
            + ".fallback-grid-pager button{padding:6px 14px;background-color:#4572a7;color:#fff;border:0;border-radius:3px;cursor:pointer;}"
            + ".fallback-grid-pager button:disabled{background-color:#b0b6bd;cursor:not-allowed;}";
        document.head.appendChild(style);
    }

    /* ============ Navigation behavior ============ */
    function bindNavigation() {
        var subLinks = document.querySelectorAll(".sub-nav-link");
        subLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                var category = link.getAttribute("data-category");
                if (category) {
                    renderTiles(category);
                }
            });
        });
    }

    /* ============ Init ============ */
    function init() {
        Promise.all([
            fetchJson("Resources/Data/tilesData.json"),
            fetchJson("Resources/Data/chartData.json"),
            fetchJson("Resources/Data/gridData.json")
        ]).then(function (results) {
            state.tilesData = results[0];
            state.chartData = results[1];
            state.gridData = results[2];

            renderTiles(DEFAULT_CATEGORY);
            renderChart();
            renderGrid();
            bindNavigation();

            window.addEventListener("resize", function () {
                renderChart();
            });
        }).catch(function (err) {
            var main = $("mainContent");
            if (main) {
                var errBox = document.createElement("div");
                errBox.className = "load-error";
                errBox.textContent = "Failed to load data: " + err.message;
                main.insertBefore(errBox, main.firstChild);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
