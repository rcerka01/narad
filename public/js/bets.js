function getBets(start, end) {
    var body = { start: start+"", end: end+"" };
        $.ajax({
            type: "POST",
            url: "/findBetByDate",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            success: function(msgBets) { 

                // all bets
                var results = msgBets.results.reverse();
                var totalBets = msgBets.total;

                var successfulCount = 0;
                var failureCount = 0;
                var lostCount = 0;
                var errorCount = 0;

                var onePoundProfit = 0;

                // decorate and collect totals
                for (var i in results) {
                    var teams = results[i].gameName.split(" v ")

                    try { 
                        var resultDiv =  results[i].score.home.score - results[i].score.away.score 
                      } catch(e) { 
                        var resultDiv = 999; 
                      }
                      
                    if ( resultDiv == 999) 
                        { var winer = "unknown"; }
                    else if ( resultDiv > 0) 
                        { var winer = teams[0]; }
                    else if ( resultDiv < 0) 
                        { var winer = teams[1]; }
                    else { var winer = "The Draw"; }  

                    if (results[i].betStatus.status == "SUCCESS") {
                        onePoundProfit = onePoundProfit + (results[i].price - 1);
                        successfulCount++; }
                    if (results[i].betStatus.status == "SUCCESS")
                        { failureCount++; }
                    if (winer.toUpperCase() != results[i].placedOn.toUpperCase() && winer != "unknown") 
                        { lostCount++; }
                    if (winer == "unknown" && moment(dateFromObjectId(results[i]._id)).isBefore(moment().subtract(30, 'minutes')))
                        { errorCount++; }
                }
  
                var chartData = [
                    totalBets,
                    successfulCount,
                    failureCount,
                    lostCount,
                    errorCount]

                drawBetsGraph("betsGraph", chartData);

                // output
                var output = 
                    "<hr>"
                    + "One Pound Bet Proffit: <span style='color:pink;'>" + onePoundProfit.toFixed(2) + "</span>"
                    + "<hr>"
                    + "<h4>ALL BETS</h4>"
                    + betsTable(results)
                
                $('#output').html(output);
        }});     
}
