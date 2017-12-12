// var colorPie, arc, labelArc;

var selected, pie, Pie;

// bar chart global variables
// var margin1, height1, width1,
//
//     svgCalculator1;

var studentData = [
    {
        "student": "Johanna",
        "consumption": 61,
        "labels": ["Shower", "Flush", "Sink", "Laundry", "Dishes", "Drinking", "Driving"],
        "breakdown": [16, 16, 4, 0.80, 3.43, 0.56, 20]
    },
    {
        "student": "Ronell",
        "consumption": 108,
        "labels": ["Shower", "Flush", "Sink", "Laundry", "Dishes", "Drinking", "Driving"],
        "breakdown": [40, 20, 30, 1.60, 6, 0.63, 10]
    },
    {
        "student": "Zona",
        "consumption": 318,
        "labels": ["Shower", "Flush", "Sink", "Laundry", "Dishes", "Drinking", "Driving"],
        "breakdown": [60, 10, 30, 1.60, 6, 0.63, 210]
    },
    {
        "student": "Fritz",
        "consumption": 45,
        "labels": ["Shower", "Flush", "Sink", "Laundry", "Dishes", "Drinking", "Driving"],
        "breakdown": [20, 10, 6, 0.27, 8.57, 0.25, 0]
    }
];

initialize();

function initialize(){

    var vis = this;
    margin1 = {top: 40, right: 40, bottom: 40, left: 50};
    width1 = 600 - margin1.left - margin1.right;
    height1 = 400 - margin1.top - margin1.bottom;

    svgCalculator1 = d3.select("#water-chart1").append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

    // water calculator default values
    document.getElementById("shower").defaultValue = 10;
    document.getElementById("flush").defaultValue = 5;
    document.getElementById("runningWater").defaultValue = 10;
    // document.getElementById("hose").defaultValue = 0;
    document.getElementById("laundry").defaultValue = 4;
    document.getElementById("dishes").defaultValue = 21;
    document.getElementById("drink").defaultValue = 8;
    document.getElementById("drive").defaultValue = 20;

    vis.x1 = d3.scaleBand()
        .range([0, width1]);

    vis.y1 = d3.scaleLinear()
        .range([height1, 80]);

    vis.xAxis1 = d3.axisBottom()
        .scale(vis.x1);

    vis.yAxis1 = d3.axisLeft()
        .scale(vis.y1);

    vis.svgCalculator1.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + height1 +  ")");

    // pie stuff

    vis.marginPie = {top: 200, right: 10, bottom: 400, left: 10};
    // vis.widthPie = $('#water-chart1-pie').width() - vis.marginPie.left - vis.marginPie.right;

    vis.widthPie = 600 - vis.marginPie.left - vis.marginPie.right;

    vis.heightPie = 500 - vis.marginPie.top - vis.marginPie.bottom;

    vis.svgPie = d3.select("#water-chart1-pie").append("svg")
        .attr("width", vis.widthPie + vis.marginPie.left + vis.marginPie.right)
        .attr("height", vis.heightPie + vis.marginPie.top + vis.marginPie.bottom)
        .append("g")
        // .attr("transform", "translate(" + marginPie.left + "," + marginPie.top + ")");
        .attr("transform", "translate(300, 200)");

    // var radius = Math.min(widthPie, heightPie) / 2;
    vis.radius = 200;

    vis.colorPie = d3.scaleOrdinal()
    // .range(["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"]);
    // .range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"]);
        .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"]);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    vis.arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    vis.labelArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    vis.pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d;
        });

    vis.svgPie.append("g")
        .attr("class", "labelName");
    vis.svgPie.append("g")
        .attr("class", "labelValue");
    vis.svgPie.append("g")
        .attr("class", "lines");

    // bottles

    vis.marginBottle = {top: 10, right: 20, bottom: 10, left: 20};
    vis.widthBottle = 1250 - vis.marginBottle.left - vis.marginBottle.right;
    vis.heightBottle = 600 - vis.marginBottle.top - vis.marginBottle.bottom;

    // water bottles
    vis.svgBottles = d3.select("#water-bottles").append("svg")
        .attr("width", vis.widthBottle + vis.marginBottle.left + vis.marginBottle.right)
        .attr("height", vis.heightBottle + vis.marginBottle.top + vis.marginBottle.bottom)
        .attr("class", "bottles")
        .append("g")
        .attr("transform", "translate(" + vis.marginBottle.left + "," + vis.marginBottle.top + ")");

}

