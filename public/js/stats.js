function getStats(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findLogGameByDate",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(msgGames) {
        $.ajax({
            type: "POST",
            url: "/findActionByDate",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            success: function(msgActions) { 

                // all games
                var resultsGames = msgGames.results.reverse();
                var totalGames = msgGames.total;

                // all bets
                var resultsActions = msgActions.results;
                var totalActions = msgActions.total;

                // collect successful bets, no results bets and lost bets
                var resultsSuccessfulActions = [];
                var noResultsSuccessfulActions = [];
                var lostSuccessfulActions = [];
                for (var i in resultsActions) {
                    try { var betStatus = resultsActions[i].betStatus.status } catch(e) { var betStatus = "undefined" }
                    if ( betStatus == "SUCCESS") {
                        resultsSuccessfulActions.push(resultsActions[i]);
                        //
                        if ((resultsActions[i].results).length == 0) {
                            noResultsSuccessfulActions.push(resultsActions[i]);
                        }
                        //
                        if (resultsActions[i].results.split(" ")[1] != resultsActions[i].selectionId && resultsActions[i].results.length != 0) {
                            lostSuccessfulActions.push(resultsActions[i]);
                        }
                        //
                    }
                }

                // all successful
                resultsSuccessfulActions.reverse();
                var totalSuccessfulActions = resultsSuccessfulActions.length;

                // all no results
                noResultsSuccessfulActions.reverse();
                var noResultsSuccessfulTotal = noResultsSuccessfulActions.length;

                // all lost
                lostSuccessfulActions.reverse();
                var lostSuccessfulTotal = lostSuccessfulActions.length;

                // graph output in numbers
                var numberOutput =
                    "All Games: <strong>" + totalGames + "</strong><br>"
                    + "Successfully Placed Bets: <strong>" + totalSuccessfulActions + "</strong><br>"
                    + "Lost Bets: <strong>" + lostSuccessfulTotal + "</strong><br>"
                    + "In Play Bets (or unknown result): <strong>" + noResultsSuccessfulTotal + "</strong>"

                // chart    
                var chartData = [totalGames, totalSuccessfulActions, lostSuccessfulTotal, noResultsSuccessfulTotal];
                drawStatsGraph("statsGraph", chartData);

                // output
                var output = 
                    numberOutput
                    + "<hr>"
                    + "<h4>LOST GAMES</h4>"
                    + "<div style='border: 2px solid red;'>" + betsTable(lostSuccessfulActions) + "</div>"
                    + "<hr>"
                    + "<h4>IN PLAY GAMES (or unknown result)</h4>"
                    + "<div style='border: 2px solid yellow;'>" + betsTable(noResultsSuccessfulActions) + "</div>" 
                    + "<hr>"
                    + "<h4>SUCCESSFULY PLACED BETS</h4>"
                    + "<div style='border: 2px solid green'>" + betsTable(resultsSuccessfulActions) + "</div>"
                    + "<hr>"
                    + "<h4>ALL GAMES</h4>"
                    + "<div style='border: 2px solid blue'>" + gamesTable(resultsGames) + "</div>";
                
                $('#output').html(output);
        }});     
    }});
}
