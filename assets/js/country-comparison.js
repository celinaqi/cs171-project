// TREE MAP UNITED STATES
var treeMapDataUS =
    { "name": "visualization",
    "children": [
        {
            "name": "United States", "size": 100
        }
    ]};

var margin = {top: 40, right: 40, bottom: 50, left: 50},
    width = 500 - margin.left - margin.right,
    // width = $('#water-chart2').width() - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    color = d3.scaleOrdinal()
        .range(["steelblue"]);

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

var treeMapNodeUS = divUS.datum(root).selectAll(".treeMapNode")
    .data(treeUS.leaves())
    .enter().append("div")
    .attr("class", "treeMapNode")
    .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
.style("background", (d) => color(d.parent.data.name))
.text((d) => d.data.name + ": " + d.data.size + "%");



// TREE MAP COUNTRIES1
var treeMapDataCountries1 =
    {
        "name": "visualization",
        "children": [
            {
                "name": "country1",
                "children": [
                    {"name": "Slovakia", "size": 7.45}
                ]
            },
            {
                "name": "country2",
                "children": [
                    {"name": "Israel", "size": 10.87}
                ]
            },
            {
                "name": "country3",
                "children": [
                    {"name": "France", "size": 29.82}
                ]
            },
            {
                "name": "country4",
                "children": [
                    {"name": "Australia", "size": 41.31}
                ]
            },
            {
                "name": "country5",
                "children": [
                    {"name": "Ireland", "size": 10.55}
                ]
            }
        ]
    };

const marginCountries1 = {top: 40, right: 40, bottom: 50, left: 50},
    widthCountries1 = 500 - marginCountries1.left - marginCountries1.right,
    heightCountries1 = 400 - marginCountries1.top - marginCountries1.bottom,
    colorCountries1 = d3.scaleOrdinal()
        .range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"]);

const treemapCountries1 = d3.treemap().size([widthCountries1, heightCountries1]);

const divCountries1 = d3.select("#water-comparison-countries1").append("div")
    .style("position", "relative")
    .style("width", (widthCountries1 + marginCountries1.left + marginCountries1.right) + "px")
    .style("height", (heightCountries1 + marginCountries1.top + marginCountries1.bottom) + "px")
    .style("left", marginCountries1.left + "px")
    .style("top", marginCountries1.top + "px");

//get data
const rootCountries1 = d3.hierarchy(treeMapDataCountries1, (d) => d.children)
.sum((d) => d.size);

const treeCountries1 = treemapCountries1(rootCountries1);

const treeMapNodeCountries1 = divCountries1.datum(rootCountries1).selectAll(".treeMapNode")
    .data(treeCountries1.leaves())
    .enter().append("div")
    .attr("class", "treeMapNode")
    .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
.style("background", (d) => colorCountries1(d.parent.data.name))
.text((d) => d.data.name + ": " + d.data.size + "%");

// TREE MAP COUNTRIES
var treeMapDataCountries2 =
    {
        "name": "visualization",
        "children": [
            {
                "name": "country1",
                "children": [
                    {"name": "Mexico", "size": 43.90}
                ]
            },
            {
                "name": "country2",
                "children": [
                    {"name": "Japan", "size": 40.37}
                ]
            },
            {
                "name": "country3",
                "children": [
                    {"name": "Switzerland", "size": 15.73}
                ]
            }
        ]
    };

const marginCountries2 = {top: 40, right: 40, bottom: 50, left: 50},
    widthCountries2 = 500 - marginCountries2.left - marginCountries2.right,
    heightCountries2 = 400 - marginCountries2.top - marginCountries2.bottom,
    colorCountries2 = d3.scaleOrdinal()
        .range(["#b3e2cd", "#fdcdac", "#cbd5e8"]);

const treemapCountries2 = d3.treemap().size([widthCountries2, heightCountries2]);

const divCountries2 = d3.select("#water-comparison-countries2").append("div")
    .style("position", "relative")
    .style("width", (widthCountries2 + marginCountries2.left + marginCountries2.right) + "px")
    .style("height", (heightCountries2 + marginCountries2.top + marginCountries2.bottom) + "px")
    .style("left", marginCountries2.left + "px")
    .style("top", marginCountries2.top + "px");

//get data
const rootCountries2 = d3.hierarchy(treeMapDataCountries2, (d) => d.children)
.sum((d) => d.size);

const treeCountries2 = treemapCountries2(rootCountries2);

const treeMapNodeCountries2 = divCountries2.datum(rootCountries2).selectAll(".treeMapNode")
    .data(treeCountries2.leaves())
    .enter().append("div")
    .attr("class", "treeMapNode")
    .style("left", (d) => d.x0 + "px")
.style("top", (d) => d.y0 + "px")
.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
.style("background", (d) => colorCountries2(d.parent.data.name))
.text((d) => d.data.name + ": " + d.data.size + "%");