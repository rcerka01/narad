function findResult(eventId, results) {
    var gameResult = (results.find(rr => (rr.logResult[0].eventId == eventId)))
    if (typeof gameResult !== "undefined") { 
        var selectionId  = (gameResult.logResult[0].item.runners)
            .map(runner => { if (runner.status == "WINNER") { return runner.selectionId } })
            .join(''); 
    } else {
        var selectionId = "undefined";
    }
    return selectionId ;
}

/////////////////////////////////////////////////////////////////////////////////

function getData(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findLogGameByDate",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(msgGames) {
        // $.ajax({
        //     type: "POST",
        //     url: "/findLogResultsByDate",
        //     contentType: "application/json; charset=utf-8",
        //     data: JSON.stringify(body),
        //     success: function(msgResults) {

            console.log("HALLO")

                var totalGames = msgGames.total;
                var resultsGames = msgGames.results;
                var distinctGamesEventsIds = Array.from(new Set(resultsGames.map(g=>g.logGame.eventId)))

                console.log("xxx " + distinctGamesEventsIds.slice(0,320));

                var bodySearch = {
                    eventIds: distinctGamesEventsIds.slice(0,320),// [28655556,28654454],
                    month: 1
                }
                $.ajax({
                    type: "POST",
                    url: "/searchByEventId",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(bodySearch),
                    success: function(msgSearch) {

//                 var totalResults = msgResults.total;
//                 var resultsResults = msgResults.results; 
//                 var distinctResultsEventsIds = Array.from(new Set(resultsResults.map(r=>r.logResult[0].eventId)))
                              

//                 var result = resultsGames.map ( game => {
                    
//                     var eventId = game.logGame.eventId;
//                     var name1 = game.logGame.runners.runner1Name;
//                     var name2 = game.logGame.runners.runner2Name;
//                     var selection1 = game.logGame.runners.runner1SelectionId;
//                     var selection2 = game.logGame.runners.runner2SelectionId;
//                     var selectionDraw = game.logGame.runners.drawSelectionId;
//                     var winner = findResult(eventId, resultsResults);

//                     return {
//                         eventId: eventId,
//                         name1: name1,
//                         name2: name2,
//                         selection1: selection1,
//                         selection2: selection2,
//                         selectionDraw: selectionDraw,
//                         WINNER: winner,
//                         };
//                     }
//                 );
                    



                var output = "Total games: " + totalGames + "<br>"
                output = output + "Total games ids distinct: " + distinctGamesEventsIds.length + "<br><br>"
                output = output + "Search: " + JSON.stringify(msgSearch) + "<br><br>"

                

//                 output = output + "Total results: " + totalResults + "<br>"
//                 output = output + "Total results ids distinct: " + distinctResultsEventsIds.length + "<br><br>"

//                 output = output + "result: " + JSON.stringify(result) + "<br><br>"


                $('#output').html(output);
 
        },
        timeout: 3000000});
    }});
}
