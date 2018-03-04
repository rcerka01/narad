function getGame(eventId){
  var body = { find: { "logGame.eventId": eventId } };
  $.ajax({
     type: "POST",
     url: "/findLogGameQuery",
     contentType: "application/json; charset=utf-8",
     data: JSON.stringify(body),
     success: function(msg) {
        var results = msg.results;

        var output =
        "<hr>" +
        "<h4>" + results[0].logGame.eventName + "</h4>" +
        "<hr>" +
        "<a href='/search?team1=" + results[0].logGame.runners.runner1Name + "&team2=" + results[0].logGame.runners.runner2Name + "' target='_blank'>SEARCH</a>"  
        "<hr>" +
        "<p>" + 
          results[0].logGame.competitionName + " | " + 
          results[0].logGame.countryCode + " | " + 
          "<strong>Start:</strong> " + results[0].logGame.startTime.substring(0, 10) + " " + results[0].logGame.startTime.substring(11, 16) +
        "</p>" +
        "<table>" +
          "<tr>" +
            "<td>" + results[0].logGame.runners.runner1Name + " - " + results[0].logGame.runners.runner1SelectionId + "</td>" +
            "<td style='padding-left:20px;'>" + "<strong>Home: </strong>" + results[0].logGame.homeName + "</td>" +
          "</tr>" +
          "<tr>" +
            "<td>" + results[0].logGame.runners.runner2Name + " - " + results[0].logGame.runners.runner2SelectionId + "</td>" +
            "<td style='padding-left:20px;'>" + "<strong>Away: </strong>" + results[0].logGame.awayName + "</td>" +
          "</tr>" +
          "<tr>" +              
            "<td>" + results[0].logGame.runners.drawName + " - " + results[0].logGame.runners.drawSelectionId + "</td>" +
          "</tr>" +
        "</table>" +
        "<span style=font-size:8px;>Taken at: " + dateFromObjectId(results[0]._id) + "</span>";

        $('#game').html(output);
    }    
  }); 
}

//###################################################################################

function getResult(eventId){
  var body = { find: { "logResult.eventId": eventId } };
  $.ajax({
     type: "POST",
     url: "/findLogResultQuery",
     contentType: "application/json; charset=utf-8",
     data: JSON.stringify(body),
     success: function(msg) {

        var results = msg.results;
        var runners = results[0].logResult[0].item.runners;

        var winner = "";
        for (var i in runners) {
          if (runners[i].status == "WINNER") {
            winner = runners[i].selectionId;
          }
        }

        var output =
        "<hr>" +        
        "<h4>" + "WINNER: " + winner  + "</h4>"

        $('#result').html(output);
    }    
  }); 
}

//###################################################################################

function getStats(eventId){
  var body = { find: { "logStatus.gameStatus.eventId": eventId } };
  $.ajax({
     type: "POST",
     url: "/findLogStatusQuery",
     contentType: "application/json; charset=utf-8",
     data: JSON.stringify(body),
     success: function(msg) {

      var total = msg.total;
      var results = msg.results;

      // latest stat
      var lastStat = results.slice(-1).pop();

      try { var homeName = lastStat.logStatus.gameStatus.score.home.name } catch(e) { var homeName = "" }
      try { var awayName = lastStat.logStatus.gameStatus.score.away.name } catch(e) { var awayName = "" }

      try { var homeScore = lastStat.logStatus.gameStatus.score.home.score } catch(e) { var homeScore = "" }
      try { var awayScore = lastStat.logStatus.gameStatus.score.away.score } catch(e) { var awayScore = "" }

      try { var numberOfYellowCards = lastStat.logStatus.gameStatus.score.numberOfYellowCards } 
        catch(e) { var numberOfYellowCards = "-" }
      try { var numberOfRedCards = lastStat.logStatus.gameStatus.score.numberOfRedCards } 
        catch(e) { var numberOfRedCards = "-" }
      try { var numberOfCards = lastStat.logStatus.gameStatus.score.numberOfCards } 
        catch(e) { var numberOfCards = "-" }
      try { var numberOfCorners = lastStat.logStatus.gameStatus.score.numberOfCorners } 
        catch(e) { var numberOfCorners = "-" }
      try { var numberOfCornersFirstHalf = lastStat.logStatus.gameStatus.score.numberOfCornersFirstHalf } 
        catch(e) { var numberOfCornersFirstHalf = "-" }
      try { var numberOfCornersSecondHalf = lastStat.logStatus.gameStatus.score.numberOfCornersSecondHalf} 
        catch(e) { var numberOfCornersSecondHalf = "-" }
      try { var bookingPoints = lastStat.logStatus.gameStatus.score.bookingPoints } 
        catch(e) { var bookingPoints = "-" }

      var outputScore =
        "<hr>"
        + "<h4>SCORE: " + homeScore + " " + homeName + " : " + awayScore + " " + awayName + "</h4>"
        + "<h3 style='color:pink;'>" + homeScore  + " : " + awayScore  + "</h3>"
        + addRow(homeName, results, "score", "home", true)
        + addRow(awayName, results, "score", "away", false)
        + addBottom;

      $('#score').html(outputScore);

      var outputMarketTable =
      "<h4>MARKET</h4>"
      + marketTable(results);
      $('#markettable').html(outputMarketTable);   

      var outputStats =
      "<h4>" + homeName + " :: OTHER EVENTS</h4>"
       + addRow("Penalties Score", results, "penaltiesScore", "home", true)
       + addRow("Games", results, "games", "home", false)
       + addRow("Sets", results, "sets", "home", false)
       + addRow("Number Of Yellow Cards", results, "numberOfYellowCards", "home", false)
       + addRow("Number Of Red Cards", results, "numberOfRedCards", "home", false)
       + addRow("Number Of Cards", results, "numberOfCards", "home", false)
       + addRow("Number Of Corners", results, "numberOfCorners", "home", false)
       + addRow("Booking Points", results, "bookingPoints", "home", false)
       + addBottom
       + "<h4>" + awayName + " :: OTHER EVENTS</h4>"
       + addRow("Penalties Score", results, "penaltiesScore", "away", true)
       + addRow("Games", results, "games", "away", false)
       + addRow("Sets", results, "sets", "away", false)
       + addRow("Number Of Yellow Cards", results, "numberOfYellowCards", "away", false)
       + addRow("Number Of Red Cards", results, "numberOfRedCards", "away", false)
       + addRow("Number Of Cards", results, "numberOfCards", "away", false)
       + addRow("Number Of Corners", results, "numberOfCorners", "away", false)
       + addRow("Booking Points", results, "bookingPoints", "away", false)
       + addBottom
       + "<h4>OTHER EVENTS (TOTAL)</h4>"
       + "<p>"
       + "Number Of Yellow Cards:<strong> " + numberOfYellowCards + "</strong><br>"
       + "Number Of Red Cards:<strong> " + numberOfRedCards + "</strong><br>"
       + "Number Of Cards:<strong> " + numberOfCards + "</strong><br>"
       + "Number Of Corners:<strong> " + numberOfCorners + "</strong><br>"
       + "Number Of Corners in First Half:<strong> " + numberOfCornersFirstHalf + "</strong><br>"
       + "Number Of Corners in Second Half:<strong> " + numberOfCornersSecondHalf + "</strong><br>"
       + "Booking Points:<strong> " + bookingPoints + "</strong>"
       "</p>";

      $('#stats').html(outputStats)
    }    
  }); 
}

