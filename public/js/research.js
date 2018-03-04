function getData(start, end) {
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
                $.ajax({
                    type: "POST",
                    url: "/findLogResultsByDate",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(body),
                    success: function(msgResults) {

                        var totalGames = msgGames.total;
                        var resultsGames = msgGames.results;
                        var distinctGamesEventsIds = Array.from(new Set(resultsGames.map(g=>g.logGame.eventId)))

                        var totalActions = msgActions.total;
                        var resultsActions = msgActions.results;
                        var distinctActionsEventsIds = Array.from(new Set(resultsActions.map(a=>a.eventId)))
                        var successfulActions = resultsActions.filter(a => a.betStatus.status == "SUCCESS");

                        var totalResults = msgResults.total;
                        var resultsResults = msgResults.results; 
                        var distinctResultsEventsIds = Array.from(new Set(resultsResults.map(r=>r.logResult[0].eventId)))
                        /// CALCULATE, THIS IS IMPORTANT
                        var resultsMissing = 0;
                        ///

                        /// NOT IN USE, BUT CAN BE JOINED THIS WAY
                        var gamesActions = resultsGames.map(game => {
                            try { var action = successfulActions.filter(action => action.eventId == game.logGame.eventId)[0]; } 
                            catch(e) { var action = ""; }
                            return {
                                game: game,
                                action: action
                            };
                        });
                        ///

                        var output = "Total games: " + totalGames + "<br>"
                        output = output + "Total games distinct: " + distinctGamesEventsIds.length + "<br><br>"

                        output = output + "Total results: " + totalResults + "<br>"
                        output = output + "Total results distinct: " + distinctResultsEventsIds.length + "<br><br>"

                        output = output + "Total actions: " + totalActions + "<br>"
                        output = output + "Total actions distinct: " + distinctActionsEventsIds.length + "<br><br>"
                        output = output + "Total successful actions: " + successfulActions.length + "<br>"

                        // var homeWinners = 0;
                        // var awayWinners = 0;
                        // var drawWinners = 0;

                        // var lostBets80 = 0;

                        // var data = resultsGames.map(rg => {
                        //     // get winner
                        //     try { 
                        //         var winnerSelectionId = resultsResults
                        //         .find(rr => (rr.logResult[0].eventId == rg.logGame.eventId)).logResult[0].item.runners
                        //         .map(r => { if (r.status == "WINNER") return r.selectionId })
                        //         .join(''); 
                        //     } catch(e) { 
                        //         resultsMissing ++; 
                        //         var winnerSelectionId = ""; 
                        //     };
                        //     // home or away
                        //     if (rg.logGame.runners.runner1SelectionId == winnerSelectionId) homeWinners++;
                        //     if (rg.logGame.runners.runner2SelectionId == winnerSelectionId) awayWinners++;
                        //     if (rg.logGame.runners.drawSelectionId == winnerSelectionId) drawWinners++;


                        //     // placed 80 min bets
                        //     // placed
                        //     try { 
                        //         var placedSelectionId80 = resultsActions.find(ra => ra.eventId == rg.logGame.eventId && ra.elapsedTime >= 75 && ra.elapsedTime <= 85).selectionId;
                        //         var placedEventId80xxx = resultsActions.find(ra => ra.eventId == rg.logGame.eventId).eventId;
                        //     } catch(e) { 
                        //         var placedSelectionId80 = ""; 
                        //         var placedEventId80xxx = "c"; 
                        //     };
                        //     // lost
                        //     if (placedSelectionId80 != "" && winnerSelectionId != "" && winnerSelectionId != placedSelectionId80) {
                        //         lostBets80++
                        //         lostBets80Color = "red";
                        //     } else {
                        //         lostBets80Color = "white";
                        //     }

                        //     // data to render output
                        //     return {
                        //         eventId: rg.logGame.eventId,
                        //         runner1SelectionId: rg.logGame.runners.runner1SelectionId,
                        //         runner2SelectionId: rg.logGame.runners.runner2SelectionId,
                        //         drawSelectionId: rg.logGame.runners.drawSelectionId,
                        //         winnerSelectionId: winnerSelectionId,
                        //         placedSelectionId80: placedSelectionId80,
                        //         lostBets80Color: lostBets80Color,
                        //         placedEventId80xxx: placedEventId80xxx
                        //     }
                        // });

                        // /////////////////////////////////////////////////////////////////////////////////
                        // // results
                        // var gamesWithResults = totalGames - resultsMissing;
                        // var homeWinnersPer = Math.round((homeWinners * 100 / gamesWithResults),0); 
                        // var awayWinnersPer = Math.round((awayWinners * 100 / gamesWithResults),0); 
                        // var drawWinnersPer = Math.round((drawWinners * 100 / gamesWithResults),0);

                        // // 80min
                        // var count80min = 0;
                        // data.map(d => { if (d.placedSelectionId80 != "") { count80min++; } });
                        // //var b = data.map(d => { if (d.placedEventId80xxx != "") { d.placedEventId80xxx; } });
                        // var b = JSON.stringify(data.map(d => d.placedEventId80xxx).filter(x=>x !="c")); 
                        

                        // // OUTPUT RENDERING
                        // var games = data.map(x =>
                        //     "<tr><td>" 
                        //     + x.eventId + "</td><td>"
                        //     + x.runner1SelectionId + "<br>"
                        //     + x.runner2SelectionId + "<br>"
                        //     + x.drawSelectionId + "</td><td>"
                        //     + x.winnerSelectionId + "</td><td style='background-color:" + x.lostBets80Color + ";'>"
                        //     + x.placedSelectionId80 + "</td></tr>"
                        // );

                        // var output = "<table><tr><td class='texttable'>"
                        // output = output + "Total games: " + totalGames + "<br>";
                        // output = output + "Total bets: " + totalActions + "<br>";
                        // output = output + "Results missing: " + resultsMissing + "<br>";
                        // output = output + "Games with results: " + gamesWithResults + "<br>";
                        // output = output + "Home Winners: " + homeWinnersPer + "%<br>";
                        // output = output + "Away Winners: " + awayWinnersPer + "%<br>";
                        // output = output + "Draw Winners: " + drawWinnersPer + "%</td><td class='texttable'>";

                        // output = output + "Total 80min bets: " + count80min + "<br>";
                        // output = output + "Lost 80min bets: " + lostBets80 + "<br>";

                        // output = output + "</td></tr></table>";
                        
                        // output = output + "<table><tr><th>eventId</th><th>selections</th><th>winner</th><th>@80min</th></tr>"
                        // output = output + games;
                        // output = output + "</table>"

                         $('#output').html(output);

        }});     
    }});     
}});
}
