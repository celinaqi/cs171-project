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
    .range(colorbrewer.Blues["9"])
    .domain([0, 100]);

d3.queue()
    .defer(d3.csv, "data/improved-water.csv")
    .defer(d3.csv, "data/country-codes.csv")
    .defer(d3.json, "data/world-110m.json")
    .await(initVis);

function initVis(error, improved, codes, world) {

    // Convert TopoJSON to GeoJSON
    var world = topojson.feature(world, world.objects.countries).features;

    var countries = svg.selectAll(".world")
        .data(world);
    countries.enter()
        .append("path")
        .attr("class", "world")
        .attr("d", path);



    // integrating ISO codes for countries into topojson dataset
    codes.forEach(function(d) {
        d.numeric = +d.numeric;
        var alphacode = d.alpha_3;
        var numcode = d.numeric;

        improved.forEach(function(e) {
            e[2015] = +e[2015];

            if (alphacode === e.country_alpha) {
                e.country_num = numcode;
            };

            world.forEach(function(f) {
                if (f.id === e.country_num) {
                    f[2015] = e[2015];
                }
            })
        })
    });

    updateChoropleth();

}

function updateChoropleth() {

    // chloropleth
    svg.selectAll(".world")
        .attr("fill", function(d) {
            if (!isNaN(d[2015])) {
                return color(d[2015]);
            }
            else {return "gray"}
        });
}
