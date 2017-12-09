// tree diagram
// SOURCE: https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

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
                            {"name": "Boiling water before drinking"},
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
                            {"name": "Something about trash"}
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
            { "name": "Inequitable Distribution of Water",
                "children": [
                    {
                        "name": "Too expensive",
                        "children": [
                            {"name": "Something political"},
                            {"name": "Something else political"}
                        ]
                    },
                    { "name": "Privatized",
                        "children": [
                            {"name": "Something political"},
                            {"name": "Something else political"}
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

// Setup SVG Element - Start

var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#tree-diagram").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Setup SVG Element - End

var i = 0,
    duration = 750,
    root;

// Setup tree

var treemap = d3.tree()
    .size([width, height]);

// Get the root

root = d3.hierarchy(treeData, function(d) { return d.children; });

root.x0 = 0;
root.y0 = width / 3;

// Collapse all children, except root's

root.children.forEach(collapse);
// root.children = null;

// Let's draw the tree
draw(root);

// console.log(root);

function draw(source) {

    // Get the treemap, so that we can get nodes and links
    var treeData = treemap(root);

    // Get nodes and links
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Adjust the position of y of each node. Comment out just this line and see how it's different
    nodes.forEach(function(d){ d.y = d.depth * 100});

    // Add unique id for each node, else it won't work
    var node = g.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i);   });


    // Let's append all enter nodes
    var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .on('click',click);

    // Add circle for each enter node, but keep the radius 0

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

    // https://github.com/d3/d3-selection/issues/86 to check what merge does
    var nodeUpdate = nodeEnter.merge(node);

    // Do transition of node to appropriate position
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });


    // Let's update the radius now, which was previously zero.

    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');

    // Let's work on exiting nodes

    // Remove the node

    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);


    // Let's draw links

    var link = g.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Work on enter links, draw straight lines

    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position, now draw a link from node to it's parent
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
    });

}

function diagonal(s, d) {

    // Here we are just drawing lines, we can also draw curves, comment out below path for it.

    var path = `M ${s.x} ${s.y}
          L ${d.x} ${d.y}`;

    // var path = `M ${s.x} ${s.y}
    //         C ${(s.x + d.x) / 2} ${s.y},
    //           ${(s.x + d.x) / 2} ${d.y},
    //           ${d.x} ${d.y}`

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
    // If d has a parent, collapse other children of that parent
    if (d.parent) {
        d.parent.children.forEach(function(element) {
            if (d !== element) {
                collapse(element);
            }
        });
    }

    draw(d);
}

// // tree diagram
// // SOURCE: https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
//
// var treeData =
//     {
//         "name": "You",
//         "children": [
//             {
//                 "name": "Water Contamination",
//                 "children": [
//                     {
//                         "name": "Personal",
//                         "children": [
//                             {"name": "Water filtration technology"},
//                             {"name": "Boiling water before drinking"},
//                             {"name": "Not using the bathroom near sources of drinking water"}
//                         ]
//                     },
//                     {
//                         "name": "Public Policy",
//                         "children": [
//                             {"name": "Improving public infrastructure"},
//                             {"name": "Building latrines"},
//                             {"name": "Regulating responsible use of fertilizers, herbicides, etc."},
//                             {"name": "Not exhausting groundwater resources"}
//                         ]
//                     },
//                     {
//                         "name": "Ecological",
//                         "children": [
//                             {"name": "Plant trees to minimize stormwater runoff"},
//                             {"name": "Something about trash"}
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "name": "Lack of Water",
//                 "children": [
//                     {
//                         "name": "Tropical",
//                         "children": [
//                             {"name" : "Rainwater harvesting"},
//                             {"name" : "Recycling waste water"},
//                             {"name" : "Water-free bathing"}
//                         ]
//                     },
//                     {
//                         "name": "Dry",
//                         "children": [
//                             {"name": "Recycling waste water"},
//                             {"name" : "Water-free bathing"}
//                         ]
//                     },
//                     {
//                         "name": "Near the ocean",
//                         "children": [
//                             {"name": "Desalinization"}
//                         ]
//                     }
//                 ]
//             },
//             { "name": "Inequitable Distribution of Water",
//                 "children": [
//                     {
//                         "name": "Too expensive",
//                         "children": [
//                             {"name": "Something political"},
//                             {"name": "Something else political"}
//                         ]
//                     },
//                     { "name": "Privatized",
//                         "children": [
//                             {"name": "Something political"},
//                             {"name": "Something else political"}
//                         ]
//                     }
//                 ]
//             },
//             { "name": "None",
//                 "children": [
//                     {
//                         "name": "Personal changes",
//                         "children": [
//                             {"name": "Eat less meat"},
//                             {"name": "Take shorter showers"},
//                             {"name": "Don't own a pool"}
//                         ]
//                     },
//                     { "name": "Political activism" },
//                     {
//                         "name": "Fundraising",
//                         "children": [
//                             {"name": "Water innovation"},
//                             {"name": "Policy work"},
//                             {"name": "Relief organizations"}
//                         ]
//                     },
//                     { "name": "Educating others" }
//                 ]
//             }
//         ]
//     };
//
// // set the dimensions and margins of the diagram
// var margin = {top: 40, right: 90, bottom: 50, left: 90},
//     width = 660 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// // declares a tree layout and assigns the size
// var treemap = d3.tree()
//     .size([width, height]);
//
// //  assigns the data to a hierarchy using parent-child relationships
// var nodes = d3.hierarchy(treeData);
//
// // maps the node data to the tree layout
// nodes = treemap(nodes);
//
// // append the svg obgect to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg1 = d3.select("#tree-diagram").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom),
//     g = svg1.append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");
//
// // adds the links between the nodes
// var link = g.selectAll(".link")
//     .data( nodes.descendants().slice(1))
//     .enter().append("path")
//     .attr("class", "link")
//     .attr("d", function(d) {
//         return "M" + d.x + "," + d.y
//             + "C" + d.x + "," + (d.y + d.parent.y) / 2
//             + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
//             + " " + d.parent.x + "," + d.parent.y;
//     });
//
// // adds each node as a group
// var node = g.selectAll(".node")
//     .data(nodes.descendants())
//     .enter().append("g")
//     .attr("class", function(d) {
//         return "node" +
//             (d.children ? " node--internal" : " node--leaf"); })
//     .attr("transform", function(d) {
//         return "translate(" + d.x + "," + d.y + ")"; });
//
// // adds the circle to the node
// node.append("circle")
//     .attr("r", 10)
//     .on("click", click);
//
// // adds the text to the node
// node.append("text")
//     .attr("dy", ".35em")
//     .attr("y", function(d) { return d.children ? -20 : 20; })
//     .style("text-anchor", "middle")
//     .text(function(d) { return d.data.name; });
//
// function click(d) {
//     $("#tree-fact").html("fact fact fact");
// }


