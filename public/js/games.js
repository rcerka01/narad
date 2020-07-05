function getGames(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findGameByDate",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(msgGames) {
            var resultsGames = msgGames.results.reverse();
            var totalGames = msgGames.total;
            var output = 
                "<hr>"
                + "<h4>ALL GAMES</h4>"
                + "<h5>Total: " + totalGames + "</h5>"
                + "<div>" + gamesTable(resultsGames) + "</div>";
            $('#output').html(output);
        }
    });     
}
