// Second bar chart
var countryData = [
    {"country" : "United States", "consumption" : 100},
    {"country" : "Australia", "consumption" : 86},
    {"country" : "Japan", "consumption" : 65},
    {"country" : "France", "consumption" : 50},
    {"country" : "Peru", "consumption" : 30},
    {"country" : "India", "consumption" : 23},
    {"country" : "Nigeria", "consumption" : 06},
    {"country" : "Haiti", "consumption" : 03},
    {"country" : "Mozambique", "consumption" : 01}
];

var margin2 = {top: 60, right: 20, bottom: 40, left: 80},
    // width2 = $('#water-chart2').width() - margin2.left - margin2.right,
    width2 = 1200 - margin2.left - margin2.right,
    height2 = 450 - margin2.top - margin2.bottom;

var svgCalculator2 = d3.select("#water-chart2").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// set scales
var x2 = d3.scaleBand()
    .range([0, width2])
    .domain(countryData.map(function(d) {
        return d.country;
    }));

var y2 = d3.scaleLinear()
    .range([height2, 0])
    .domain([0, d3.max(countryData, function(d) {
        return d.consumption;
    })]);

var xAxis2 = d3.axisBottom()
    .scale(x2);

var yAxis2 = d3.axisLeft()
    .scale(y2);

var xAxisGroup2 = svgCalculator2.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height2 + ")");

var yAxisGroup2 = svgCalculator2.append("g")
    .attr("class", "y-axis axis");

svgCalculator2.append("text")
    .attr("class", "label")
    .attr("x", -230)
    .attr("y", -30)
    .attr("transform", "rotate(-90)")
    .attr("fill", "white")
    .text("% US consumption");

svgCalculator2.append("text")
    .attr("class", "label")
    .attr("x", width2 / 2 - 25)
    .attr("y", height2 + 35)
    .attr("fill", "white")
    .text("Country");

svgCalculator2.append("text")
    .attr("class", "title")
    .attr("x", 200)
    .attr("y", -20)
    .attr("fill", "white")
    .text("Countries' Percentage of United States' Water Consumptions Per Capita Per Day");

var bars2 = svgCalculator2.selectAll(".bar2")
    .data(countryData);

bars2.exit().remove();

bars2.enter()
    .append("rect")
    .attr("class", "bar2")
    .merge(bars2)
    .attr("x", function(d) {
        return x2(d.country);
    })
    .attr("y", function(d) {
        return y2(d.consumption);
    })
    .attr("height", function(d) {
        return height2 - y2(d.consumption);
    })
    .attr("width", 100)
    // .attr("width", x2.bandwidth() - 10)
    .attr("fill", function(d) {
        if (d.country === "United States") {return d3.rgb("#ed4933")}
        else {return "steelblue"}});

xAxisGroup2 = svgCalculator2.select(".x-axis")
    .attr("transform", "translate(0," + height2 + ")")
    .attr("fill", "white")
    .call(xAxis2);

yAxisGroup2 = svgCalculator2.select(".y-axis")
    .attr("fill", "white")
    .call(yAxis2);

// Add numbers
var numbers2 = svgCalculator2.selectAll("text.numbers2")
    .data(countryData)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
        return i * x2.bandwidth() + x2.bandwidth()/3;
    })
    .attr("y", function (d) {
        return y2(d.consumption) - 5;
    })
    .text(function(d) {
        return d.consumption + "%";
    })
    .attr("fill", "white")
    .attr("font-size", 10);



// TREE MAP UNITED STATES
var treeMapDataUS =
    { "name": "visualization",
    "children": [
        {
            "name": "United States", "size": 100
        }
    ]};

var margin = {top: 40, right: 40, bottom: 50, left: 50},
    width = 700 - margin.left - margin.right,
    // width = $('#water-chart2').width() - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    color = d3.scaleOrdinal()
        .range([d3.rgb("#ed4933")]);

var treemapUS = d3.treemap().size([width, height]);

var divUS = d3.select("#water-comparison-US").append("div")
    .style("position", "relative")
    .style("class", "divUS")
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
.text((d) => d.data.name + ": " + d.data.size + "%")
.style("fill", "black");


