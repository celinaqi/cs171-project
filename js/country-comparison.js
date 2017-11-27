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
    width2 = $('#water-chart2').width() - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

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
    .attr("x", -180)
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
    .attr("x", 300)
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
