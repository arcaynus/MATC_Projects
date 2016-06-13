/**
 * Created by franciscomorales on 5/20/16.
 */
(GolfCard = function(){

    // Game Objects

    // Name: GameData
    // Description: Stores all information about the game
    var GameData = {
        players: [],
        zipCode: "",
        courseData: {},
        coursesLocalData: {},
        dateOfGame: {},
        scorer: "",
        attest: "",
        currentHole: 1,
        outTotal: function(tee) {
            var count = 0;
            for(var i = 0; i < 9; i++){
                count += this.courseData.course.holes[i].tee_boxes[tee].yards;
            }
            return count;
        },
        inTotal: function(tee) {
            var count = 0;
            for(var i = 9; i < 18; i++){
                count += this.courseData.course.holes[i].tee_boxes[tee].yards;
            }
            return count;
        },
        total: function (tee) {
            var count = 0;
            if(this.courseData.course.hole_count > 9){
                count += this.inTotal(tee)
            }
            return count + this.outTotal(tee);
        },
        parOutTotal: function () {
            var count = 0;
            for(var i = 0; i < 9; i++){
                count += this.courseData.course.holes[i].tee_boxes[0].par;
            }
            return count;
        },
        parInTotal: function () {
            var count = 0;
            for(var i = 9; i < 18; i++){
                count += this.courseData.course.holes[i].tee_boxes[0].par;
            }
            return count;
        },
        parTotal: function () {
            var count = 0;
            if(this.courseData.course.hole_count > 9){
                count += this.parInTotal()
            }
            return count + this.parOutTotal();
        },
        uniqueName: function (indexToIgnore, nameToCheck){
            var unique = true;
            for(var index = 0; index < this.players.length; index++){
                if(index == indexToIgnore){
                    continue;
                }
                if(this.players[index].name == nameToCheck){
                    unique = false;
                }
            }
            return unique;
        },
        // Find out how many tee boxed there are, but only check for pro, champion, men, women because
        // the api seems to have some junk rows in it
        teeBoxCount: function () {
            var teeBoxCount = 0;
            for(var row = 0; row < GameData.courseData.course.holes[0].tee_boxes.length; row++){
                if(GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "pro" ||
                    GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "champion" ||
                    GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "men" ||
                    GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "women"
                ){
                    teeBoxCount++;
                }
            }
            return teeBoxCount;
        }
    };

    // Name: Player
    // Description: Users to store a player's data
    var Player = function (name, playerNumber, teeType, scores){
        this.name = name;
        this.playerNumber = playerNumber;
        this.teeType = teeType;
        this.scores = scores;
        this.total = function(){
            var val = 0;
            for(var i = 0; i < 18; i++){
                val += this.scores[i];
            }
            return val;
        }
        this.outTotal = function(){
            var val = 0;
            for(var i = 0; i < 9; i++){
                val += this.scores[i];
            }
            return val;
        }
        this.inTotal = function(){
            var val = 0;
            for(var i = 9; i < 18; i++){
                val += this.scores[i];
            }
            return val;
        }
    };

    function resetScoreCard(){
        var el = $("#score-card-tbl");
        el.find("thead").html("");
        el.find("tbody").html("");
    }
    function buildCourseRow(course){
        var trElement = $("<tr></tr>");
        var tdElement = $("<td></td>");
        var radButton = $('<input type="radio" name="course-selected">');
        var link;

        // Create the Row
        trElement.attr("id", "r-course-" + course.id);
        trElement.attr("data-course", course.id);
        trElement.click(function(){
            //console.log(course.id);
            // console.log(trElement.attr("id")); //.addClass("active");
            $(".rad-"+course.id).find("input").prop("checked", true);
            $("#select-course-btn").prop("disabled", false);
        });

        // Add the radio button for it
        radButton.attr("value", course.id);
        tdElement.addClass("rad-" + course.id);
        tdElement.append(radButton);
        trElement.append(tdElement);

        // Add the Course Name that is a link to course site
        tdElement = $("<td></td>");
        link = $('<a href="'+ course.website + '">' + course.name + '</a>');
        link.addClass("link");
        tdElement.append(link);
        trElement.append(tdElement);

        // Phone number
        tdElement = $("<td></td>");
        link = $('<a href="tel:'+ course.phone + '">' + course.phone + '</a>');
        tdElement.append(link);
        trElement.append(tdElement);

        // Public
        tdElement = $("<td></td>");
        if(course.membership_type === "public"){
            tdElement.addClass("public");
            tdElement.html('<span class="glyphicon glyphicon-ok-sign"></span>');
        }else{
            tdElement.addClass("private");
            tdElement.html('<span class="glyphicon glyphicon-remove-sign"></span>');
        }
        trElement.append(tdElement);

        // Add hole count
        tdElement = $("<td></td>");
        tdElement.text(course.hole_count);
        trElement.append(tdElement);
        
        // Add the Row to the table 
        $("#select-course-tbl").find("tbody").append(trElement);
    }
    function buildHolesRow(display){
        var tableHead = $("#score-card-tbl thead");

        var trElement = $("<tr></tr>");
        var thElement = $("<th></th>");
        trElement.attr("id","h-row-hole");
        thElement.attr("id","label-hole");
        thElement.addClass("header hole");
        thElement.text("Hole");
        tableHead.append(trElement);
        trElement.append(thElement);

        var rowHole = $('#h-row-hole');

        // Build the Front 9 Hole Number Cells
        if (display === "all" || display === "front") {
            for (var i = 1; i < 10; i++) {
                thElement = $("<th></th>");
                thElement.text(i);
                thElement.attr("id", "hole" + i);
                thElement.addClass("hole");
                rowHole.append(thElement);
            }

            // Add the Out Cell
            thElement = $("<th></th>");
            thElement.text("OUT");
            thElement.attr("id", "out-label");
            thElement.addClass("hole");
            rowHole.append(thElement);
        }
        if (display === "all") {
            // Skip the spacer because we will handle it later at some point if I feel like it or well if I stop talking to
            // myself long enough to code it.  Trent if you are reading this, I wish I could draw as well as you =P
            thElement = $("<th></th>");
            thElement.text("INITIAL");
            thElement.attr("id", "spacer-label");
            thElement.attr("rowspan", "6")
            thElement.addClass("spacer-col empty");
            rowHole.append(thElement);
        }
        if (display === "all" || display === "back") {
            for (var i = 10; i < 19; i++) {
                thElement = $("<th></th>");
                thElement.text(i);
                thElement.attr("id", "hole" + i);
                thElement.addClass("hole");
                rowHole.append(thElement);
            }

            // Add the In Cell
            thElement = $("<th></th>");
            thElement.text("IN");
            thElement.attr("id", "in-label");
            thElement.addClass("hole");
            rowHole.append(thElement)
        }

        // Add the Total Cell
        thElement = $("<th></th>");
        thElement.text("TOTAL");
        thElement.attr("id", "total-label");
        thElement.addClass("hole");
        rowHole.append(thElement);
    }
    function buildParRow(display) {
        var trElement = $("<tr></tr>");
        var thElement = $("<th></th>");

        trElement.attr("id","h-row-par");
        thElement.attr("id","label-par");
        thElement.addClass("header par");
        thElement.text("Par");
        tableHead.append(trElement);
        trElement.append(thElement);

        var rowPar = $('#h-row-par');


        // We need to build every cell given the yard Data
        if (display === "all" || display === "front") {
            for (var i = 1; i < 10; i++) {
                thElement = $("<th></th>");
                //When we get data, we will set it here
                thElement.text("-");
                thElement.attr("id", "par" + i);
                thElement.addClass("par");
                rowPar.append(thElement);
            }
            // Add the Out Cell
            thElement = $("<th></th>");
            thElement.text("-");
            thElement.attr("id", "out-par");
            thElement.addClass("par");
            rowPar.append(thElement);
        }
        // Skip the spacer

        // Display the back nine
        if (display === "all" || display === "back") {
            for (i = 10; i < 19; i++) {
                thElement = $("<th></th>");
                //When we get data, we will set it here
                thElement.text("-");
                thElement.attr("id", "par" + i);
                thElement.addClass("par");
                rowPar.append(thElement);
            }
            // Add the In Cell
            thElement = $("<th></th>");
            thElement.text("-");
            thElement.attr("id", "in-par");
            thElement.addClass("par");
            rowPar.append(thElement);
        }


        // Add the Total Cell
        thElement = $("<th></th>");
        thElement.text("-");
        thElement.attr("id", "total-par");
        thElement.addClass("par");
        rowPar.append(thElement);
    }

    function buildFrontNine() {
        var thElement, teeType, tee, hole;
        var teeBoxCount = GameData.teeBoxCount();

        //Build the hole #'s
        for (var i = 1; i < 10; i++) {
            thElement = $("<th></th>");
            thElement.text(i);
            thElement.attr("id", "hole-" + i);
            thElement.addClass("hole hole-number");
            // Add the onclick function
            thElement.click(holeClick);
            $("#h-row-hole").append(thElement);
        }

        // Add the Out Cell
        thElement = $("<th></th>");
        thElement.text("OUT");
        thElement.attr("id", "out-label");
        thElement.addClass("hole");
        $("#h-row-hole").append(thElement)

        // build the tee information
        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            for (hole = 0; hole < 9; hole++) {
                thElement = $("<th></th>");
                thElement.attr("id", "" + teeType + hole);
                thElement.addClass(teeType);
                thElement.text(GameData.courseData.course.holes[hole].tee_boxes[tee].yards);
                $("#h-row-" + teeType).append(thElement);

            }
            // Add the total out yards cell for each teeBox
            thElement = $("<th></th>");
            thElement.text(GameData.outTotal(tee));
            thElement.attr("id", "out-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
            thElement.addClass("out " + teeType);
            $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);

        }
        // Add the Par
        for (i = 0; i < 9; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].par);
            thElement.attr("id", "par" + i);
            thElement.addClass("par");
            $("#h-row-par").append(thElement);
        }
        // Add the Par Out Total
        thElement = $("<th></th>");
        thElement.text(GameData.parOutTotal());
        thElement.attr("id", "out-par");
        thElement.addClass("par out");
        $("#h-row-par").append(thElement);

        // Add the handicap
        for (i = 0; i < 9; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].hcp);
            thElement.attr("id", "handicap" + i);
            thElement.addClass("handicap");
            $("#h-row-handicap").append(thElement);
        }
        // Add a Blank Out total for Handicap
        thElement = $("<th></th>");
        thElement.text("");
        thElement.attr("id", "out-handicap");
        thElement.addClass("handicap out");
        $("#h-row-handicap").append(thElement);
    }

    function buildBackNine() {
        var i, tee, teeType, thElement, hole;
        var teeBoxCount = GameData.teeBoxCount();

        //Build the hole #'s
        for (i = 10; i < 19; i++) {
            thElement = $("<th></th>");
            thElement.text(i);
            thElement.attr("id", "hole-" + i);
            thElement.addClass("hole hole-number");
            thElement.click(holeClick);
            $("#h-row-hole").append(thElement);
        }

        // Add the In Cell
        thElement = $("<th></th>");
        thElement.text("IN");
        thElement.attr("id", "in-label");
        thElement.addClass("hole");
        $("#h-row-hole").append(thElement)

        // build the tee information
        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            for (hole = 10; hole < 19; hole++) {
                thElement = $("<th></th>");
                thElement.attr("id", "" + teeType + hole);
                thElement.addClass(teeType);
                thElement.text(GameData.courseData.course.holes[hole - 1].tee_boxes[tee].yards);
                $("#h-row-" + teeType).append(thElement);
            }
            // Add the total in yards cell for each teeBox
            thElement = $("<th></th>");
            thElement.text(GameData.inTotal(tee));
            thElement.attr("id", "in-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
            thElement.addClass("in " + teeType);
            $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
        }
        // Add the Par
        for (i = 9; i < 18; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].par);
            thElement.attr("id", "par" + i);
            thElement.addClass("par");
            $("#h-row-par").append(thElement);
        }
        // Add the Par In Total
        thElement = $("<th></th>");
        thElement.text(GameData.parInTotal());
        thElement.attr("id", "in-par");
        thElement.addClass("par in");
        $("#h-row-par").append(thElement);

        // Add the handicap
        for (i = 9; i < 18; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].hcp);
            thElement.attr("id", "handicap" + i);
            thElement.addClass("handicap");
            $("#h-row-handicap").append(thElement);
        }
        // Add a Blank In total for Handicap
        thElement = $("<th></th>");
        thElement.text("");
        thElement.attr("id", "in-handicap");
        thElement.addClass("handicap in");
        $("#h-row-handicap").append(thElement);
    }

    function buildSingle() {
        var thElement, currentHole, teeType, tee, teeBoxCount;
        currentHole = GameData.currentHole;
        teeBoxCount = GameData.teeBoxCount();

        // Add the hole data
        thElement = $("<th></th>");
        thElement.text(currentHole);
        thElement.attr("id", "hole-" + currentHole);
        thElement.addClass("hole hole-number");
        // Add the onclick function
        thElement.click(holeClick);
        $("#h-row-hole").append(thElement);
        // Add the Out Column if current hole < 10, otherwise we want to add the in total
        if (currentHole < 10) {
            // Add the Out Cell
            thElement = $("<th></th>");
            thElement.text("OUT");
            thElement.attr("id", "out-label");
            thElement.addClass("hole");
            $("#h-row-hole").append(thElement)
        } else {
            // Add the In Cell
            thElement = $("<th></th>");
            thElement.text("IN");
            thElement.attr("id", "in-label");
            thElement.addClass("hole");
            $("#h-row-hole").append(thElement)
        }

        // Add the each tee yardage
        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            thElement = $("<th></th>");
            thElement.attr("id", "" + teeType + currentHole);
            thElement.addClass(teeType);
            thElement.text(GameData.courseData.course.holes[currentHole - 1].tee_boxes[tee].yards);
            $("#h-row-" + teeType).append(thElement);

            if (currentHole < 10) { // Add the tee total yardage to the out column
                thElement = $("<th></th>");
                thElement.text(GameData.outTotal(tee));
                thElement.attr("id", "out-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
                thElement.addClass("out " + teeType);
                $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
            } else { // Add the tee total yardage to the in column
                thElement = $("<th></th>");
                thElement.text(GameData.inTotal(tee));
                thElement.attr("id", "in-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
                thElement.addClass("in " + teeType);
                $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
            }
        }

        // Add the Handicap
        thElement = $("<th></th>");
        thElement.text(GameData.courseData.course.holes[GameData.currentHole - 1].tee_boxes[0].hcp);
        thElement.attr("id", "handicap" + currentHole);
        thElement.addClass("handicap");
        $("#h-row-handicap").append(thElement);

        // Add the blank handicap for either the out or the in hole
        if (currentHole < 10) {
            // Add a Blank Out total for Handicap
            thElement = $("<th></th>");
            thElement.text("");
            thElement.attr("id", "out-handicap");
            thElement.addClass("handicap out");
            $("#h-row-handicap").append(thElement);
        } else {
            // Add a Blank In total for Handicap
            thElement = $("<th></th>");
            thElement.text("");
            thElement.attr("id", "in-handicap");
            thElement.addClass("handicap in");
            $("#h-row-handicap").append(thElement);
        }
        // Add the par totals for Out or In
        if (currentHole < 10) {
            thElement = $("<th></th>");
            thElement.text(GameData.parOutTotal());
            thElement.attr("id", "out-par");
            thElement.addClass("par out");
            $("#h-row-par").append(thElement);
        } else {
            thElement = $("<th></th>");
            thElement.text(GameData.parInTotal());
            thElement.attr("id", "in-par");
            thElement.addClass("par in");
            $("#h-row-par").append(thElement);
        }
        // Add the Par
        thElement = $("<th></th>");
        thElement.text(GameData.courseData.course.holes[currentHole - 1].tee_boxes[0].par);
        thElement.attr("id", "par" + currentHole);
        thElement.addClass("par");
        $("#h-row-par").append(thElement);
    }

    function buildCourseInfoFromData(display) {
        // Set the name of the Golf Course
        $("#golf-course-label").text(GameData.courseData.course.name);

        // Clear the table head since we are going to be building it dynamically
        var tableHead = $("#score-card-tbl thead");

        tableHead.html("");
        // Create all the table rows first

        // Find out how many tee boxed there are, but only check for pro, champion, men, women because
        // the api seems to have some junk rows in it
        var teeBoxCount = GameData.teeBoxCount();

        // ************************************** //
        // Create the table rows and initial td's //
        // which contain the row titles           //
        // ************************************** //

        // Create the hole row
        var trElement = $("<tr></tr>");
        var thElement = $("<th></th>");
        trElement.attr("id","h-row-hole");
        thElement.attr("id","label-hole");
        thElement.addClass("header hole");
        thElement.text("Hole");
        tableHead.append(trElement);
        trElement.append(thElement);

        // Create the rest of the tee rows

        // Course Tee Types
        for(var tee = 0; tee < teeBoxCount; tee++){
            var teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            trElement = $("<tr></tr>");
            thElement = $("<th></th>");

            trElement.attr("id","h-row-" + teeType);
            thElement.attr("id","label-" + teeType);
            thElement.addClass("header " + teeType);
            thElement.text(teeType);
            tableHead.append(trElement);
            trElement.append(thElement);
        }

        // Handicap
        trElement = $("<tr></tr>");
        thElement = $("<th></th>");
        trElement.attr("id","h-row-handicap");
        thElement.attr("id","label-handicap");
        thElement.addClass("header handicap");
        thElement.text("Handicap");
        tableHead.append(trElement);
        trElement.append(thElement);

        // Par
        trElement = $("<tr></tr>");
        thElement = $("<th></th>");

        trElement.attr("id","h-row-par");
        thElement.attr("id","label-par");
        thElement.addClass("header par");
        thElement.text("Par");
        tableHead.append(trElement);
        trElement.append(thElement);

        // ************************************** //

        // Hide the buttons if the the display is not single
        if(display !== "single"){
            $("#prev-hole-btn").slideUp();
            $("#next-hole-btn").slideUp();
        }else{
            // Display the prev and next hole buttons
            $("#prev-hole-btn").slideDown();
            $("#next-hole-btn").slideDown();
        }
        // Add the tee type options to the Add Player option list if it is not visible
        if($("#tee-select option").length == 0){
            var select = $("#tee-select");
            var optionElement;
            for(tee = 0; tee < teeBoxCount; tee++){
                teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
                optionElement = $("<option></option>");
                optionElement.attr("id", "option-" + teeType);
                optionElement.attr("value", teeType.toLowerCase());
                optionElement.text(teeType);
                select.append(optionElement);
            }
        }

        // Build the table cells based on display
        if(display === "all"){
            buildFrontNine();
            // Add the spacer
            if (display === "all") {
                thElement = $("<th></th>");
                thElement.text("INITIAL");
                thElement.attr("id", "spacer-label");
                thElement.attr("rowspan", teeBoxCount+3); // + 1 each for hole, par, handicap rows
                thElement.addClass("spacer-col empty");
                $("#h-row-hole").append(thElement);
            }
            buildBackNine();

        }else if(display === "front"){
            buildFrontNine();
        }else if(display === "back"){
            buildBackNine();
        }else if(display === "single"){ // Display a single hole based on what the current hole is
            buildSingle();
        }

        // Add the Total Cell for the Hole row (Total)
        thElement = $("<th></th>");
        thElement.text("Total");
        thElement.attr("id", "total-hole");
        thElement.addClass("hole");
        $("#h-row-hole").append(thElement);

        // Add the totals for all the other tee types
        for(tee = 0; tee < teeBoxCount; tee++){
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;

            // Add the total value no matter what
            thElement = $("<th></th>");
            thElement.text(GameData.total(tee));
            thElement.attr("id", "total-" + teeType);
            thElement.addClass("total " + teeType);
            $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
        }


        // Add total for Handicap <blank>
        thElement = $("<th></th>");
        thElement.text("");
        thElement.attr("id", "total-handicap");
        thElement.addClass("total handicap");
        $("#h-row-handicap").append(thElement);

        // Add total for Par
        thElement = $("<th></th>");
        thElement.text(GameData.parTotal());
        thElement.attr("id", "total-par");
        thElement.addClass("total par");
        $("#h-row-par").append(thElement);


    }
    function buildPlayerRow(display, playerData){
        //increase the counter


        // Create the new row
        var trElement = $("<tr></tr>");
        trElement.attr("id","b-row-player" + playerData.playerNumber);
        trElement.addClass("player");
        // Add the new player row before the add button
        $("#player-rows").append(trElement);

        // Add the input name field
        // Create a table data cell to contain it
        var tdElement = $("<td></td>");
        tdElement.attr("id", "name-player" + playerData.playerNumber);
        tdElement.addClass("player player-name " + playerData.teeType);
        trElement.append(tdElement);
        var textInput = $("<input type='text' id='" + "txt-player" + playerData.playerNumber + "-name' placeholder='Player Name' value='" + playerData.name + "'maxlength='25'>");
        textInput.addClass("player-txt " + playerData.teeType);
        textInput.attr("data-player", playerData.playerNumber);
        textInput.blur(nameChange);
        textInput.keyup(nameChange);
        tdElement.append(textInput);


        // We need to build every cell given the yard Data
        if (display === "all" || display === "front") {
            for (var i = 1; i < 10; i++) {
                tdElement = $("<td></td>");
                //Set the score to the stored player score, offset by -1 since array is 0 based
                tdElement.attr("id", "player" + playerData.playerNumber + "-hole" + i);
                tdElement.addClass("player hole-cell " + playerData.teeType);

                //Need to create a input field
                textInput = $("<input type='number' id='" + "txt-player" + playerData.playerNumber + "-hole" + i + "' placeholder='0' value='" + playerData.scores[i-1] + "'max='99' min='0' maxlength='2' size='2'>");
                textInput.addClass("player-txt-hole");
                textInput.attr("data-player", playerData.playerNumber);
                textInput.attr("data-hole", i);
                textInput.blur(holeStrokeChange);
                textInput.keyup(holeStrokeChange);
                textInput.click(selectContents);
                textInput.focusin(selectContents);
                tdElement.append(textInput);
                trElement.append(tdElement);
            }
            // Add the Out Cell
            tdElement = $("<td></td>");
            tdElement.text(playerData.outTotal());
            tdElement.attr("id", "out-player" + playerData.playerNumber);
            tdElement.addClass("player " + playerData.teeType);
            trElement.append(tdElement);
        }
        if(display === "all") {
            // adjust the spacer
            tdElement = $("<td></td>");
            tdElement.text("");
            tdElement.attr("id", "spacer-player" + playerData.playerNumber);
            tdElement.addClass("player empty");
            trElement.append(tdElement);
        }

        // Display the back nine
        if (display === "all" || display === "back") {
            for (i = 10; i < 19; i++) {
                tdElement = $("<td></td>");
                //Set the score to the stored player score, offset by -1 since array is 0 based
                tdElement.attr("id", "player" + playerData.playerNumber + "-hole" + i);
                tdElement.addClass("player " + playerData.teeType);

                //Need to create a input field
                textInput = $("<input type='number' id='" + "txt-player-" + playerData.playerNumber + "-hole" + i + "' placeholder='0' value='" + playerData.scores[i-1] + "' max='99' min='0' maxlength='2' size='2'>");
                textInput.addClass("player-txt-hole");
                textInput.attr("data-player", playerData.playerNumber);
                textInput.attr("data-hole", i);
                textInput.blur(holeStrokeChange);
                textInput.keyup(holeStrokeChange);
                textInput.click(selectContents);
                textInput.focusin(selectContents);
                tdElement.append(textInput);
                trElement.append(tdElement);
            }
            // Add the In Cell
            tdElement = $("<td></td>");
            tdElement.text(playerData.inTotal());
            tdElement.attr("id", "in-player" + playerData.playerNumber);
            tdElement.addClass("player " + playerData.teeType);
            trElement.append(tdElement);
        }

        // Display a single hole
        if(display === "single"){
            // Display the hole
            tdElement = $("<td></td>");
            //Set the score to the stored player score, offset by -1 since array is 0 based
            tdElement.attr("id", "player" + playerData.playerNumber + "-hole" + GameData.currentHole-1);
            tdElement.addClass("player " + playerData.teeType);

            //Need to create a input field
            textInput = $("<input type='number' id='" + "txt-player-" + playerData.playerNumber + "-hole" + (GameData.currentHole-1) + "' placeholder='0' value='" + playerData.scores[GameData.currentHole-1] + "' max='99' min='0' maxlength='2' size='2'>");
            textInput.addClass("player-txt-hole");
            textInput.attr("data-player", playerData.playerNumber);
            textInput.attr("data-hole", GameData.currentHole);
            textInput.blur(holeStrokeChange);
            textInput.keyup(holeStrokeChange);
            textInput.on("focus", selectContents);
            tdElement.append(textInput);
            trElement.append(tdElement);


            // Display either the Out total or the In Total
            if(GameData.currentHole < 10){
                tdElement = $("<td></td>");
                tdElement.text(playerData.outTotal());
                tdElement.attr("id", "out-player" + playerData.playerNumber);
                tdElement.addClass("player " + playerData.teeType);
                trElement.append(tdElement);
            }else{
                tdElement = $("<td></td>");
                tdElement.text(playerData.inTotal());
                tdElement.attr("id", "in-player" + playerData.playerNumber);
                tdElement.addClass("player " + playerData.teeType);
                trElement.append(tdElement);
            }

        }


        // Add the Total Cell
        tdElement = $("<td></td>");
        tdElement.text(playerData.total());
        tdElement.attr("id", "total-player" + playerData.playerNumber);
        tdElement.addClass("player-total player " + playerData.teeType);

        // Add the badge
        var badge = $("<span>0</span>");
        badge.addClass("badge");
        badge.attr("id", "badge-" + playerData.playerNumber);
        badge.attr("data-toggle", "tooltip");
        badge.attr("data-placement", "top");
        tdElement.append(badge);
        trElement.append(tdElement);

        // update the badge with the offset of par
        var offset = (GameData.players[playerData.playerNumber].total() - GameData.parTotal());

        // Get the badge for the player total and set the style appropriately
        if(offset < 0){
            badge.removeClass("bad-score");
            badge.addClass("good-score");
            badge.attr("title", "Welcome to the PGA Tour");

        }else if(offset == 0){
            badge.addClass()
        }else{
            offset = "+" + offset;
            badge.removeClass("good-score");
            badge.addClass("bad-score");
            badge.attr("title", "Better luck next time");
        }
        badge.tooltip();
        $("#badge-" + playerData.playerNumber).text(offset);
    }
    function buildcard(display){
        // Clear the table
        resetScoreCard();

        // Build a generic card
        if(GameData.courseData == undefined){
            buildHolesRow(display);
            buildParRow(display);

            // Add default values for the select field
            var select = $("#tee-select");
            var optionElement;
                // Pro
                optionElement = $("<option></option>");
                optionElement.attr("id", "option-pro");
                optionElement.attr("value", "pro");
                optionElement.text("Pro");
                select.append(optionElement);
                // Champion
                optionElement = $("<option></option>");
                optionElement.attr("id", "option-champion");
                optionElement.attr("value", "champion");
                optionElement.text("Champion");
                select.append(optionElement);
                // Men
                optionElement = $("<option></option>");
                optionElement.attr("id", "option-men");
                optionElement.attr("value", "men");
                optionElement.text("Men");
                select.append(optionElement);
                // Women
                optionElement = $("<option></option>");
                optionElement.attr("id", "option-women");
                optionElement.attr("value", "women");
                optionElement.text("Women");
                select.append(optionElement);
        }else{
            // Build a card based on the course data
            buildCourseInfoFromData(display);
        }


        //Build all the players if there are any
        for(var i = 0; i < GameData.players.length; i++){
            buildPlayerRow(display, GameData.players[i]);
        }

    }

    // Change Events, Clicks, Blurs, and On Changes //
    // When Add Player Button is Clicked
    function addPlayer() {
        var checkedDisplayValue = $('input[name="hole-display-option"]:checked').val();
        var selectedTee = $("#tee-select option:selected").val();
        var playerName = $("#new-player-name").val();
        var playerNum = GameData.players.length;

        // Create a player with default information
        var player = new Player(playerName, playerNum, selectedTee ,[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

        // Add the player to the game data
        GameData.players.push(player);

        // Create the row for the player
        buildPlayerRow(checkedDisplayValue, GameData.players[playerNum]);

        // Clear the text input
        $("#new-player-name").val("");

        // Close the modal
        $("#playerModal").modal("hide");

    }
    // When Player Name is Changed
    function nameChange(e) {
        // Find out which name is changed
        var element = $(e.target);
        var playerNum = element.data("player");
        // Verify name has a value
        var value = e.target.value;
        // If name is empty, then disable the add button
        if(value.length == 0){
            $("#submit-player-btn").prop('disabled', true);
        }else{
            $("#submit-player-btn").prop('disabled', false);
        }
        // Check to see player name is unique
        if(!GameData.uniqueName(playerNum,value)){
            element.focus();
            if(playerNum != undefined) { // undefined means we are in the in the Add Player dialog
                e.target.value = (GameData.players[playerNum].name); // Set it to the old value
                // alert the player the name must be unique, this is temporaty until i can create an error modal
                alert("Player Names Must Be Unique!")
            }else {
                // Add a notification that the player name must be unique
                if ($("#player-unique-error-alert").length == 0) {
                    var alert = $('<div id="player-unique-error-alert" class="alert alert-danger col-sm-10 col-md-offset-2" role="alert">Player Names Must Be Unique</div>');
                    // Append it to the modal body
                    $("#add-input-body").addClass("has-error has-feedback");
                    $("#add-input-body").append(alert);
                }
                //Disable the add player button
                $("#submit-player-btn").prop('disabled', true);
            }
            return;
        }else{
            // remove the error message is visible
            if(playerNum == undefined) {
                if ($("#player-unique-error-alert").length != 0){
                    $("#player-unique-error-alert").remove();
                    // remove the error hightlight
                    $("#add-input-body").removeClass("has-error has-feedback");
                    // Enable the button
                    $("#submit-player-btn").prop('disabled', false);
                }
            }
        }

        // Set the Game object player name to what was set
        if(playerNum != undefined) { //undefined means we are in the in the Add Player dialog
            GameData.players[playerNum].name = value;
        }
    }

    // When a Stroke Count is Changed
    function holeStrokeChange(e) {

        // Find out which player
        var element = $(e.target);
        var playerNum = element.data("player");
        // Find out which hole offset by 1
        var holeNum =  +(element.data("hole")) - 1;

        // Get the value
        var value = +e.target.value;
        // If value is > 99 set it to 99
        if(value > 99){
            e.target.value = 99;
            value = 99;
        }else if(value == 0){
            e.target.value = 0; // for number text fields anything that is not a number will eval to 0 for value, so this is neccessary to ensure a value of "0" is really set to 0
            element.select();
        }

        // Set the Game object player's score//
        GameData.players[playerNum].scores[holeNum] = value;
        // Update totals
        //Have to see which are displayed
        if(!!$("#out-player" + playerNum).length){
            $("#out-player" + playerNum).text(GameData.players[playerNum].outTotal());
        }
        if(!!$("#in-player" + playerNum).length){
            $("#in-player" + playerNum).text(GameData.players[playerNum].inTotal());
        }
        // Add the total
        $("#total-player" + playerNum).text(GameData.players[playerNum].total());

        // Add the badge
        var tdElement = $("#total-player" + playerNum);
        var badge = $("<span>0</span>");
        badge.attr("id", "badge-" + playerNum);
        badge.addClass("badge");

        // update the badge with the offset of par
        var offset = (GameData.players[playerNum].total() - GameData.parTotal());

        // Get the badge for the player total and set the style appropriately
        if(offset < 0){
            badge.removeClass("bad-score");
            badge.addClass("good-score");
            badge.attr("title", "Welcome to the PGA Tour");

        }else if(offset == 0){
            badge.addClass()
        }else{
            offset = "+" + offset;
            badge.removeClass("good-score");
            badge.addClass("bad-score");
            badge.attr("title", "Better luck next time");
        }
        badge.tooltip();
        badge.text(offset);
        tdElement.append(badge);
    }

    // holeClick occurs when the user clicks a hole number
    // This should display the current holes map with icons for the tee's
    function holeClick(e) {
        // Get the id by splitting the id on the "-"
        var element = $(e.target);
        var elementID = element.attr("id");
        var holeNumber = elementID.split('-')[1]; // The hole number is the second value

        // Get the center from the green hole and the first tee
        var greenLoc = GameData.courseData.course.holes[holeNumber].green_location;
        var firstTeeLoc = GameData.courseData.course.holes[holeNumber].tee_boxes[0].location;

        // Get the average lat and lng
        var aLat = (greenLoc.lat + firstTeeLoc.lat)/2;
        var aLng = (greenLoc.lng + firstTeeLoc.lng)/2;
        console.log("alat:" + aLat + " alng:" + aLng);
        // Build the map
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: {lat: aLat, lng: aLng},
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });
        // Build the pins
        //  The green
        var image = 'images/greenFlag.png';

        var beachMarker = new google.maps.Marker({
            position: greenLoc,
            animation: google.maps.Animation.DROP,
            label: "Green",
            map: map,
            icon: image
        });

        // The Tees
        for(var i = 0; i < GameData.courseData.course.holes[holeNumber].tee_boxes.length; i++) {
            image = 'images/whiteTee.png';
            var tee = GameData.courseData.course.holes[holeNumber].tee_boxes[i];
            switch (tee.tee_type){
                case "pro":
                    image = 'images/blackTee.png';
                    break;
                case "champion":
                    image = 'images/blueTee.png';
                    break;
                case "men":
                    image = 'images/whiteTee.png';
                    break;
                case "women":
                    image = 'images/redTee.png';
                    break;
                default:
                    break
            }
            beachMarker = new google.maps.Marker({
                position: tee.location,
                animation: google.maps.Animation.DROP,
                label: tee.tee_type,
                map: map,
                icon: image
            });
        }

    }
    // *************************** //
    // Set Up all the click events //
    // *************************** //
    $("input[name='hole-display-option']").change(function(){
        $(this).prop("checked", true);
        resetScoreCard();
        buildcard(this.value);

    });
    // Set up the click events
    // Player
    $("#submit-player-btn").click(addPlayer);

    // When Player Modal is Displayed
    $("#playerModal").on('shown.bs.modal', function () {
        // Reset the name to empty

        $("#new-player-name").focus();
        // We leave the option the same since in most cases people will be playing off the same tee

    });

    // When the prev hole button is clicked
    $("#prev-hole-btn").click(function(e){
        var currentHole = GameData.currentHole;
        if(currentHole <= 2){
            GameData.currentHole = 1;
            $(e.target).prop("disabled", true);
        }else{
            GameData.currentHole -= 1;
            $("#next-hole-btn").prop("disabled", false);
        }
        buildcard($('input[name="hole-display-option"]:checked').val());
    });

    // When the next hole button is clicked
    $("#next-hole-btn").click(function(e){
        var currentHole = GameData.currentHole;
        if(currentHole >= 17){
            GameData.currentHole = 18;
            $(e.target).prop("disabled", true);
        }else{
            GameData.currentHole += 1;
            $("#prev-hole-btn").prop("disabled", false);
        }
        buildcard($('input[name="hole-display-option"]:checked').val());
    });

    // Modal add player text
    $("#new-player-name").keyup(nameChange);

    // Added to player hole text input to make it select entire text value to make editing easier
    function selectContents(e) {
        $(this)
            .one('mouseup', function () {
                $(this).select();
                return false;
            })
            .select();
        var element = $(e.target);
        var holeNum =  +(element.data("hole"));
        console.log(holeNum);
        // Set the current hole to this whole
        GameData.currentHole = holeNum;
    }

    // Set up page hole display based on what the screen size is and what the current hole is
    $(window).resize(function(){
        // Get the width =
        var w = $(window).width();

        if ( w < 725){ // Set it to single mode
            $("#r-single").prop('checked', true).change();
        }else if ( w < 1365) { // Need to display either front or back 9
            console.log($(window).width());
            if(GameData.currentHole < 10){ // Display the Front 9
                $("#r-front").prop('checked', true).change();
            }else{ // Display the Back 9
                $("#r-back").prop('checked', true).change();
            }
        }else{
            $("#r-all").prop('checked', true).change();
        }
    });

    // Set up the select course button in the select course modal to change the
    $("#select-course-btn").click(function(){
        getCoureseInfo($('input[name="course-selected"]:checked').val());
        // Close the modal
        $("#courseModal").modal("hide");
    });

    // ********** //
    // Ajax calls //
    // ********** //
    function getCoureseInfo(courseID){

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                GameData.courseData = JSON.parse(xhttp.responseText);
                // Clear out the player data
                if (GameData.players.length > 0) {
                    GameData.players = [];
                }
                if(GameData.courseData.course.hole_count < 10){
                    // Hide the back 9 radio button and front
                    // Because if there are only 9 holes, the all and back options are irrelevant
                    $("#display-r-all").hide();
                    $("#display-r-back").hide();
                    // Select the front 9 radio button
                    $("#r-front").prop("checked", "checked");
                    buildcard("front");
                }else{
                    $("#display-r-all").show();
                    $("#display-r-back").show();
                    // Select the front 9 radio button
                    $("#r-all").prop("checked", "checked");
                    buildcard("all");
                }
            }

        };
        xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + courseID, true);
        xhttp.send();
    }
    // Get the current location of the user
    function getCurrentLocationByGeo() {
        var pos = {};
        navigator.geolocation.getCurrentPosition(function(position){
            pos.latitude = position.coords.latitude;
            pos.longitude =  position.coords.longitude;
            pos.radius = 30;
            var xhr = $.post("https://golf-courses-api.herokuapp.com/courses/", pos, "json");
            xhr.done(function(data){
                //console.log(JSON.parse(data));
                GameData.coursesLocalData = JSON.parse(data);
                for(var i = 0; i < GameData.coursesLocalData.courses.length; i++){
                    buildCourseRow(GameData.coursesLocalData.courses[i]);
                }
            });
        });
    }

    // Initialize
    getCoureseInfo(18300);

    // Get the local class data at load so that it is ready when the user clicks the button
    getCurrentLocationByGeo();
})();