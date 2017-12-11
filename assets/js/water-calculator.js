// bar chart global variables
var margin1, height1, width1, svgCalculator1;
var studentData = [
    {
        "student": "Johanna",
        "consumption": 61,
        "labels": ["shower", "flush", "sink", "laundry", "dishes", "drinking", "driving"],
        "breakdown": [16, 16, 4, 0.80, 3.43, 0.56, 20]
    },
    {
        "student": "Ronell",
        "consumption": 108,
        "labels": ["shower", "flush", "sink", "laundry", "dishes", "drinking", "driving"],
        "breakdown": [40, 20, 30, 1.60, 6, 0.63, 10]
    },
    {
        "student": "Zona",
        "consumption": 318,
        "labels": ["shower", "flush", "sink", "laundry", "dishes", "drinking", "driving"],
        "breakdown": [60, 10, 30, 1.60, 6, 0.63, 210]
    },
    {
        "student": "Fritz",
        "consumption": 45,
        "labels": ["shower", "flush", "sink", "laundry", "dishes", "drinking", "driving"],
        "breakdown": [20, 10, 6, 0.27, 8.57, 0.25, 0]
    }
];

initialize();

function initialize(){

    var vis = this;
    margin1 = {top: 40, right: 40, bottom: 40, left: 50};
    width1 = $('#water-chart1').width() - margin1.left - margin1.right;
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
    var total = Math.round((+shower) + (+flush) + (+runningWater) + (+laundry) + (+dishes) + (+drinks) + (+drives));
    $("#water-results-total").html("You directly consume <b>" + total + " gallons of water per day</b>. Here's how that compares to other Harvard students:");

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
        "labels": ["shower", "flush", "sink", "laundry", "dishes", "drinking", "driving"],
        "breakdown": [shower, flush, runningWater, laundry.toFixed(2), dishes, drinks.toFixed(2), drives]
    });

    studentData.sort(function (a, b) {
        return b.consumption - a.consumption;
    });

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
        .attr("xlink:href", "images/faucet.png");

    // Draw bar chart
    vis.bars1 = vis.svgCalculator1.selectAll(".bar")
        .data(studentData);

    vis.bars1.enter()
        .append("rect")
        .merge(vis.bars1)
        .transition()
        .attr("class", "bar")
        .attr("x", function (d) {
            return vis.x1(d.student);
        })

        .attr("y", function (d) {
            return vis.y1(d.consumption);
        })
        .attr("height", function (d) {
            return 0
            // return height1 - vis.y1(d.consumption);
        })
<<<<<<< HEAD
        .attr("width", vis.x1.bandwidth() - 10)
        .attr("fill", function (d) {
            if (d.student === "You") {
                return d3.rgb("#ed4933")
            }
            else {
                return "steelblue"
            }
        })
=======
        .attr("fill", function(d) {
            if (d.student === "You") {return d3.rgb("#ed4933")}
            else {return "steelblue"}})
        .attr("width", vis.x1.bandwidth() - 10)
        .transition()
        .duration(3000)
        .delay(function(d, i) {
            return i * 50;
        })
        .attr("y", function (d) {
            // return height1;
            return vis.y1(d.consumption)
        })
        .attr("height", function (d) {return height1 - vis.y1(d.consumption)});
>>>>>>> eb78ac884d5edbc6933e1082413296e19bf72940

    vis.bars1.exit().remove();

    // bar label (numbers of gallons)

    vis.barlabel = vis.svgCalculator1.selectAll(".barlabel")
        .data(studentData);

    vis.barlabel.enter()
        .append("text")
        .merge(vis.barlabel)
        .transition()
        .attr("class", "barlabel")
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


    vis.barlabel.exit().remove();

    vis.bartitle = vis.svgCalculator1
        .append("text")
        .attr("class", "bartitle")
        .attr("x", width1 / 5)
        .attr("y", -10)
        .text("Consumption of Water (Gallons per Day)");

    bartitle.exit().remove();


    vis.svgCalculator1.select(".x-axis")
        .transition()
        .call(vis.xAxis1);
}