function getValues() {
    var shower = (document.getElementById("shower").value) * 2;
    var flush = (document.getElementById("flush").value) * 2;
    var runningWater = (document.getElementById("runningWater").value) * 2;
    // var runningHose = (document.getElementById("hose").value) * 7 / 7;
    var laundry = (document.getElementById("laundry").value) * 4 / 30;
    var dishes = (document.getElementById("dishes").value) * 6 / 7;
    var drinks = (document.getElementById("drink").value) * 8 / 128;
    var drives = (document.getElementById("drive").value) * 7 / 7;

    waterCalculator(shower, flush, runningWater, laundry, dishes, drinks, drives);
}

function waterCalculator(shower, flush, runningWater, laundry, dishes, drinks, drives) {

    var vis = this;

    var total = Math.round((+shower) + (+flush) + (+runningWater) + (+laundry) + (+dishes) + (+drinks) + (+drives));

    vis.numBottles = total * 7.5;

    $("#water-results-total").html("You directly consume <b>" + total + " gallons of water per day</b>. </br> To put it in context, this means you use the equivalent of <b> " + vis.numBottles + " full water bottles </b> every single day. </br> ");

    // $("#water-results-total").html("You directly consume <b>" + total + " gallons, or </b> <b> " + vis.numBottles + "</b> water bottles' worth of water every single day </br>Here's that amount visualized: ");

    updateVisualization (shower, flush, runningWater, laundry, dishes, drinks, drives, total);

}

