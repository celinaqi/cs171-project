// tree diagram

var treeData =
    {
        "name": "You",
        "children": [
            {
                "name": "Water Contamination",
                "children": [
                    {
                        "name": "Personal",
                        "children": [
                            {"name": "Water filtration technology"},
                            {"name": "Boiling before drinking"},
                            {"name": "Not using the bathroom near sources of drinking water"}
                        ]
                    },
                    {
                        "name": "Public Policy",
                        "children": [
                            {"name": "Improving public infrastructure"},
                            {"name": "Building latrines"},
                            {"name": "Regulating responsible use of fertilizers, herbicides, etc."},
                            {"name": "Not exhausting groundwater resources"}
                        ]
                    },
                    {
                        "name": "Ecological",
                        "children": [
                            {"name": "Plant trees to minimize stormwater runoff"},
                            {"name": "Manage trash disposal properly"}
                        ]
                    }
                ]
            },
            {
                "name": "Lack of Water",
                "children": [
                    {
                        "name": "Tropical",
                        "children": [
                            {"name" : "Rainwater harvesting"},
                            {"name" : "Recycling waste water"},
                            {"name" : "Water-free bathing"}
                        ]
                    },
                    {
                        "name": "Dry",
                        "children": [
                            {"name": "Recycling waste water"},
                            {"name" : "Water-free bathing"}
                        ]
                    },
                    {
                        "name": "Near the ocean",
                        "children": [
                            {"name": "Desalinization"}
                        ]
                    }
                ]
            },
            { "name": "Inequitable Water Distribution",
                "children": [
                    {
                        "name": "Too expensive",
                        "children": [
                            {"name": "Consider water harvesting"},
                            {"name": "Call government officials"}
                        ]
                    },
                    { "name": "Privatized",
                        "children": [
                            {"name": "Call government officials"},
                            {"name": "Compare utilities vs. bottled water prices"}
                        ]
                    }
                ]
            },
            { "name": "None",
                "children": [
                    {
                        "name": "Personal changes",
                        "children": [
                            {"name": "Eat less meat"},
                            {"name": "Take shorter showers"},
                            {"name": "Don't own a pool"}
                        ]
                    },
                    { "name": "Political activism" },
                    {
                        "name": "Fundraising",
                        "children": [
                            {"name": "Water innovation"},
                            {"name": "Policy work"},
                            {"name": "Relief organizations"}
                        ]
                    },
                    { "name": "Educating others" }
                ]
            }
        ]
    };

// Draw SVG
var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#tree-diagram").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// Create tree

var treemap = d3.tree()
    .size([width, height]);

// Identify root of treeData
root = d3.hierarchy(treeData, function(d) { return d.children; });

root.x0 = 0;
root.y0 = width / 3;

root.children.forEach(collapse);

// Draw tree
draw(root);

function draw(source) {

    // Call treeData
    var treeData = treemap(root);

    // Get nodes and links
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Take up entire div or not
    // nodes.forEach(function(d){ d.y = d.depth * 100});

    var node = g.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i);   });

    // Append nodes
    var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .on('click',click);

    // Append circles with radius 0 to nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add text
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { return d.data.name; });

    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });


    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');

    // On exit
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

    // Circle size
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // Opacity
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // Create links
    var link = g.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

    // Update links
    var linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
    });

}

function diagonal(s, d) {

    // Draw link path

    // var path = `M ${s.x} ${s.y}
    //       L ${d.x} ${d.y}`;

    // var path = `M ${s.x} ${s.y}
    //         C ${(s.x + d.x) / 2} ${s.y},
    //           ${(s.x + d.x) / 2} ${d.y},
    //           ${d.x} ${d.y}`

    var path = `M ${s.x} ${s.y}
    C ${s.x} ${(s.y + d.y) / 2},
    ${d.x} ${(s.y + d.y) / 2},
    ${d.x} ${d.y}`
    

    return path
}

function collapse(d) {
    if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function click(d)
{
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    // Collapse other children of d's parent if d is clicked
    if (d.parent) {
        d.parent.children.forEach(function(element) {
            if (d !== element) {
                collapse(element);
            }
        });
    }

    draw(d);
}