BarChart = function(_parentElement, _data, _config){
    this.parentElement = _parentElement;
    this.data = _data;
    this.config = _config;
    this.displayData = _data;

    this.initVis();
};

BarChart.prototype.initVis = function(){
    var vis = this;
    vis.margin = {top: 30, right: 80, bottom: 60, left: 80};
    vis.widthBar = 400 - vis.margin.left - vis.margin.right,
        vis.heightBar = 400 - vis.margin.top - vis.margin.bottom;

    // appending svg
    vis.svgBar = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.widthBar + vis.margin.left + vis.margin.right)
        .attr("height", vis.heightBar + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svgBar.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(20, 30)");

    // initializing y scale
    vis.y = d3.scaleLinear()
        .range([0, vis.heightBar]);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    // setting US as default bar data

    vis.selected = vis.displayData[87];

    vis.wrangleData(vis.selected);

}

BarChart.prototype.wrangleData = function(data){

    var vis = this;


    // value passed in by choropleth
    vis.selected = data;

    vis.updateVis();


}

BarChart.prototype.updateVis = function(){

    var vis = this;

    // resetting y scale domain
    vis.y.domain([0, d3.max(vis.selected.value, function(d) {return d.val})]);


    // creating bars
    vis.bars = vis.svgBar.selectAll(".bars")
        .data(vis.selected.value);

    vis.bars.enter()
        .append("rect")
        .merge(vis.bars)
        .transition()
        .duration(600)
        .attr("class", "bars")
        .attr("width", 65)
        .attr("y", function(d) {return 350 - vis.y(d.val)})
        .attr("height", function(d) {return vis.y(d.val)})
        .attr("x", function(d, index) {return index * 72})
        .attr("fill", "navy");

    // x-axis labels
    vis.barlabel = vis.svgBar.selectAll(".label")
        .data(vis.selected.value);

    vis.barlabel.enter()
        .append("text")
        .merge(vis.barlabel)
        .text(function (d) {
            return d.type;
        })
        .attr("class", "barlabel")
        .style("text-anchor", "end")
        .attr("x", function(d, i) {return i * 70 + 65})
        .attr("y", 370);


    vis.barlabel.exit().remove();

    // label for country selected
    vis.barcountry= vis.svgBar.selectAll(".barcountry")
        .data([vis.selected.key]);

    vis.barcountry.enter()
        .append("text")
        .merge(vis.barcountry)
        .attr("class", "barcountry")
        .attr("text-anchor", "middle")
        .attr("x", 110)
        .attr("y", 25)
        .text(function(d) {return d});

    vis.barcountry.exit().remove();

    // label for title of bar chart
    vis.bartitle = vis.svgBar.selectAll(".bartitle")
        .data([vis.selected.key]);

    vis.bartitle.enter()
        .append("text")
        .merge(vis.bartitle)
        .attr("class", "bartitle")
        .attr("text-anchor", "middle")
        .attr("x", 115)
        .attr("y", -20)
        .text("Water Withdrawal (Billion Cubic Meters) Per Year");

    vis.bartitle.exit().remove();

    // label for cubic meters
    vis.baramount = vis.svgBar.selectAll(".amount")
        .data(vis.selected.value);

    vis.baramount.enter()
        .append("text")
        .merge(vis.baramount)
        .transition()
        .duration(600)
        .text(function (d) {
            return d.val
        })
        .attr("class", "amount")
        .attr("Id", "amount")
        .attr("fill", "gray")
        .attr("x", function (d, index) {
            return (index * 73 + 10);
        })
        .attr("y", function (d) {return 340 - vis.y(d.val)});

    vis.baramount.exit().remove();

}
