var width = 1000,
    height = 500;

var svg = d3.select("#choropleth").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleQuantize()
    .range(colorbrewer.Reds["5"])
    .domain([0, 5]);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset(function() {
        return [this.getBBox().height/2, 0]
    });

d3.queue()
    .defer(d3.csv, "data/water-stress-p.csv")
    .defer(d3.csv, "data/country-codes.csv")
    .defer(d3.json, "data/world-110m.json")
    .await(initVis);

function initVis(error, stress, codes, world) {

    // Convert TopoJSON to GeoJSON
    var world = topojson.feature(world, world.objects.countries).features;

    var countries = svg.selectAll(".world")
        .data(world);
    countries.enter()
        .append("path")
        .attr("class", "world")
        .attr("d", path)
        .attr("stroke", "white");



    // integrating ISO codes for countries into topojson dataset
    codes.forEach(function(d) {
        d.numeric = +d.numeric;
        var name = d.name;
        var numcode = d.numeric;

        stress.forEach(function(e) {
            // e[2015] = +e[2015];

            if (name === e.name) {
                e.country_num = numcode;
            };

            world.forEach(function(f) {
                if (f.id === e.country_num) {
                    f.name = e.name;
                    f[2020] = +e[2020];
                    f[2030] = +e[2030];
                    f[2040] = +e[2040];
                }
            })
        })

        world.forEach(function(f) {
            if (numcode == f.id) {
                f.name = name;
            }

            else if (f.id == -99) {
                f.name = "No Country Found"
            }
        });

    });

    // create legend
    var legend = svg.selectAll(".legend")
        .data(color.range())
        .enter().append("g");

    legend.append("rect")
        .attr("class", "legendBox")
        .attr("x", 100)
        .attr("y", function(d, i){return i*20 + 280})
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d){ return d; });

    legend.append("text")
        .attr("class", "legendText")
        .attr("x", 130)
        .attr("y", function(d, i) {return i*20 + 295})
        .text(function(d) {
            var legendRange = color.invertExtent(d);
            if (legendRange[1] == 1) {return "Low (<10%)"}
            else if (legendRange[1] == 2) {return "Low to Medium (10-20%)"}
            else if (legendRange[1] == 3) {return "Medium to High (20-40%)"}
            else if (legendRange[1] == 4) {return "High (40-80%)"}
            else if (legendRange[1] == 5) {return "Extremely High (>80%)"}
        })

    svg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 100)
        .attr("y", 270)
        .text("Legend");



    console.log(world);

    updateChoropleth();

}

function updateChoropleth() {

    // get value from select box
    selected = $("#select").val();

    // chloropleth


    svg.selectAll(".world")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition()
        .duration(600)
        .attr("fill", function(d) {
            if (!isNaN(d[selected])) {
                return color(d[selected]);
            }
            else {return "gray"}
        });

    tip.html(function(d) {
        if (d[selected] || d[selected] === 0) {
            return d.name + "<br/>" + "Score: " + d[selected] + "<br/>" + "Stress Level: " + stresslevel(d[selected]);
        }
        else {
            return d.name + "<br/>" + "No Data Found"
        }
    });
    svg.call(tip);

}

function stresslevel (d) {
    if (d <= 1) {return "Low (<10%)"}
    else if (d > 1 && d <= 2) {return "Low to Medium (10-20%)"}
    else if (d > 2 && d <= 3) {return "Medium to High (20-40%)"}
    else if (d > 3 && d <= 4) {return "High (40-80%)"}
    else if (d > 4 && d <= 5) {return "Extremely High (>80%)"}



}
