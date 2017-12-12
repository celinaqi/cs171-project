

BarChart = function(_parentElement, _data, _config){
    this.parentElement = _parentElement;
    this.data = _data;
    this.config = _config;
    this.displayData = _data;

    this.initVis();
};

BarChart.prototype.initVis = function(){
    var vis = this;
    vis.margin = {top: 40, right: 0, bottom: 80, left: 0};
    vis.widthBar = 500 - vis.margin.left - vis.margin.right,
        vis.heightBar = 410 - vis.margin.top - vis.margin.bottom;

    // appending svg
    vis.svgBar = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.widthBar + vis.margin.left + vis.margin.right + 20)
        .attr("height", vis.heightBar + vis.margin.top + vis.margin.bottom);

    vis.gBar = vis.svgBar
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.keys = ["ag_water_withdrawal", "ind_water_withdrawal", "mun_water_withdrawal"];

    vis.barStack = d3.stack()
        .keys(vis.keys);


    vis.xBar = d3.scaleBand()
        .rangeRound([0, (vis.widthBar - 70)])
        .paddingInner(0.10)
        .align(0.1);

    vis.yBar = d3.scaleLinear()
        .range([vis.heightBar, 0]);

    vis.zBar = d3.scaleOrdinal()
        .range(["#01a3c5", "#6b486b", "#379837"]);
        // .range(["#4682b4", "#6b486b", "#ff8c00"])
        // .range(["#8dd3c7", "#ffffb3", "#bebada"]);


    vis.yAxisBar = d3.axisLeft()
        .scale(vis.yBar);

    vis.xAxisBar = d3.axisBottom()
        .scale(vis.xBar);

    vis.svgBar.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(30," + 310 + ")");

    vis.svgBar.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(30, 20)");

    vis.barLegend = vis.svgBar.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(vis.zBar.range().reverse())
        .enter().append("g");


    vis.barLegend.append("rect")
        .attr("x", vis.widthBar - 120)
        .attr("y", function(d, i){return i*21 + 20})
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", function(d) {return d});

    vis.barLegend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });

    vis.barLegend.append("text")
        .attr("class", "legendText")
        .attr("text-anchor", "start")
        .attr("x", vis.widthBar - 100)
        .attr("y", function(d, i) {return i*21 + 30})
        .text(function(d, i) {
            switch (i) {
                case 0: return "Agricultural";
                case 1: return "Industrial" ;
                case 2: return "Municipal";
            }
        });


    // vis.tipBar = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10, 0])
    //     .html(function(d) {
    //         return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
    //     })


    vis.tooltip = vis.svgBar.append("g")
        .attr("class", "tooltip d3-tip")
        .style("display", "none")
        .style("opacity", 0.7);

    vis.tooltip.append("rect")
        .attr("width", 110)
        .attr("height", 20)
        .attr("fill", "white");

    vis.tooltip.append("text")
        .attr("x", 50)
        .attr("dy", "1.2em")
        .attr("dx", "0.4em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");


    vis.sorted = vis.displayData.sort(function (a, b) {
        return b.total_water_withdrawal - a.total_water_withdrawal;
    });

    vis.sliced = vis.sorted.slice(0, 4);


    vis.selected = vis.sorted[5];


    //
    vis.wrangleData(vis.selected);

}

BarChart.prototype.wrangleData = function(data){

    var vis = this;

    // vis.sliced.forEach(function(d) {
    //     if (d.country !== data.country)
    //     {
    //         vis.sliced.splice(4, 1);
    //         vis.sliced.push(data);
    //         console.log(vis.sliced);
    //     }
    //
    //     else {
    //         console.log(vis.sliced);
    //         vis.sliced.push(vis.sorted[5]);
    //     }
    // })

    vis.sliced.push(data);


    // value passed in by choropleth

    vis.updateVis();


}

BarChart.prototype.updateVis = function(){

    var vis = this;

    var format = d3.format(".1f");

    // // resetting y scale domain
    vis.xBar.domain(vis.sliced.map(function (d) {return d.country}));
    vis.yBar.domain([0, 800]);
    vis.zBar.domain(vis.keys);

    // vis.yBar.domain([0, d3.max(vis.selected.value, function(d) {return d.val})]);

    vis.svgBar.select(".x-axis")
        .transition()
        .call(vis.xAxisBar)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)");

    vis.svgBar.select(".y-axis")
        .transition()
        .call(vis.yAxisBar);


    // vis.groupBar = vis.svgBar.selectAll(".type")
    //     .data(vis.barStack(vis.selected));
    //
    // vis.groupBar = svg.selectAll(".type")
    //     .data(vis.selected);

    // vis.groupBar
    //     .enter()
    //     .append("g")
    //     .attr("class", "type")
    //     .style("fill", function(d, i) { return vis.zBar[i] });

    // // creating bars
    // vis.bars = vis.svgBar.selectAll(".bars")
    //     .data(function(d) {return d;});


    vis.svgBar.selectAll(".stacked").remove();

    vis.stackedColors = vis.gBar.selectAll(".stacked")
        .data(vis.barStack(vis.sliced)).enter()
        .append("g")
        .attr("class", "stacked")
        .attr("fill", function(d) {return vis.zBar(d.key)});


    vis.stackedBars = vis.stackedColors.selectAll(".bars")
        .data(function(d) {return d});

    vis.stackedBars
        .enter().append("rect")
        .merge(vis.stackedBars)
        .attr("class", "bars")
        .attr("width", vis.xBar.bandwidth())
        .attr("x", function(d) {return vis.xBar(d.data.country) + 30})
        .attr("y", function(d) {return vis.yBar(d[1]) - 20})
        .attr("height", function(d) {return vis.yBar(d[0]) - vis.yBar(d[1]) })
        .on("mouseover", function() { vis.tooltip.style("display", null); })
        .on("mouseout", function() { vis.tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 10;
            var yPosition = d3.mouse(this)[1] + 10;
            vis.tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            vis.tooltip.select("text")
                // .text("Total: " + Math.round(d[1]-d[0]) + " Billion m^3");
                .text(" Total: " + d.data.total_water_withdrawal + " Billion ")
                .attr("text-anchor", "middle")
        });

        // .append("text")
        // .attr("x", 20)
        // .attr("y", 20)
        // .attr("text-anchor", "middle")
        // .attr("class", "amount")
        // .text(function(d, i) {
        //     return format(d.total_water_withdrawal);
        //     }
        // );

    console.log(vis.sliced);

    // label for cubic meters

    // vis.baramount = vis.svgBar.selectAll(".amount")
    //     .data(vis.sliced);
    //
    //     vis.baramount.enter()
    //         .append("text")
    //         .merge(vis.baramount)
    //         .text(function(d, i) {
    //             if (i < 8) {
    //                 return format(d.total_water_withdrawal)
    //             }
    //         })
    //         .attr("class", "amount")
    //         .attr("Id", "amount")
    //         .attr("text-anchor", "middle")
    //         .attr("x", function (d) {
    //             return vis.xBar(d.country) + 55
    //         })
    //         .transition()
    //         .duration(600)
    //         .attr("y", function(d) {return vis.yBar(d.total_water_withdrawal) + 15});
    // vis.baramount.exit().remove();



    vis.stackedBars.exit().remove();


    // label for title of bar chart
    vis.bartitle = vis.svgBar
        .append("text")
        .attr("class", "bartitle")
        .attr("text-anchor", "middle")
        .attr("x", 220)
        .attr("y", 10)
        .text("Water Withdrawal (Billion Cubic Meters) Per Year");

    vis.bartitle.exit().remove();

}
