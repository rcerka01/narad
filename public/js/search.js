function search(team1, team2, start, end) {
    $('#output').html("...")
    $('#output2').html("...")
    $('#output3').html("...")
    $('#output4').html("...")

    var team1body1 = { start: start+"", end: end+"", command1: team1 } 
    var team1body2 = { start: start+"", end: end+"", command2: team1 }  

    var team2body1 = { start: start+"", end: end+"", command1: team2 }   
    var team2body2 = { start: start+"", end: end+"", command2: team2 } 

    var homeIds = {
        runName: "runner1Name",
        name: "homeName",
        selectionId: "runner1SelectionId"
    }
    var awayIds = {
        runName: "runner2Name",
        name: "awayName",
        selectionId: "runner2SelectionId"
    }

    $.ajax({
        type: "POST",
        url: "/findLogGameByDate",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team1body1),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
            var resultsHome1 = [];
            (async function loop() { 
                for (var i in runner) {
                    await new Promise(resolve => resolve( 
                        getSearchResults(
                            runner, // loop
                            i, // loop i
                            total, // to signal output
                            '#output', //output div
                            'Home', // for output table only
                            resultsHome1, // results array
                            homeIds) // selection ids
                        )
                    );
                }
            })();  
        }
    }); 
    $.ajax({
        type: "POST",
        url: "/findLogGameByDate",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team1body2),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
            var resultsAway1 = [];
            (async function loop() { 
                for (var i in runner) {
                    await new Promise(resolve => resolve( 
                        getSearchResults(
                            runner, // loop
                            i, // loop i
                            total, // to signal output
                            '#output2', //output div
                            'Away', // for output table only
                            resultsAway1, // results array
                            awayIds) // selection idS
                        )
                    );
                }
            })();  
        }
    });
    $.ajax({
        type: "POST",
        url: "/findLogGameByDate",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team2body1),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
            var resultsHome2 = [];
            (async function loop() { 
                for (var i in runner) {
                    await new Promise(resolve => resolve( 
                        getSearchResults(
                            runner, // loop
                            i, // loop i
                            total, // to signal output
                            '#output3', //output div
                            'Home', // for output table only
                            resultsHome2, // results array
                            homeIds) // selection ids
                        )
                    );
                }
            })();  
        }
    }); 
    $.ajax({
        type: "POST",
        url: "/findLogGameByDate",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team2body2),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
            var resultsAway2 = [];
            (async function loop() { 
                for (var i in runner) {
                    await new Promise(resolve => resolve( 
                        getSearchResults(
                            runner, // loop
                            i, // loop i
                            total, // to signal output
                            '#output4', //output div
                            'Away', // for output table only
                            resultsAway2, // results array
                            awayIds) // selection idS
                        )
                    );
                }
            })();  
        }
    });
}