function updateVisualization(shower, flush, runningWater, laundry, dishes, drinks, drives, total) {
    var vis = this;

    // delete previous "You" data
    studentData.forEach(function (d, i) {
        if (d.student === "You") {
            studentData.splice(i, 1)
        }
    });

    studentData.push({
        "student": "You",
        "consumption": total,
        "labels": ["Shower", "Flush", "Sink", "Laundry", "Dishes", "Drinking", "Driving"],
        // "breakdown": [shower, flush, runningWater, laundry.toFixed(2), dishes, drinks.toFixed(2), drives]
        "breakdown": [shower, flush, runningWater, laundry.toFixed(2), dishes, drinks.toFixed(2), drives]

    });

    studentData.sort(function (a, b) {
        return b.consumption - a.consumption;
    });

    // bottles

    vis.bottleArray = [];

    for (i = 0; i < vis.numBottles; i++) {
        vis.bottleArray.push(1);
    }

    console.log(vis.bottleArray);


    vis.bottle = vis.svgBottles.selectAll(".bottle")
        .data(vis.bottleArray);

    // console.log(Math.floor(120 % 50));

    vis.bottle.enter()
        .append("image")
        .merge(vis.bottle)
        .attr("class", "bottle")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", function(d, i) {return (i % 60) * 20})
        .transition()
        .delay(function(d, i) {
            return i * 20;
        })
        .attr("y", function(d, i) {
            return Math.floor(i/60) * 40;
        })
        .attr("transform", "translate(0, 0)")
        .attr("xlink:href", "images/bottle.png");

    vis.bottle.exit().remove();

    // bottles

    vis.bottleArray = [];

    for (i = 0; i < vis.numBottles; i++) {
        vis.bottleArray.push(1);
    }

    console.log(vis.bottleArray);


    vis.bottle = vis.svgBottles.selectAll(".bottle")
        .data(vis.bottleArray);

    // console.log(Math.floor(120 % 50));

    vis.bottle.enter()
        .append("image")
        .merge(vis.bottle)
        .attr("class", "bottle")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", function(d, i) {return (i % 60) * 20})
        .transition()
        .delay(function(d, i) {
            return i * 20;
        })
        .attr("y", function(d, i) {
            return Math.floor(i/60) * 40;
        })
        .attr("transform", "translate(0, 0)")
        .attr("xlink:href", "images/bottle.png");

    vis.bottle.exit().remove();

    vis.x1.domain(studentData.map(function (d) {
        return d.student
    }));

    vis.y1.domain([0, d3.max(studentData, function (d) {
        return d.consumption
    })]);





    vis.faucet = vis.svgCalculator1.append("image")
        .attr("class", "faucet")
        .attr("width", 90)
        .attr("height", 90)
        .attr("transform", "translate(-18, -30)")
        .attr("xlink:href", "images/faucet-left.png");

    // Draw bar chart
    vis.bars1 = vis.svgCalculator1.selectAll(".bar")
        .data(studentData);

    // top down
    //
    // vis.bars1.enter()
    //     .append("rect")
    //     .on("click", function () {
    //         console.log("hello");
    //         vis.selected = d3.select(this)._groups[0][0].__data__;
    //         console.log(vis.selected);
    //         updatePie(svgPie, vis.selected, radius, widthPie, colorPie);
    //     })
    //     .merge(vis.bars1)
    //     .transition()
    //     .attr("class", "bar")
    //     .attr("x", function (d) {
    //         return vis.x1(d.student);
    //     })
    //
    //     .attr("y", function (d) {
    //         return vis.y1(d.consumption);
    //     })
    //     .attr("height", function (d) {
    //         return 0
    //         // return height1 - vis.y1(d.consumption);
    //     })
    //     .attr("width", vis.x1.bandwidth() - 10)
    //     .attr("fill", function (d) {
    //         if (d.student === "You") {
    //             return d3.rgb("#ed4933")
    //         }
    //         else {
    //             return "steelblue"
    //         }
    //     })
    //     .attr("fill", function(d) {
    //         if (d.student === "You") {return d3.rgb("#ed4933")}
    //         else {return "steelblue"}})
    //     .attr("width", vis.x1.bandwidth() - 10)
    //     .transition()
    //     .duration(3000)
    //     .delay(function(d, i) {
    //         return i * 50;
    //     })
    //     .attr("y", function (d) {
    //         // return height1;
    //         return vis.y1(d.consumption)
    //     })
    //     .attr("height", function (d) {return height1 - vis.y1(d.consumption)});


    // bottom up
    vis.bars1.enter()
        .append("rect")
        .on("click", function () {
            vis.selected = d3.select(this)._groups[0][0].__data__;
            updatePie(svgPie, vis.selected, radius, widthPie, colorPie);
        })
        .merge(vis.bars1)
        .transition()
        .attr("class", "bar")
        .attr("x", function (d) {
            return vis.x1(d.student);
        })

        .attr("y", function (d) {
            return height1
        })
        .attr("height", function (d) {
            // return height1 - vis.y1(d.consumption);
            return 0;
        })
        .attr("width", vis.x1.bandwidth() - 10)
        .attr("fill", function (d) {
            if (d.student === "You") {
                return d3.rgb("#ed4933")
            }
            else {
                return "blue"
            }
        })
        .attr("fill", function(d) {
            if (d.student === "You") {return d3.rgb("#ed4933")}
            else {return "navy"}})
        .attr("width", vis.x1.bandwidth() - 10)
        .transition()
        .duration(2000)
        .delay(function(d, i) {
            return i * 50;
        })
        .attr("y", function (d) {
            return vis.y1(d.consumption);
        })
        .attr("height", function(d) {return height1 - vis.y1(d.consumption)});



    vis.bars1.exit().remove();



    // bar label (numbers of gallons)

    vis.barlabel = vis.svgCalculator1.selectAll(".barlabel")
        .data(studentData);

    vis.barlabel.enter()
        .append("text")
        .merge(vis.barlabel)
        .attr("class", "barlabel")
        .attr("x", function (d, i) {
            return i * x1.bandwidth() + x1.bandwidth() / 2;
        })
        .transition()
        .duration(2000)
        .attr("y", function (d) {
            return y1(d.consumption) - 5;
        })
        .text(function (d) {
            return d.consumption;
        })
        .attr("font-size", 10)
        .attr("text-anchor", "end");


    vis.barlabel.exit().remove();

    vis.bartitle = vis.svgCalculator1
        .append("text")
        .attr("class", "bartitle")
        .attr("x", width1 / 5)
        .attr("y", -30)
        .text("Consumption of Water (Gallons per Day)");

    bartitle.exit().remove();


    vis.svgCalculator1.select(".x-axis")
        .transition()
        .call(vis.xAxis1);

    // pie

    studentData.forEach(function(d) {
        if (d.student === "You")
        {vis.selected = d};
    });


    updatePie(vis.svgPie, vis.selected, vis.radius, vis.widthPie, vis.colorPie);
    updatePie(vis.svgPie, vis.selected, vis.radius, vis.widthPie, vis.colorPie);

    // vis.svgCalculator1.selectAll(".bar")
    //     .on("click", function () {
    //         console.log("hello");
    //         vis.selected = d3.select(this)._groups[0][0].__data__;
    //         console.log(vis.selected);
    //         updatePie(svgPie, vis.selected, radius, widthPie, colorPie);
    //     });

    vis.svgPie.append("text")
        .attr("class", "wc_title")
        .attr("x", -140)
        .attr("y", -190)
        .text("Composition of Water Consumption Per Day");


}


