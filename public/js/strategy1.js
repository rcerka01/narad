function getProbsAndValsQuick(arr, isInPlay) {
    return getProbsAndVals(arr, isInPlay, "", arr, false)
}

function getResultsFromValueBets(game, values) {
    var out = [];
    var home = values.homeVals;
    var draw = values.drawVals;
    var away = values.awayVals;

    for (var i in home) {

        if (home[i] > 0 ) {
            if (game.score.home.score > game.score.away. score) { var win = true; } else { var win = false; }
            out.push({
                eventId: game.eventId,
                openDate: game.openDate,
                oddTime: values.updates[i],
                side: "home",
                odd: home[i],
                win: win
            })
        }

        if (draw[i] > 0 ) {
            if (game.score.home.score == game.score.away. score) { var win = true; } else { var win = false; }
            out.push({
                eventId: game.eventId,
                openDate: game.openDate,
                oddTime: values.updates[i],
                side: "draw",
                odd: draw[i],
                win: win
            })
        }

        if (away[i] > 0 ) {
            if (game.score.home.score < game.score.away. score) { var win = true; } else { var win = false; }
            out.push({
                eventId: game.eventId,
                openDate: game.openDate,
                oddTime: values.updates[i],
                side: "away",
                odd: away[i],
                win: win
            })
        }
    }

    return out;
}


function formOutput(data) {
    var output = "";
    for (var a in data) {
        output = output + data[a].eventId + " " + data[a].openDate + " -- " + data[a].oddTime + " " + data[a].side + " " + data[a].odd + " " + data[a].win + " <br>"
    }
    return output;
}

function getGames(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findGameByDate",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(msgGames) {
            var resultsGames = msgGames.results.reverse();

            var compleated = 0;
            var valueBets = [];

            for (var a in resultsGames) {
                var game = resultsGames[a];
                if (game.status !== undefined && game.markets !== undefined && game.status == "COMPLETE") {
                    compleated++;

                    var vals = getProbsAndValsQuick(game.markets[0].combined.back, true)
                    var results = getResultsFromValueBets(game, vals) 
                    if (results !== undefined && results.length > 0) { 
                        valueBets = valueBets.concat(results);
                     }
                }
            }






            var totalGames = msgGames.total;
            var output = 
                "<hr>"
                + "<h4>Back Value Bets</h4>"
                + "<h5>Total: " + totalGames + "</h5>"
                + "<h5>Compleated: " + compleated + "</h5>"
                + "Start <br>"
                + formOutput(valueBets);
                + "End <br>"

            $('#output').html(output);
        }
    });     
}
