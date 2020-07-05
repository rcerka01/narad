function getGame(eventId){
  var body = { find: { "eventId": eventId } };
  $.ajax({
     type: "POST",
     url: "/findGamesQuery",
     contentType: "application/json; charset=utf-8",
     data: JSON.stringify(body),
     success: function(msg) {
        var results = msg.results;

        if (results.length > 0) {

          var ud = results[0].updateDetails; 
          var updates = "";

          for (var i in ud) {
            updates = updates + "<tr><th>" + ud[i].matchTime + "</th><td>" + ud[i].type + "</td><td>" + ud[i].teamName + "</td><td>" + ud[i].team + "</td></tr>";
          }

          var output =
            "<hr>" +
            "<h4>" + results[0].score.home.name + " v " + results[0].score.away.name + "</h4>" +
            "<hr>" +
            "<a href='/search?team1=" + results[0].score.home.name + "&team2=" + results[0].score.away.name + "' target='_blank'>SEARCH</a>" +
            "<hr>" +
            "<table><tr>" +
            "<th>Id</th><td>" + results[0].eventId + "</td></tr>" +
            "<th>Score</th><td>" + results[0].score.home.score + " : " + results[0].score.away.score + "</td></tr>" +
            "<th>Status</th><td>" + results[0].status + "</td></tr>" +
            "<th>Booking points</th><td>" + results[0].score.bookingPoints + "</td></tr>" +
            "<th>Corners</th><td>" + results[0].score.numberOfCorners + "</td></tr>" +
            "<th>Corners 1st half</th><td>" + results[0].score.numberOfCornersFirstHalf + "</td></tr>" +
            "<th>Corners 2nd half</th><td>" + results[0].score.numberOfCornersSecondHalf + "</td></tr>" +
            "<th>Cards</th><td>" + results[0].score.numberOfCards + "</td></tr>" +
            "<th>Yellow</th><td>" + results[0].score.numberOfYellowCards + "</td></tr>" +
            "<th>Red</th><td>" + results[0].score.numberOfRedCards+ "</td></tr>" +
            "</table>" +

            "<br>" +
            "<table>" +
            "<tr><th></th><th>" + results[0].score.home.name + "</th><th>" + results[0].score.away.name + "</th></tr>" +
            "<tr><th>Booking points</th><td>" + results[0].score.home.bookingPoints + "</td><td> " + results[0].score.away.bookingPoints + "</td></tr>" +
            "<tr><th>Corners</th><td>" + results[0].score.home.numberOfCorners + "</td><td> " + results[0].score.away.numberOfCorners + "</td></tr>" +
            "<tr><th>Corners 1st half</th><td>" + results[0].score.home.numberOfCornersFirstHalf + "</td><td> " + results[0].score.away.numberOfCornersFirstHalf + "</td></tr>" +
            "<tr><th>Corners 2nd half</th><td>" + results[0].score.home.numberOfCornersSecondHalf + "</td><td> " + results[0].score.away.numberOfCornersSecondHalf + "</td></tr>" +
            "<tr><th>Cards</th><td>" + results[0].score.home.numberOfCards + "</td><td> " + results[0].score.away.numberOfCards + "</td></tr>" +
            "<tr><th>Yellow</th><td>" + results[0].score.home.numberOfYellowCards + "</td><td> " + results[0].score.away.numberOfYellowCards + "</td></tr>" +
            "<tr><th>Red</th><td>" + results[0].score.home.numberOfRedCards + "</td><td> " + results[0].score.away.numberOfRedCards + "</td></tr>" +
            "<tr><th>Sets</th><td>" + results[0].score.home.sets + "</td><td> " + results[0].score.away.sets + "</td></tr>" +
            "<tr><th>Games</th><td>" + results[0].score.home.games + "</td><td> " + results[0].score.away.games + "</td></tr>" +
            "<tr><th>Penalties score</td><td>" + results[0].score.home.penaltiesScore + "</td><td> " + results[0].score.away.penaltiesScore + "</td></tr>" +
            "<tr><th>Penalties seq</th><td>" + results[0].score.home.penaltiesSequence + "</td><td> " + results[0].score.away.penaltiesSequence + "</td></tr>" +
            "<tr><th>Half time score</th><td>" + results[0].score.home.halfTimeScore + "</td><td> " + results[0].score.away.halfTimeScore + "</td></tr>" +
            "<tr><th>Full time score</th><td>" + results[0].score.home.fullTimeScore + "</td><td> " + results[0].score.away.fullTimeScore + "</td></tr>" +
            "<tr><th>Score</th><td>" + results[0].score.home.score + "</td><td> " + results[0].score.away.score + "</td></tr>" +
            "</table>" + 

            "<br>" +
            "<table>" +
            "<tr><th>Time</th><th>Event</th><th>Team</th><th>Home</th></tr>" +
            updates +
            "</table>"
 
            $('#game').html(output);
        } else {
          $('#game').html("Can't retrieve the game");
        }
    }    
  }); 
}