//###################################################################################

function getMarkets(eventId){
  var body = { find: { "logMarket.eventId": eventId } };
  $.ajax({
     type: "POST",
     url: "/findLogMarketQuery",
     contentType: "application/json; charset=utf-8",
     data: JSON.stringify(body),
     success: function(msg) {

      var selectionId = msg.results[0].logMarket.market.item.runners[0].selectionId;      
      var availableToBack = msg.results[0].logMarket.market.item.runners[0].ex.availableToBack;
      var itemsPrices = getItemsPrices(availableToBack);
      drawChart("back0", itemsPrices.items, itemsPrices.prices, "Available to Back", "#3e95cd", selectionId);
      var availableToLay = msg.results[0].logMarket.market.item.runners[0].ex.availableToLay;
      var itemsPrices = getItemsPrices(availableToLay);
      drawChart("lay0", itemsPrices.items, itemsPrices.prices, "Available to Lay", "#3e95cd", selectionId);
      var tradedVolume = msg.results[0].logMarket.market.item.runners[0].ex.tradedVolume;
      var itemsPrices = getItemsPrices(tradedVolume);
      drawChart("traded0", itemsPrices.items, itemsPrices.prices, "Traded Volume", "#3e95cd", selectionId);

      var selectionId = msg.results[0].logMarket.market.item.runners[1].selectionId;      
      var availableToBack = msg.results[0].logMarket.market.item.runners[1].ex.availableToBack;
      var itemsPrices = getItemsPrices(availableToBack);
      drawChart("back1", itemsPrices.items, itemsPrices.prices, "Available to Back", "#3cba9f", selectionId);
      var availableToLay = msg.results[0].logMarket.market.item.runners[1].ex.availableToLay;
      var itemsPrices = getItemsPrices(availableToLay);
      drawChart("lay1", itemsPrices.items, itemsPrices.prices, "Available to Lay", "#3cba9f", selectionId);
      var tradedVolume = msg.results[0].logMarket.market.item.runners[1].ex.tradedVolume;
      var itemsPrices = getItemsPrices(tradedVolume);
      drawChart("traded1", itemsPrices.items, itemsPrices.prices, "Traded Volume", "#3cba9f", selectionId);

      var selectionId = msg.results[0].logMarket.market.item.runners[2].selectionId;      
      var availableToBack = msg.results[0].logMarket.market.item.runners[2].ex.availableToBack;
      var itemsPrices = getItemsPrices(availableToBack);
      drawChart("back2", itemsPrices.items, itemsPrices.prices, "Available to Back", "#c45850", selectionId);
      var availableToLay = msg.results[0].logMarket.market.item.runners[2].ex.availableToLay;
      var itemsPrices = getItemsPrices(availableToLay);
      drawChart("lay2", itemsPrices.items, itemsPrices.prices, "Available to Lay", "#c45850", selectionId);
      var tradedVolume = msg.results[0].logMarket.market.item.runners[2].ex.tradedVolume;
      var itemsPrices = getItemsPrices(tradedVolume);
      drawChart("traded2", itemsPrices.items, itemsPrices.prices, "Traded Volume", "#c45850", selectionId);
    }    
  }); 
}
