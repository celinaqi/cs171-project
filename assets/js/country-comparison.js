// TREE MAP UNITED STATES
var treeMapDataUS =
    { "name": "visualization",
    "children": [
        {
            "name": "United States", "size": 1583
        }
    ]};


var margin = {top: 40, right: 40, bottom: 10, left: 50},
    width = 600 - margin.left - margin.right,
    // width = $('#water-chart2').width() - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    color = d3.scaleOrdinal().range(d3.schemeCategory20c);

var treemapUS = d3.treemap().size([width, height]);

var divUS = d3.select("#water-comparison-US").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

//get data
var rootUS = d3.hierarchy(treeMapDataUS, (d) => d.children)
.sum((d) => d.size);

var treeUS = treemapUS(rootUS);

// Tooltip attempts
// var divToolTip = d3.select("#water-chart1-treemap").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);
//
// var mousemove = function(d) {
//     var xPosition = d3.event.pageX + 5;
//     var yPosition = d3.event.pageY + 5;
//
//     d3.select("#tooltip")
//         .style("left", xPosition + "px")
//         .style("top", yPosition + "px");
//     d3.select("#tooltip")
//         .text(d.data.name + "<br/>" + d.data.size);
//     d3.select("#tooltip").classed("hidden", false);
// };
//
// var mouseout = function() {
//     d3.select("#tooltip").classed("hidden", true);
// };

var treeMapNodeUS = divUS.datum(root).selectAll(".treeMapNodeUS")
    .data(treeUS.leaves())
    .enter().append("div")
    .attr("class", "treeMapNodeUS")
    .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
.style("background", (d) => color(d.parent.data.name))
.text((d) => d.data.name + ": " + d.data.size);
// .on("mousemove", mousemove)
//     .on("mouseout", mouseout);


d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? (d) => { return d.size ? 1 : 0;}
: (d) => { return d.size; };

    var newRootUS = d3.hierarchy(treeMapDataUS, (d) => d.children)
.sum(value);

    treeMapNodeUS.data(treemapUS(newRootUS).leaves())
        .transition()
        .duration(1500)
        .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
});
// .on("mouseover", function(d) {
//     div.transition()
//         .duration(200)
//         .style("opacity", .9);
//     div.html(d.data.name + "<br/>" + d.data.size)
//         .style("left", (d3.event.pageX) + "px")
//         .style("top", (d3.event.pageY - 28) + "px");
// })
// .on("mouseout", function(d) {
//     div.transition()
//         .duration(500)
//         .style("opacity", 0);
// });



// TREE MAP COUNTRIES
var treeMapDataCountries =
    {
        "name": "visualization",
        "children": [
            {
                "name": "country1",
                "children": [
                    {"name": "Slovakia", "size": 118}
                ]
            },
            {
                "name": "country2",
                "children": [
                    {"name": "Israel", "size": 172}
                ]
            },
            {
                "name": "country3",
                "children": [
                    {"name": "France", "size": 472}
                ]
            },
            {
                "name": "country4",
                "children": [
                    {"name": "Australia", "size": 629}
                ]
            },
            {
                "name": "country5",
                "children": [
                    {"name": "Ireland", "size": 167}
                ]
            }
        ]
    };

var marginCountries = {top: 40, right: 40, bottom: 10, left: 50},
    widthCountries = 600 - margin.left - margin.right,
    heightCountries = 300 - margin.top - margin.bottom,
    colorCountries = d3.scaleOrdinal().range(d3.schemeCategory20c);

var treemapCountries = d3.treemap().size([widthCountries, heightCountries]);

var divCountries = d3.select("#water-comparison-countries").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

//get data
var rootCountries = d3.hierarchy(treeMapDataCountries, (d) => d.children)
.sum((d) => d.size);

var treeCountries = treemapCountries(rootCountries);

// Tooltip attempts
// var divToolTip = d3.select("#water-chart1-treemap").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);
//
// var mousemove = function(d) {
//     var xPosition = d3.event.pageX + 5;
//     var yPosition = d3.event.pageY + 5;
//
//     d3.select("#tooltip")
//         .style("left", xPosition + "px")
//         .style("top", yPosition + "px");
//     d3.select("#tooltip")
//         .text(d.data.name + "<br/>" + d.data.size);
//     d3.select("#tooltip").classed("hidden", false);
// };
//
// var mouseout = function() {
//     d3.select("#tooltip").classed("hidden", true);
// };

var treeMapNodeCountries = divCountries.datum(rootCountries).selectAll(".treeMapNodeCountries")
    .data(treeCountries.leaves())
    .enter().append("div")
    .attr("class", "treeMapNodeCountries")
    .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
.style("background", (d) => colorCountries(d.parent.data.name))
.text((d) => d.data.name + ": " + d.data.size);
// .on("mousemove", mousemove)
//     .on("mouseout", mouseout);


d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? (d) => { return d.size ? 1 : 0;}
: (d) => { return d.size; };

    var newRootCountries = d3.hierarchy(treeMapDataCountries, (d) => d.children)
.sum(value);

    treeMapNodeCountries.data(treemapCountries(newRootCountries).leaves())
        .transition()
        .duration(1500)
        .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
});
// .on("mouseover", function(d) {
//     div.transition()
//         .duration(200)
//         .style("opacity", .9);
//     div.html(d.data.name + "<br/>" + d.data.size)
//         .style("left", (d3.event.pageX) + "px")
//         .style("top", (d3.event.pageY - 28) + "px");
// })
// .on("mouseout", function(d) {
//     div.transition()
//         .duration(500)
//         .style("opacity", 0);
// });
