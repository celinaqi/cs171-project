var treeMap =
    // {
    //     "name": "map",
    //     "children": [
    //         {"name": "shower", "size": 10},
    //         {"name": "flush", "size": 15},
    //         {"name": "sink", "size": 5},
    //         {"name": "laundry", "size": 6},
    //         {"name": "dishes", "size": 3},
    //         {"name": "drinking", "size": 8},
    //         {"name": "driving", "size": 100}
    //     ]
    // };
    {
        "name": "country1",
        "children": [
            {"name": "United States", "size": 16}
        ]
    },
    {
        "name": "country2",
        "children": [
            {"name": "Canada", "size": 6}
        ]
    },
    {
        "name": "country3",
        "children": [
            {"name": "errr", "size": 36}
        ]
    }

var margin = {top: 40, right: 40, bottom: 10, left: 50},
    width = $('#water-chart2').width() - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    color = d3.scaleOrdinal().range(d3.schemeCategory20c);

var treemap = d3.treemap().size([width, height]);

var div = d3.select("#water-chart2").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

//get data
var root = d3.hierarchy(treeMap, (d) => d.children)
.sum((d) => d.size);

var tree = treemap(root);

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

var treeMapNode = div.datum(root).selectAll(".treeMapNode")
    .data(tree.leaves())
    .enter().append("div")
    .attr("class", "treeMapNode")
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

    var newRoot = d3.hierarchy(treeMap, (d) => d.children)
.sum(value);

    treeMapNode.data(treemap(newRoot).leaves())
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

