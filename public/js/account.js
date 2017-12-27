function getAccount(start, end) {
    var body = { start: start+"", end: end+"" };
    $.ajax({
       type: "POST",
       url: "/findLogAccountByDate",
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
            + "Start: <strong>" + total[0].toFixed(2) + "</strong>,  "
            + "End: <strong>" + total[total.length-1].toFixed(2) + "</strong>  "
            + "Profit: <strong><span style='color:red;'>" + profit + "£</span></strong>"
            $('#output').html(output);
          } else {
            $('#output').html("");
          }
      }
    });
}
