var day=10410958904;
var perhour = day/24;
var today = new Date();
var hour = today.getHours();

var start = Math.round(hour * perhour);

var tim;

var formatNum = d3.format(",.2r");


// var svgCounter =  d3.select("#count").append("svg")
//     .attr("width", 1000)
//     .attr("height", 200)
//     .append("g")
//     .attr("transform", "translate(500, 100)");
//
// svgCounter.append("text")
//     .attr("x", 20)
//     .attr("y", 20)
//     .text(run());

// function run(){
//
//
// //     tim = setInterval(function()
//     {if(start>=day){clearInterval(tim); return 0;}
//         $('#count').innerHTML(++start);
//     }
//     ,1000);
// }


    tim = setInterval(function()
    {if (start>= day) {clearInterval(tim); return 0;}
        // $('#count').text(++start);

        var tons = ++start;

        document.getElementById("count").innerHTML = tons;
    }
    , 100);

function myTimer() {
    // var d = new Date();
    // document.getElementById("count").innerHTML = d.toLocaleTimeString();

    if(start>=day){clearInterval(tim); return 0;}

    document.getElementById("count").innerHTML(++start);


}

// run();