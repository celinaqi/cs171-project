var color, arc, labelArc;

var selected, pie, Pie;


// water calculator default values
document.getElementById("shower").defaultValue = 10;
document.getElementById("flush").defaultValue = 5;
document.getElementById("runningWater").defaultValue = 10;
document.getElementById("hose").defaultValue = 0;
document.getElementById("laundry").defaultValue = 4;
document.getElementById("dishes").defaultValue = 21;
document.getElementById("drink").defaultValue = 8;
document.getElementById("drive").defaultValue = 20;


function getValues() {
    var shower = (document.getElementById("shower").value) * 2;
    var flush = (document.getElementById("flush").value) * 2;
    var runningWater = (document.getElementById("runningWater").value) * 2;
    var runningHose = (document.getElementById("hose").value) * 7 / 7;
    var laundry = (document.getElementById("laundry").value) * 4 / 30;
    var dishes = (document.getElementById("dishes").value) * 6 / 7;
    var drinks = (document.getElementById("drink").value) * 8 / 128;
    var drives = (document.getElementById("drive").value) * 7 / 7;

    waterCalculator(shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives);
}

function waterCalculator(shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives) {
    // $("#water-results-shower").html("<b>Showers: </b>" + (+shower * 2) + " gallons/day");
    // $("#water-results-flush").html("<b>Toilet flushes: </b>" + (+flush * 2) + " gallons/day");
    // $("#water-results-runningWater").html("<b>Running water: </b>" + (+runningWater * 2) + " gallons/day");
    // $("#water-results-laundry").html("<b>Laundry: </b>" + (+laundry * 4) + " gallons/month");
    // $("#water-results-dishes").html("<b>Dishwasher: </b>" + (+dishes) + " gallons/week");
    var total = Math.round((+shower) + (+flush) + (+runningWater) + (+runningHose) + (+laundry) + (+dishes) + (+drinks) + (+drives));
    $("#water-results-total").html("You directly consume <b>" + total + " gallons of water per day</b>. Here's how that compares to other Harvard students:");

    updateVisualization (shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives, total);
}

