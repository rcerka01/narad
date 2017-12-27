function getBets(start, end) {
    var body = { start: start+"", end: end+"" };
        $.ajax({
            type: "POST",
            url: "/findActionByDate",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            success: function(msgActions) { 

                // all bets
                var resultsActions = msgActions.results.reverse();
                var totalActions = msgActions.total;

                var successfulCount = 0; // grey
                var zeroBetCount = 0; // pink
                var otherFailCount = 0; // other red
                var noResultCount = 0; // yellow
                var lostCount = 0; // red

                // decorate and collect totals
                for (var i in resultsActions) {

                    if (resultsActions[i].back == 0) {
                        zeroBetCount++;
                        resultsActions[i].color = "pink";
                    }
                    
                    try { var betStatus = resultsActions[i].betStatus.status } catch(e) { var betStatus = "undefined" }
                    if ( betStatus == "SUCCESS") {
                        successfulCount++;
                    }
                    if ( betStatus == "FAILURE" && resultsActions[i].back > 0) {
                        otherFailCount++;
                        resultsActions[i].color = "#ff8080";
                    }

                    if ((resultsActions[i].results).length == 0) {
                        noResultCount++;
                        resultsActions[i].color = "yellow";
                    }

                    if (resultsActions[i].results.split(" ")[1] != resultsActions[i].selectionId && resultsActions[i].results.length != 0) {
                        lostCount++;
                        resultsActions[i].color = "red";
                    }
                }
  
                var chartData = [
                    totalActions,
                    successfulCount,
                    zeroBetCount, 
                    otherFailCount, 
                    noResultCount,
                    lostCount];
                drawBetsGraph("betsGraph", chartData);

                // output
                var output = 
                    "<hr>"
                    + "<h4>ALL BETS</h4>"
                    + betsTable(resultsActions)
                
                $('#output').html(output);
        }});     
}