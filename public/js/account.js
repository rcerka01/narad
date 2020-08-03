function getAccount(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findAccountByDate",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(msg) { 

          var results = msg.results;
          var total= msg.total;

          var balance = [];
          var times = [];
          var exposure = [];
          var total = [];

          results.map(item => 
            {
              balance.push(item.account.available_to_bet);
              exposure.push(item.account.exposure);
              total.push(item.account.available_to_bet - item.account.exposure) 
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
            + "Exposure: <strong><span style='color:red;'>" + results[results.length-1].account.exposure + "£</span></strong><br>  "
            + "Points: <strong>" + results[results.length-1].account.points + "</strong>, "
            + "Commision <strong>" + results[results.length-1].account.commision + "</strong>, "
            + "Discount: <strong>" + results[results.length-1].account.discount + "</strong>, "
            + "Exposure Limit: <strong>" + results[results.length-1].account.exposure_limit+ "</strong>, "
            $('#output').html(output);
            $('#output').html(output);
          } else {
            $('#output').html("");
          }
      }
    });
}
