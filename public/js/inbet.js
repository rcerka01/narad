function getTimedAccount(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findLogAccountByDate",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(msg) { 
        $.ajax({
          type: "POST",
          url: "/findActionByDate",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify(body),
          success: function(msgActions) { 

            // current bets
            var resultsActions = msgActions.results.reverse();
            var noResultsSuccessfulActions = [];
            for (var i in resultsActions) {
                try { var betStatus = resultsActions[i].betStatus.status } catch(e) { var betStatus = "undefined" }
                if ( betStatus == "SUCCESS") {
                  if ((resultsActions[i].results).length == 0) {
                    noResultsSuccessfulActions.push(resultsActions[i]);
                  }
                }
            }
            var outputBet =  "<div style='border: 2px solid yellow;'>" + betsTable(noResultsSuccessfulActions) + "</div>" 
            $('#currentbets').html(outputBet);
            //

            var results = msg.results;
            var total= msg.total;

            var balance = [];
            var times = [];
            var exposure = [];
            var total = [];

            results.map(item => 
              {
                  balance.push(item.logAccount.available_to_bet);
                  exposure.push(item.logAccount.exposure);
                  total.push(item.logAccount.available_to_bet - item.logAccount.exposure) 
                  times.push(moment(dateFromObjectId(item._id)).format("dd Do, hA"));
              });

              accountProfitChart("profitchart", times, total);
              accountChart("chart", balance, exposure, times, total);

            if (total.length > 0) {
              var profit = (total[total.length-1] - total[0]).toFixed(2);
              var output = 
              "<hr>" 
              + "<h4>TOTAL</h4>"
              + "Start Today: <strong>" + total[0].toFixed(2) + "</strong>,  "
              + "Profit Today: <strong>" + profit + "</strong>, "
              + "Current Status: <strong><span style='color:red;'>" + total[total.length-1].toFixed(2) + "£</span></strong><br>  "
              + "Exposure: <strong><span style='color:red;'>" + results[results.length-1].logAccount.exposure + "£</span></strong><br>  "
              + "Points: <strong>" + results[results.length-1].logAccount.points + "</strong>, "
              + "Commision <strong>" + results[results.length-1].logAccount.commision + "</strong>, "
              + "Discount: <strong>" + results[results.length-1].logAccount.discount + "</strong>, "
              + "Exposure Limit: <strong>" + results[results.length-1].logAccount.exposure_limit+ "</strong>, "
              $('#output').html(output);
            } else {
              $('#output').html("");
            }     
        }});
    }});
}