// // tree diagram
// // SOURCE: https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
//
// var treeData =
//     {
//         "name": "You",
//         "children": [
//             {
//                 "name": "Water Contamination",
//                 "children": [
//                     {
//                         "name": "Personal",
//                         "children": [
//                             {"name": "Water filtration technology"},
//                             {"name": "Boiling water before drinking"},
//                             {"name": "Not using the bathroom near sources of drinking water"}
//                         ]
//                     },
//                     {
//                         "name": "Public Policy",
//                         "children": [
//                             {"name": "Improving public infrastructure"},
//                             {"name": "Building latrines"},
//                             {"name": "Regulating responsible use of fertilizers, herbicides, etc."},
//                             {"name": "Not exhausting groundwater resources"}
//                         ]
//                     },
//                     {
//                         "name": "Ecological",
//                         "children": [
//                             {"name": "Plant trees to minimize stormwater runoff"},
//                             {"name": "Something about trash"}
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "name": "Lack of Water",
//                 "children": [
//                     {
//                         "name": "Tropical",
//                             "children": [
//                                 {"name" : "Rainwater harvesting"},
//                                 {"name" : "Recycling waste water"},
//                                 {"name" : "Water-free bathing"}
//                                 ]
//                     },
//                     {
//                         "name": "Dry",
//                             "children": [
//                                 {"name": "Recycling waste water"},
//                                 {"name" : "Water-free bathing"}
//                             ]
//                     },
//                     {
//                         "name": "Near the ocean",
//                             "children": [
//                                 {"name": "Desalinization"}
//                             ]
//                     }
//                 ]
//             },
//             { "name": "Inequitable Distribution of Water",
//                 "children": [
//                     {
//                         "name": "Too expensive",
//                         "children": [
//                             {"name": "Something political"},
//                             {"name": "Something else political"}
//                         ]
//                     },
//                     { "name": "Privatized",
//                         "children": [
//                             {"name": "Something political"},
//                             {"name": "Something else political"}
//                         ]
//                     }
//                 ]
//             },
//             { "name": "None",
//                 "children": [
//                     {
//                         "name": "Personal changes",
//                         "children": [
//                             {"name": "Eat less meat"},
//                             {"name": "Take shorter showers"},
//                             {"name": "Don't own a pool"}
//                         ]
//                     },
//                     { "name": "Political activism" },
//                     {
//                         "name": "Fundraising",
//                         "children": [
//                             {"name": "Water innovation"},
//                             {"name": "Policy work"},
//                             {"name": "Relief organizations"}
//                         ]
//                     },
//                     { "name": "Educating others" }
//                 ]
//             }
//         ]
//     };
//
// // Set the dimensions and margins of the diagram
// var margin = {top: 20, right: 90, bottom: 30, left: 90},
//     width = 1000 - margin.left - margin.right,
//     height = 600 - margin.top - margin.bottom;
//
// // append the svg object to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg1 = d3.select("#tree-diagram").append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate("
//         + margin.left + "," + margin.top + ")");
//
// var i = 0,
//     duration = 750,
//     root;
//
// // declares a tree layout and assigns the size
// var treemap = d3.tree().size([height, width]);
//
// // Assigns parent, children, height, depth
// root = d3.hierarchy(treeData, function(d) { return d.children; });
// root.x0 = height / 2;
// root.y0 = 0;
//
// // Collapse after the second level
// root.children.forEach(collapse);
//
// update(root);
//
// // Collapse the node and all it's children
// function collapse(d) {
//     if(d.children) {
//         d._children = d.children
//         d._children.forEach(collapse)
//         d.children = null
//     }
// }
//
// function update(source) {
//
//     // Assigns the x and y position for the nodes
//     var treeData = treemap(root);
//
//     // Compute the new tree layout.
//     var nodes = treeData.descendants(),
//         links = treeData.descendants().slice(1);
//
//     // Normalize for fixed-depth.
//     nodes.forEach(function(d){ d.y = d.depth * 180});
//
//     // ****************** Nodes section ***************************
//
//     // Update the nodes...
//     var node = svg1.selectAll('g.node')
//         .data(nodes, function(d) {return d.id || (d.id = ++i); });
//
//     // Enter any new modes at the parent's previous position.
//     var nodeEnter = node.enter().append('g')
//         .attr('class', 'node')
//         .attr("transform", function(d) {
//             return "translate(" + source.y0 + "," + source.x0 + ")";
//         })
//         .on('click', click);
//
//     // Add Circle for the nodes
//     nodeEnter.append('circle')
//         .attr('class', 'node')
//         .attr('r', 1e-6)
//         .style("fill", function(d) {
//             return d._children ? "lightsteelblue" : "#fff";
//         });
//
//     // Add labels for the nodes
//     nodeEnter.append('text')
//         .attr("dy", ".35em")
//         .attr("x", function(d) {
//             return d.children || d._children ? -13 : 13;
//         })
//         .attr("text-anchor", function(d) {
//             return d.children || d._children ? "end" : "start";
//         })
//         .text(function(d) { return d.data.name; });
//
//     // UPDATE
//     var nodeUpdate = nodeEnter.merge(node);
//
//     // Transition to the proper position for the node
//     nodeUpdate.transition()
//         .duration(duration)
//         .attr("transform", function(d) {
//             return "translate(" + d.y + "," + d.x + ")";
//         });
//
//     // Update the node attributes and style
//     nodeUpdate.select('circle.node')
//         .attr('r', 10)
//         .style("fill", function(d) {
//             return d._children ? "lightsteelblue" : "#fff";
//         })
//         .attr('cursor', 'pointer');
//
//
//     // Remove any exiting nodes
//     var nodeExit = node.exit().transition()
//         .duration(duration)
//         .attr("transform", function(d) {
//             return "translate(" + source.y + "," + source.x + ")";
//         })
//         .remove();
//
//     // On exit reduce the node circles size to 0
//     nodeExit.select('circle')
//         .attr('r', 1e-6);
//
//     // On exit reduce the opacity of text labels
//     nodeExit.select('text')
//         .style('fill-opacity', 1e-6);
//
//     // ****************** links section ***************************
//
//     // Update the links...
//     var link = svg1.selectAll('path.link')
//         .data(links, function(d) { return d.id; });
//
//     // Enter any new links at the parent's previous position.
//     var linkEnter = link.enter().insert('path', "g")
//         .attr("class", "link")
//         .attr('d', function(d){
//             var o = {x: source.x0, y: source.y0}
//             return diagonal(o, o)
//         });
//
//     // UPDATE
//     var linkUpdate = linkEnter.merge(link);
//
//     // Transition back to the parent element position
//     linkUpdate.transition()
//         .duration(duration)
//         .attr('d', function(d){ return diagonal(d, d.parent) });
//
//     // Remove any exiting links
//     var linkExit = link.exit().transition()
//         .duration(duration)
//         .attr('d', function(d) {
//             var o = {x: source.x, y: source.y}
//             return diagonal(o, o)
//         })
//         .remove();
//
//     // Store the old positions for transition.
//     nodes.forEach(function(d){
//         d.x0 = d.x;
//         d.y0 = d.y;
//     });
//
//     // Creates a curved (diagonal) path from parent to the child nodes
//     function diagonal(s, d) {
//
//         path = `M ${s.y} ${s.x}
//         C ${(s.y + d.y) / 2} ${s.x},
//         ${(s.y + d.y) / 2} ${d.x},
//               ${d.y} ${d.x}`
//
//         return path
//     }
//
//     // Toggle children on click.
//     function click(d) {
//         if (d.children) {
//             d._children = d.children;
//             d.children = null;
//         } else {
//             d.children = d._children;
//             d._children = null;
//         }
//         update(d);
//     }
// }
