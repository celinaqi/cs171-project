// freshwater counter

var day = 10410958904;
var perhour = day/24;
var today = new Date();
var hour = today.getHours();

var start = Math.round(hour * perhour);

var tim;

var formatNum = d3.format(",");

document.getElementById("freshwater").innerHTML = formatNum(start);


setInterval(function()
    {if (start>= day) {clearInterval(tim); return 0;}
        // $('#count').text(++start);

        var tons = ++start;

        document.getElementById("freshwater").innerHTML = formatNum(tons);
    }
    , 20);


// people counter

var origPeople = 33863207650;
var minutes = today.getMinutes();


var origCounter = new Date(2017, 10, 27, 22, 24, 01);

var addPeople = Math.round((today - origCounter) / 1000);

var startPeople = origPeople + addPeople;

 document.getElementById("inneed").innerHTML = formatNum(startPeople);


setInterval(function()
        // $('#count').text(++start);

    {var need = ++startPeople;

        document.getElementById("inneed").innerHTML = formatNum(need);
    }
    , 1000);


// children counter

var childrenperday = 989;

var childrenperhour = childrenperday/24;

var childrenminute = minutes*0.75;

var startChildren = hour * childrenperhour + childrenminute;

console.log(childrenperhour);

document.getElementById("children").innerHTML = Math.round(startChildren);


// Calculations from http://www.who.int/mediacentre/news/releases/2017/water-sanitation-hygiene/en/

setInterval(function()
        // $('#count').text(++start);

    {var children = ++startChildren;

        document.getElementById("children").innerHTML = Math.round(children);
    }
    , 80800);

