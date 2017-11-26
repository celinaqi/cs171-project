// water calculator

function getValues() {
    var shower = document.getElementById("shower").value;
    var flush = document.getElementById("flush").value;
    var runningWater = document.getElementById("runningWater").value;
    var runningHose = document.getElementById("hose").value;
    var laundry = document.getElementById("laundry").value;
    var dishes = document.getElementById("dishes").value;
    var drinks = document.getElementById("drink").value;
    var drives = document.getElementById("drive").value;

    waterCalculator(shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives);
}

function waterCalculator(shower, flush, runningWater, runningHose, laundry, dishes, drinks, drives) {
    // $("#water-results-shower").html("<b>Showers: </b>" + (+shower * 2) + " gallons/day");
    // $("#water-results-flush").html("<b>Toilet flushes: </b>" + (+flush * 2) + " gallons/day");
    // $("#water-results-runningWater").html("<b>Running water: </b>" + (+runningWater * 2) + " gallons/day");
    // $("#water-results-laundry").html("<b>Laundry: </b>" + (+laundry * 4) + " gallons/month");
    // $("#water-results-dishes").html("<b>Dishwasher: </b>" + (+dishes) + " gallons/week");
    var total = Math.round((+shower * 2) + (+flush * 2) + (+runningWater * 2) + (+runningHose * 7 / 7) + (+laundry * 4 / 30) + (+dishes / 7) + (+drinks * 8 / 128) + (+drives * 7 / 7));
    $("#water-results-total").html("You directly consume <b>" + total + " gallons of water per day</b>. Here's how that compares to other Harvard students:");

    updateVisualization (total);

    $("#water-results-indirect").html("However, this is just your measurable direct water consumption. You also consume water in other ways:<ul><li><b>Food</b>. It requires 11 gallons of water to produce 1 slice of bread, and 1,799 gallons of water to produce 1lb of beef.</li><li><b>Electricity</b>. The average American household uses 120,000 - 300,000 gallons of water's worth of electricity per year (Boston specifically gets its electricity from hydropower).</li><li><b>Material consumption</b>. It takes about 100 gallons of water to produce 1lb of cotton material, which is representative of other fabrics and furniture.</li><li><b>Not recycling</b>. Forgetting to recycle paper, plastic, and bottles can waste an additional 15 gallons of water/day.</li><li><b>Going to Harvard</b>. Harvard uses water to irrigate its lawns, clean buildings, wash dining hall dishes, fill pools, etc.</li></ul>And so on. When we account for both direct and virtual water consumption, experts estimate <b>the average American consumes 2,200 gallons of water per day</b>.</br>");
    $("#water-comparison").html("This is how water consumption per capita per day in the United States compares to water consumption in other countries:");
}

function updateVisualization(total) {

    var studentData = [
        {"student" : "Harvard student 1", "consumption" : 94},
        {"student" : "Harvard student 2", "consumption" : 71},
        {"student" : "Harvard student 3", "consumption" : 63},
        {"student" : "Harvard student 4", "consumption" : 46}
    ];

    studentData.push({"student" : "You", "consumption" : total});

    studentData.sort(function(a,b) {
        return b.consumption - a.consumption;
    });

    var margin1 = {top: 60, right: 20, bottom: 40, left: 80},
        width1 = $('#water-chart1').width() - margin1.left - margin1.right,
        height1 = 200 - margin1.top - margin1.bottom;

    var svgCalculator1 = d3.select("#water-chart1").append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

    // set scales
    var x1 = d3.scaleBand()
        .range([0, width1])
        .domain(studentData.map(function(d) {
            return d.student;
        }));

    var y1 = d3.scaleLinear()
        .range([height1, 0])
        .domain([0, d3.max(studentData, function(d) {
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
        .attr("x", -100)
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

    bars1.exit().remove();

    bars1.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars1)
        .attr("x", function(d) {
            return x1(d.student);
        })
        .attr("y", function(d) {
            return y1(d.consumption);
        })
        .attr("height", function(d) {
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
            return i * x1.bandwidth() + x1.bandwidth()/2;
        })
        .attr("y", function (d) {
            return y1(d.consumption) - 5;
        })
        .text(function(d) {
            return d.consumption;
        })
        .attr("font-size", 10)
        .attr("text-anchor", "end");

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
        width2 = $('#water-chart2').width() - margin2.left - margin2.right,
        height2 = 200 - margin2.top - margin2.bottom;

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
        .attr("x", -100)
        .attr("y", -30)
        .attr("transform", "rotate(-90)")
        .text("% US consumption");

    svgCalculator2.append("text")
        .attr("class", "label")
        .attr("x", width2 / 2 - 25)
        .attr("y", height2 + 35)
        .text("Country");

    svgCalculator2.append("text")
        .attr("class", "title")
        .attr("x", 20)
        .attr("y", -20)
        .text("Countries' Percentage of United States' Water Consumptions Per Capita Per Day");

    var bars2 = svgCalculator2.selectAll(".bar")
        .data(countryData);

    bars2.exit().remove();

    bars2.enter()
        .append("rect")
        .attr("class", "bar")
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
        .attr("width", x2.bandwidth() - 10);

    xAxisGroup2 = svgCalculator2.select(".x-axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    yAxisGroup2 = svgCalculator2.select(".y-axis")
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
        .attr("font-size", 10);
}
