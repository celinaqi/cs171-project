var width = 700,
    height = 400;

var resources = [];

var barChart;

var svg = d3.select("#choropleth").append("svg")
    .attr("transform", "translate(-20, 0)")
    .attr("width", width)
    .attr("height", height);
var projection = d3.geoMercator()
    .scale(120)
    .translate([width / 2, (height / 2) + 40])

var path = d3.geoPath()
    .projection(projection);

var colorChor = d3.scaleQuantize()
    .range(colorbrewer.Oranges["5"])
    .domain([0, 5]);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset(function() {
        return [this.getBBox().height/2 - 10, -5]
    });

var selectedChor;

d3.queue()
    .defer(d3.csv, "data/water-stress-p.csv")
    .defer(d3.csv, "data/country-codes.csv")
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.csv, "data/aquastat.csv")
    .await(initVis);

function initVis(error, stress, codes, world, aquastat) {

    // Convert TopoJSON to GeoJSON
    var world = topojson.feature(world, world.objects.countries).features;

    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append('defs')
        .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);

    var countries = svg.selectAll(".world")
        .data(world);
    countries.enter()
        .append("path")
        .attr("class", "world")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("clip-path", "url(#clip)")
        .on("click", function(d) {
            d3.selectAll(".clicked")
                .classed("clicked", false)
                .attr("fill", function(d) {
                    if (!isNaN(d[selectedChor])) {
                        return colorChor(d[selectedChor]);
                    }
                    else {return "gray"}
                });
            d3.select(this)
                .classed("clicked", true)
                // .attr("fill", "navy");
                // .style("fill", "fff")
                .attr("fill", "white")
                .attr("fill", "url(#diagonalHatch)")
            selectCountry(d);

        });


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
        .data(colorChor.range())
        .enter().append("g");

    legend.append("rect")
        .attr("class", "legendBox")
        .attr("x", 10)
        .attr("y", function(d, i){return i*20 + 290})
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d){ return d; });

    legend.append("text")
        .attr("class", "legendText")
        .attr("x", 40)
        .attr("y", function(d, i) {return i*20 + 305})
        .text(function(d) {
            var legendRange = colorChor.invertExtent(d);
            if (legendRange[1] == 1) {return "Low (<10%)"}
            else if (legendRange[1] == 2) {return "Low to Medium (10-20%)"}
            else if (legendRange[1] == 3) {return "Medium to High (20-40%)"}
            else if (legendRange[1] == 4) {return "High (40-80%)"}
            else if (legendRange[1] == 5) {return "Extremely High (>80%)"}
        })

    svg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 10)
        .attr("y", 270)
        .text("Legend");


    // cleaning aquastat data
    aquastat.forEach(function(d) {
        d.ag_water_withdrawal = +d.ag_water_withdrawal;
        d.ind_water_withdrawal = +d.ind_water_withdrawal;
        d.mun_water_withdrawal = +d.mun_water_withdrawal;
        d.total_water_withdrawal = +d.total_water_withdrawal;
        d.withdrawal_per_capita = +d.withdrawal_per_capita;
    });


    resources = aquastat;

    barChart = new BarChart("barchart", aquastat);

    var defaultyear = 2020;
    updateChoropleth(defaultyear);

}

function updateChoropleth(d) {

    console.log("radio");

    // get value from select box
    selectedChor = d;

    // chloropleth
    svg.selectAll(".world")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition()
        .duration(600)
        .attr("fill", function(d) {
            if (!isNaN(d[selectedChor])) {
                return colorChor(d[selectedChor]);
            }
            else {return "gray"}
        });

    // text for tooltip
    tip.html(function(d) {
        if (d[selectedChor] || d[selectedChor] === 0) {
            return d.name + "<br/>" + "Score: " + d[selectedChor] + "<br/>" + "Stress Level: " + stresslevel(d[selectedChor]);
        }
        else {
            return d.name + "<br/>" + "No Data Found"
        }
    });
    svg.call(tip);

}

// text for stress level in tooltip
function stresslevel (d) {
    if (d <= 1) {return "Low (<10%)"}
    else if (d > 1 && d <= 2) {return "Low to Medium (10-20%)"}
    else if (d > 2 && d <= 3) {return "Medium to High (20-40%)"}
    else if (d > 3 && d <= 4) {return "High (40-80%)"}
    else if (d > 4 && d <= 5) {return "Extremely High (>80%)"}

}

// gathering data for country that was clicked
function selectCountry(d) {

    var countryName = d.name;

    console.log(resources);

    resources.forEach(function(d) {
        if (d.country == countryName) {
            console.log(d);
            barChart.wrangleData(d);
        };
    })

}