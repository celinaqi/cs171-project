
// SVG drawing area

var linemargin = {top: 40, right: 40, bottom: 60, left: 60};

var linewidth = 600 - margin.left - margin.right,
    lineheight = 500 - margin.top - margin.bottom;

var svgLine = d3.select("#line-graph").append("svg")
    .attr("width", linewidth + margin.left + margin.right)
    .attr("height", lineheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svgLine.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height + ")");

svgLine.append("g")
    .attr("class", "y-axis axis");

var resources;

// Date parser
var formatDate = d3.timeFormat("%Y");
var parseDate = d3.timeParse("%Y");


// initializing axes
var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(formatDate);

var yAxis = d3.axisLeft()
    .scale(y);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.percent); });

loadData();


// Load CSV file
function loadData() {
    d3.csv("data/percent_resources_used.csv", function (error, data) {

        data.forEach(function(d) {
            d.value = +d.value;
            return d.year = parseDate(d.year);
        });

        console.log(data);

        var filtered = data.filter(function(d) {
            return (d.value !== 0)
        });

        console.log(filtered);

        resources = d3.nest()
            .key(function(d) {return d.country})
            .entries(filtered);

        console.log(resources);

        x.domain(d3.extent(data, function(d) { return d.country; }));
        y.domain([0, 100]);

        svgLine.select(".x-axis")
            .call(xAxis);

        var lineCountries = svgLine.selectAll(".country")
            .data(resources)
            .enter().append("g")
            .attr("class", "country");

        lineCountries.append("path")
            .attr("class", "line")
            .attr("d", function(d) {return line(d.values.value)})

    })

};