function updateVisualization(shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives, total) {

    var studentData = [
        {
            "student": "Harvard student 1",
            "consumption": 238,
            "labels": ["shower", "flush", "sink", "hose", "laundry", "dishes", "drinking", "driving"],
            "breakdown": [16, 14, 30, 10, 0.4, 6, 0.56, 107.5]
        },
        {
            "student": "Harvard student 2",
            "consumption": 87,
            "labels": ["shower", "flush", "sink", "hose", "laundry", "dishes", "drinking", "driving"],
            "breakdown": [30, 8, 10, 0, 0.4, 0.86, 0.75, 37]
        },
        {
            "student": "Harvard student 3",
            "consumption": 65,
            "labels": ["shower", "flush", "sink", "hose", "laundry", "dishes", "drinking", "driving"],
            "breakdown": [40, 10, 6, 0, 0.27, 0.86, 0.56, 7]
        },
        {
            "student": "Harvard student 4",
            "consumption": 47,
            "labels": ["shower", "flush", "sink", "hose", "laundry", "dishes", "drinking", "driving"],
            "breakdown": [10, 8, 8, 0, 0.13, 0, 0.62, 20]
        }
    ];

    studentData.push({
        "student": "You",
        "consumption": total,
        "labels": ["shower", "flush", "sink", "hose", "laundry", "dishes", "drinking", "driving"],
        "breakdown": [shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives]
    });

    console.log(studentData);

    studentData.sort(function (a, b) {
        return b.consumption - a.consumption;
    });

    var margin1 = {top: 40, right: 40, bottom: 40, left: 40},
        width1 = $('#water-chart1').width() - margin1.left - margin1.right,
        height1 = 300 - margin1.top - margin1.bottom;

    var svgCalculator1 = d3.select("#water-chart1").append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

    // set scales
    var x1 = d3.scaleBand()
        .range([0, width1])
        .domain(studentData.map(function (d) {
            return d.student;
        }));

    var y1 = d3.scaleLinear()
        .range([height1, 0])
        .domain([0, d3.max(studentData, function (d) {
            return d.consumption;
        })]);

    var xAxis1 = d3.axisBottom()
        .scale(x1);

    var yAxis1 = d3.axisLeft()
        .scale(y1);

    var xAxisGroup1 = svgCalculator1.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + height1 + ")");

    var yAxisGroup1 = svgCalculator1.append("g")
        .attr("class", "y-axis axis");

    svgCalculator1.append("text")
        .attr("class", "label")
        .attr("x", -130)
        .attr("y", -30)
        .attr("transform", "rotate(-90)")
        .text("Gallons per day");

    svgCalculator1.append("text")
        .attr("class", "label")
        .attr("x", width1 / 2 - 35)
        .attr("y", height1 + 35)
        .text("Peer comparison");

    svgCalculator1.append("text")
        .attr("class", "title")
        .attr("x", width1 / 8)
        .attr("y", -20)
        .text("Comparison of Water Consumption Amongst Harvard Students");

    var bars1 = svgCalculator1.selectAll(".bar")
        .data(studentData);

    bars1.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars1)
        .attr("x", function (d) {
            return x1(d.student);
        })
        .attr("y", function (d) {
            return y1(d.consumption);
        })
        .attr("height", function (d) {
            return height1 - y1(d.consumption);
        })
        .attr("width", x1.bandwidth() - 10);

    xAxisGroup1 = svgCalculator1.select(".x-axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis1);

    yAxisGroup1 = svgCalculator1.select(".y-axis")
        .call(yAxis1);

    // Add numbers
    var numbers1 = svgCalculator1.selectAll("text.numbers1")
        .data(studentData)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return i * x1.bandwidth() + x1.bandwidth() / 2;
        })
        .attr("y", function (d) {
            return y1(d.consumption) - 5;
        })
        .text(function (d) {
            return d.consumption;
        })
        .attr("font-size", 10)
        .attr("text-anchor", "end");

    // PIE STUFF

    var marginPie = {top: 120, right: 40, bottom: 40, left: 150},
        widthPie = $('#water-chart1-pie').width() - marginPie.left - marginPie.right,
        heightPie = 300 - marginPie.top - marginPie.bottom;

    var svgPie = d3.select("#water-chart1-pie").append("svg")
        .attr("width", widthPie + marginPie.left + marginPie.right)
        .attr("height", heightPie + marginPie.top + marginPie.bottom)
        .append("g")
        .attr("transform", "translate(" + marginPie.left + "," + marginPie.top + ")");

    // var radius = Math.min(widthPie, heightPie) / 2;
    var radius = 100;

    svgPie.append("text")
        .attr("class", "title")
        .attr("x", widthPie / 8)
        .attr("y", -100)
        .text("Composition of Water Consumption");

    color = d3.scaleOrdinal()
        .range(["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"]);

    arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius (radius - 40);

    studentData.forEach(function(d) {
        if (d.student === "You")
        {selected = d};
    });
    console.log(selected);

    pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d;
        });

    updatePie(svgPie, selected, radius, widthPie, color);

    svgCalculator1.selectAll(".bar").on("click", function () {
        selected = d3.select(this)._groups[0][0].__data__;
        console.log(selected);
        updatePie(svgPie, selected, radius, widthPie, color);
    });
}

    // function createPie(svgPie, data, radius, widthPie) {
    //     // // var color = d3.scaleOrdinal(d3.schemeCategory10)
    //     console.log("pie");
    //
    //
    //     updatePie(svgPie, data, radius, widthPie, color);
    // }
    //
    function updatePie (svgPie, data, radius, widthPie, color) {
    console.log("pie2");

        Pie = svgPie.selectAll(".arc")
            .data(pie(data.breakdown));

        Pie.enter().append("path")
            .merge(Pie)
            .attr("fill", function(d, i) { return color(i); })
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

        console.log(pie(data.breakdown));

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

        Pie.append("text")
            .attr("transform", function(d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function(d) {
                return Math.round(d.data);
            })
            .attr("fill", "black");

        // Legend
        var legendRectSize = 18;
        var legendSpacing = 4;

        var legend = svgPie.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return "translate(" + horz + "," + vert + ")";
            });

        legend.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", color)
            .style("stroke", color)
            .attr("transform", "translate(" + (widthPie - 70) + ", 40)");

        legend.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
            .attr("transform", "translate(" + (widthPie - 70) + ", 40)")
            .text(function(d, i) {
                return data.labels[i];
            });

        Pie.exit().remove();
        legend.exit().remove();

    }

    // function pieChange(data) {
    // Pie = Pie.data(pie(data.breakdown));
    // Pie.transition().attr("d", arc);
    // }

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