function updatePie (svgPie, data, radius, widthPie, colorPie) {

    var vis = this;

    Pie = svgPie.selectAll(".arc")
        .data(vis.pie(data.breakdown));

    Pie.enter().append("path")
        .merge(Pie)
        .attr("fill", function(d, i) { return colorPie(i); })
        .attr("d", arc)
        .attr("class", "arc");

    Pie.exit()
        .datum(function(d, i) { return findNeighborArc(i, data1, data0, key) || d; })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();

    Pie.transition()
        .duration(750)
        .attrTween("d", arcTween);

    // var Pie = svgPie.selectAll(".arc")
    //     .data(pie(data.breakdown))
    //     .enter().append("g")
    //     .attr("class", "arc");


    // Pie.append("path")
    //     .attr("d", arc)
    //     .merge(Pie)
    //     .style("fill", function(d) {
    //         return color(d.index)
    //     })
    //     .attr("class", "arc");
    //
    // // Pie.exit().remove();
    //

    // Pie.append("text")
    //     .attr("transform", function(d) {
    //         return "translate(" + labelArc.centroid(d) + ")";
    //     })
    //     .attr("dy", ".35em")
    //     .text(function(d) {
    //         return Math.round(d.data);
    //     })
    //     .attr("fill", "black");


    var name = svgPie.selectAll(".username")
        .data([data.student]);

    name.enter()
        .append("text")
        .merge(name)
        .transition()
        .attr("class", "username wc_title")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        // .attr("font-size", "12px")
        .attr("x", 0)
        .attr("y", -180)
        .text(function(d) {return d});

    name.exit().remove();

    // text inspiration taken from http://bl.ocks.org/juan-cb/1984c7f2b446fffeedde
    var text = svgPie.select(".labelName").selectAll("text")
        .data(pie(data.breakdown));

    text.enter()
        .append("text")
        .attr("dy", ".35em");
    // .text(function(d) {
    //     return (Math.round(d.data));
    // });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = labelArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d, i) {
            if (d.data != 0) {
                return data.labels[i] + ": " + (d.data) + " gal";

            }
        });

    text.exit()
        .remove();

    var legendRectSize = (radius * 0.05);
    var legendSpacing = radius * 0.02;

    var legend = svgPie.selectAll(".legend")
        .data(colorPie.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * colorPie.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", colorPie)
        .style("stroke", colorPie)
    // .attr("transform", "translate(" + (widthPie - 70) + ", 40)");

    legend.append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing + 3)
        // .attr("transform", "translate(" + (widthPie - 70) + ", 40)")
        .text(function(d, i) {
            return data.labels[i];
        })
        .attr("font-size", "12px");


    var polyline = svgPie.select(".lines").selectAll("polyline")
        .data(pie(data.breakdown));

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = labelArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);


                if (d.data != 0) {
                    return [arc.centroid(d2), labelArc.centroid(d2), pos];
                }
            };
        });

    polyline.exit()
        .remove();


}

function findNeighborArc(i, data0, data1, key) {
    var d;
    return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
        : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
            : null;
}

function arcTween(d) {
    var i = d3.interpolate(this._current, d);
    this._current = i(0);
    return function(t) { return arc(i(t)); };
}