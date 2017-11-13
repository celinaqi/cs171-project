// water calculator

function getValues() {
    console.log("getting values");
    var shower = document.getElementById("shower").value;
    var flush = document.getElementById("flush").value;
    var runningWater = document.getElementById("runningWater").value;
    var laundry = document.getElementById("laundry").value;
    var dishes = document.getElementById("dishes").value;
    waterCalculator(shower, flush, runningWater, laundry, dishes);
}

function waterCalculator(shower, flush, runningWater, laundry, dishes) {
    console.log(shower);
    $("#water-results-shower").html("Showers: " + (+shower) + " minutes/day x 2 gallons/minute = " + (+shower * 2) + " gallons/day");
    $("#water-results-flush").html("Toilet flushes: " + (+flush) + " flushes/day x 2 gallons/flush = " + (+flush * 2) + " gallons/day");
    $("#water-results-runningWater").html("Running water: " + (+runningWater) + " minutes/day x 2 gallons/minute = " + (+runningWater * 2) + " gallons/day");
    $("#water-results-laundry").html("Laundry: " + (+laundry) + " loads/month x 4 gallons/load = " + (+laundry * 4) + " gallons/month");
    $("#water-results-dishes").html("Dishwasher: " + (+dishes) + " loads/week x 1 gallons/load = " + (+dishes) + " gallons/week");
    $("#water-results-total").html("Total: ");
    $("#water-results-indirect").html("Above is your direct water consumption. In addition to this, you are consuming water every time you eat (especially if you eat meat, which is extremely water-intensive to produce), use electricity (Boston gets its electricity from hydropower), leave dishes to be cleaned by dhall staff, live at Harvard (irrigation for the grass and trees everywhere...)...In comparison, people in [country] consume [__] gallons/day, people in [country2] consume [__] gallons/day, etc.");
}
