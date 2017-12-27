
var resultsHome1 = [];
var resultsAway1 = [];
var resultsHome2 = [];
var resultsAway2 = [];



function search(team1, team2) {
    var team1body1 = { "find": { "logGame.runners.runner1Name": team1 } }   
    var team1body2 = { "find": { "logGame.runners.runner2Name": team1 } }   

    var team2body1 = { "find": { "logGame.runners.runner1Name": team2 } }   
    var team2body2 = { "find": { "logGame.runners.runner2Name": team2 } } 

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
        url: "/findLogGameQuery",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team1body1),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
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
        url: "/findLogGameQuery",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team1body2),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
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
        url: "/findLogGameQuery",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team2body1),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
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
        url: "/findLogGameQuery",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(team2body2),
        success: function(msg) { 
            var runner = msg.results;
            var total = msg.total;
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





