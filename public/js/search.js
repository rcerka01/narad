function search(home, away, start, end) {
    var body = {
        start: start+"",
        end: end+"",
        home: home,
        away: away } 

    $.ajax({
        type: "POST",
        url: "/findGamesByDateAndTeam",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(body),
        success: function(msg) { 
        searchTable(msg, home, away);
        }
    }); 
}
