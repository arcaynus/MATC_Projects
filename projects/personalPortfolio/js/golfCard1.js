/**
 * Created by franciscomorales on 5/20/16.
 */
(GolfCard = function(){
    var numplayers = 8;
    var numholes = 18;
    
    var rowHole = $('#h-row-hole');
    var rowBlue = $('#h-row-blue');
    var rowWhite = $('#h-row-white');
    var rowRed = $('#h-row-red');
    var rowHandicap = $('#h-row-handicap');
    var rowPar = $('#h-row-par');

    function buildHeadersColLeft() {
        var divElement = $("<div>Hole</div>");
        // Create the Hole row header
        divElement.attr("id", "hole-label");
        divElement.addClass("hole-number-title header");
        leftCard.append(divElement);

        // Create the tee off row headers
        // Blue
        divElement = $("<div>Blue</div>");
        divElement.attr("id", "blue-label");
        divElement.addClass("blue-row header");
        leftCard.append(divElement);

        // White
        divElement = $("<div>White</div>");
        divElement.attr("id", "white-label");
        divElement.addClass("white-row header");
        leftCard.append(divElement);

        // Red
        divElement = $("<div>Red</div>");
        divElement.attr("id", "red-label");
        divElement.addClass("red-row header");
        leftCard.append(divElement);

        // Handicap
        divElement = $("<div>Handicap</div>");
        divElement.attr("id", "handicap-label");
        divElement.addClass("handicap-row header");
        leftCard.append(divElement);

        // Par
        divElement = $("<div>Par</div>");
        divElement.attr("id", "handicap-label");
        divElement.addClass("handicap-row header");
        leftCard.append(divElement);
    }
    function buildRightColumns(){
        var divElement;

        // Note due to the way floats display, you have to do these in reverse order (right-most column first)
        // Total Column
        divElement = $("<div></div>");
        divElement.attr("id", "total-col");
        rightCard.append(divElement);

        // In Column
        divElement = $("<div></div>");
        divElement.attr("id", "in-col");
        rightCard.append(divElement);

        // Next 9 Holes
        for(var i = 18; i > 9; i--){
            divElement = $("<div></div>");
            divElement.attr("id", "hole-col-" + i);
            rightCard.append(divElement);
        }

        // Spacer
        divElement = $("<div></div>");
        divElement.attr("id", "spacer-col");
        rightCard.append(divElement);

        // Out Column
        divElement = $("<div></div>");
        divElement.attr("id", "out-col");
        rightCard.append(divElement);

        // First 9 Holes
        for(var i = 9; i > 0; i--){
            divElement = $("<div></div>");
            divElement.attr("id", "hole-col-" + i);
            rightCard.append(divElement);
        }

    }
    function buildHolesRowRight(){
        // Build the Front 9 Hole Number Cells
        var divElement;
        for(var i = 1; i < 19; i++){
            divElement = $("<div></div>");
            divElement.text(i);
            divElement.attr("id", "hole"+i);
            divElement.addClass("hole-number-title");
            $(("#hole-col-" + i)).append(divElement);
        }

        // Add the Out Cell
        divElement = $("<div></div>");
        divElement.text("OUT");
        divElement.attr("id", "out-label");
        divElement.addClass("hole-number-title");
        $("#out-col").append(divElement);

        // Skip the spacer because we will handle it later at some point if I feel like it or well if I stop talking to
        // myself long enough to code it.  Trent if you are reading this, I wish I could draw as well as you =P
        divElement = $("<div></div>");
        divElement.text("INITIAL");
        divElement.attr("id", "spacer-label");
        divElement.addClass("spacer-col");
        $("#spacer-col").append(divElement);

        // Add the In Cell
        divElement = $("<div></div>");
        divElement.text("IN");
        divElement.attr("id", "in-label");
        divElement.addClass("hole-number-title");
        $("#in-col").append(divElement);

        // Add the Total Cell
        divElement = $("<div></div>");
        divElement.text("TOTAL");
        divElement.attr("id", "total-label");
        divElement.addClass("hole-number-title");
        $("#total-col").append(divElement);
    }
    function buildBlueRowRight(yardData){

        // We need to build every cell given the yard Data
        var divElement;
        for(var i = 1; i < 19; i++){
            divElement = $("<div></div>");
            //When we get data, we will set it here
            divElement.text("-");
            divElement.attr("id", "blue"+i);
            divElement.addClass("blue-row");
            $(("#hole-col-" + i)).append(divElement);
        }
        // Add the Out Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "out-blue");
        divElement.addClass("blue-row");
        $("#out-col").append(divElement);

        // Skip the spacer

        // Add the In Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "in-blue");
        divElement.addClass("blue-row");
        $("#in-col").append(divElement);

        // Add the Total Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "total-blue");
        divElement.addClass("blue-row");
        $("#total-col").append(divElement);
    }
    function buildWhiteRowRight(yardData){

        // We need to build every cell given the yard Data
        var divElement;
        for(var i = 1; i < 19; i++){
            divElement = $("<div></div>");
            //When we get data, we will set it here
            divElement.text("-");
            divElement.attr("id", "white"+i);
            divElement.addClass("white-row");
            $(("#hole-col-" + i)).append(divElement);
        }
        // Add the Out Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "out-white");
        divElement.addClass("white-row");
        $("#out-col").append(divElement);

        // Skip the spacer

        // Add the In Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "in-white");
        divElement.addClass("white-row");
        $("#in-col").append(divElement);

        // Add the Total Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "total-white");
        divElement.addClass("white-row");
        $("#total-col").append(divElement);
    }
    function buildRedRowRight(yardData){

        // We need to build every cell given the yard Data
        var divElement;
        for(var i = 1; i < 19; i++){
            divElement = $("<div></div>");
            //When we get data, we will set it here
            divElement.text("-");
            divElement.attr("id", "red"+i);
            divElement.addClass("red-row");
            $(("#hole-col-" + i)).append(divElement);
        }
        // Add the Out Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "out-red");
        divElement.addClass("red-row");
        $("#out-col").append(divElement);

        // Skip the spacer

        // Add the In Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "in-red");
        divElement.addClass("red-row");
        $("#in-col").append(divElement);

        // Add the Total Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "total-red");
        divElement.addClass("red-row");
        $("#total-col").append(divElement);
    }
    function buildHandicapRowRight(yardData){

        // We need to build every cell given the yard Data
        var divElement;
        for(var i = 1; i < 19; i++){
            divElement = $("<div></div>");
            //When we get data, we will set it here
            divElement.text("-");
            divElement.attr("id", "handicap"+i);
            divElement.addClass("handicap-row");
            $(("#hole-col-" + i)).append(divElement);
        }
        // Add the Out Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "out-handicap");
        divElement.addClass("handicap-row");
        $("#out-col").append(divElement);

        // Skip the spacer

        // Add the In Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "in-handicap");
        divElement.addClass("handicap-row");
        $("#in-col").append(divElement);

        // Add the Total Cell
        divElement = $("<div></div>");
        divElement.text("-");
        divElement.attr("id", "total-handicap");
        divElement.addClass("handicap-row");
        $("#total-col").append(divElement);
    }
    function buildcard(){
        var holecollection = "";
        var playercollection = "";

        buildHeadersColLeft();
        buildRightColumns();
        buildHolesRowRight();
        buildBlueRowRight(null);
        buildWhiteRowRight(null);
        buildRedRowRight(null);
        buildHandicapRowRight(null);

        // create column of player labels
        /*for(var pl = 1; pl <= numplayers; pl++ ){
            playercollection += "<div id='player" + pl +"' class='holebox playerbox'> Player " + pl + "</div>";
        }

        // create golf hole columns before you add holes to them.
        for(var c = numholes; c >= 1; c-- ){
            holecollection += "<div id='column" + c +"' class='holecol'><div class='holenumbertitle'>" + c + "</div></div>";
        }
        $("#leftCard").html(playercollection);
        $("#rightCard").html(holecollection);

        // call the function that builds the holes into the columns
        buildholes();*/
    }

    function buildholes() {
        // add 18 holes to the columns
        for(var p = 1; p <= numplayers; p++ ){
            for(var h = 1; h <= numholes; h++){
                $("#column" + h).append("<div id='player" + p +"hole" + h + "' class='holebox'>s</div>");
            }
        }
    }

    buildcard();
})();