// TREE MAP COUNTRIES1
var treeMapDataCountries1 =
    {
        "name": "visualization",
        "children": [
            {
                "name": "Mozambique",
                "children": [
                    {"name": "Mozambique", "size": .70}
                ]
            },
            {
                "name": "Uganda",
                "children": [
                    {"name": "Uganda", "size": 2.61}
                ]
            },
            {
                "name": "Haiti",
                "children": [
                    {"name": "Haiti", "size": 2.61}
                ]
            },
            {
                "name": "Cambodia",
                "children": [
                    {"name": "Cambodia", "size": 2.61}
                ]
            },
            {
                "name": "Angola",
                "children": [
                    {"name": "Angola", "size": 2.61}
                ]
            },
            {
                "name": "Niger",
                "children": [
                    {"name": "Niger", "size": 4.70}
                ]
            },
            {
                "name": "Burkina Faso",
                "children": [
                    {"name": "Burkina Faso", "size": 4.70}
                ]
            },
            {
                "name": "Ghana",
                "children": [
                    {"name": "Ghana", "size": 6.26}
                ]
            },
            {
                "name": "Bangladesh",
                "children": [
                    {"name": "Bangladesh", "size": 8.00}
                ]
            },
            {
                "name": "China",
                "children": [
                    {"name": "China", "size": 14.96}
                ]
            },
            {
                "name": "India",
                "children": [
                    {"name": "India", "size": 23.48}
                ]
            },
            {
                "name": "United Kingdom",
                "children": [
                    {"name": "United Kingdom", "size": 25.91}
                ]
            },
        ]
    };

const marginCountries1 = {top: 40, right: 40, bottom: 50, left: 50},
    widthCountries1 = 700 - marginCountries1.left - marginCountries1.right,
    heightCountries1 = 400 - marginCountries1.top - marginCountries1.bottom,
    colorCountries1 = d3.scaleOrdinal()
        .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]);

const treemapCountries1 = d3.treemap().size([widthCountries1, heightCountries1]);

const divCountries1 = d3.select("#water-comparison-countries1").append("div")
    .style("position", "relative")
    .attr("class", "divCountries")
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

// // TREE MAP COUNTRIES
// var treeMapDataCountries2 =
//     {
//         "name": "visualization",
//         "children": [
//             {
//                 "name": "country1",
//                 "children": [
//                     {"name": "Mexico", "size": 43.90}
//                 ]
//             },
//             {
//                 "name": "country2",
//                 "children": [
//                     {"name": "Japan", "size": 40.37}
//                 ]
//             },
//             {
//                 "name": "country3",
//                 "children": [
//                     {"name": "Switzerland", "size": 15.73}
//                 ]
//             }
//         ]
//     };
//
// const marginCountries2 = {top: 40, right: 40, bottom: 50, left: 50},
//     widthCountries2 = 500 - marginCountries2.left - marginCountries2.right,
//     heightCountries2 = 400 - marginCountries2.top - marginCountries2.bottom,
//     colorCountries2 = d3.scaleOrdinal()
//         .range(["#b3e2cd", "#fdcdac", "#cbd5e8"]);
//
// const treemapCountries2 = d3.treemap().size([widthCountries2, heightCountries2]);
//
// const divCountries2 = d3.select("#water-comparison-countries2").append("div")
//     .style("position", "relative")
//     .style("width", (widthCountries2 + marginCountries2.left + marginCountries2.right) + "px")
//     .style("height", (heightCountries2 + marginCountries2.top + marginCountries2.bottom) + "px")
//     .style("left", marginCountries2.left + "px")
//     .style("top", marginCountries2.top + "px");
//
// //get data
// const rootCountries2 = d3.hierarchy(treeMapDataCountries2, (d) => d.children)
// .sum((d) => d.size);
//
// const treeCountries2 = treemapCountries2(rootCountries2);
//
// const treeMapNodeCountries2 = divCountries2.datum(rootCountries2).selectAll(".treeMapNode")
//     .data(treeCountries2.leaves())
//     .enter().append("div")
//     .attr("class", "treeMapNode")
//     .style("left", (d) => d.x0 + "px")
// .style("top", (d) => d.y0 + "px")
// .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
// .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
// .style("background", (d) => colorCountries2(d.parent.data.name))
// .text((d) => d.data.name + ": " + d.data.size + "%");