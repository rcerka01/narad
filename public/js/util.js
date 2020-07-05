// transfear Mongo id to Date
var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

//###################################################################################

// JQuery GET URL params
var urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

//###################################################################################

// draw market table for game report
function marketTable(results) {
    var output = header();
  
    for (var n=0; n<=2; n++) {
  
      output = output +     
      "</tr>" +  
    "</thead>" +  
    "<tbody>" +  
      "<tr>" +  
        "<th scope='row'>" + results[0].logStatus.marketBetStatus[n].selectionId + "</th>";
        for (var i=1; i<=100; i++ ) {
          var item = "<td>"  + "" +  "</td>";
  
          for (var ii in results) {
            var status = results[ii].logStatus.gameStatus;
            var market = results[ii].logStatus.marketBetStatus[n];
  
            var fullMarket = 
              "BACK_PRICE:<strong>" + market.backPrice + "</strong><br>" +
              "BACK_SIZE:<strong>" + market.backSize + "</strong><br>" +
              "LAY_PRICE:" + market.layPrice + "<br>" +
              "LAY_SIZE:" + market.laySize + "<br>";
            
            if (i == status.timeElapsed) {
              item = "<td style='background-color:pink;width:10%;'>" + fullMarket + "</td>";
            }
          }
          output = output + item;
        }
      }
      return output;
  }

  //###################################################################################
  
// add row for stats table for game report
function addRow(name, results, event, side, isTop) {    
    if (isTop) {
        var output = header();
    } else {
        var output = "";
    }

    output = output +     
    "</tr>" +  
  "</thead>" +  
  "<tbody>" +  
    "<tr>" +  
    "<th scope='row'>" + name + "</th>";
    var prev;
    for (var i=1; i<=100; i++ ) {
        var item = "<td>" + "" + "</td>";

        for (var ii in results) {
        var status = results[ii].logStatus.gameStatus;
        if (i == status.timeElapsed && prev != status.score[side][event]) {
            item = "<td style='background-color:pink;font-weight:bold;'>" + status.score[side][event] + "</td>";
            prev = status.score[side][event];
        }
        }

        output = output + item;
    }
    return output;
}
  
// used in addRow()
function header() {
var output = 
"<table class='table table-striped' style='font-size:8px;'>" +
    "<thead>" +
    "<tr>" +
    "<th> EVENT/TIME </th>";
    for (var i=1; i<=100; i++ ) {
        output = output + "<th>" + i + "</th>";
    };
    return output;
}
  
// used in addRow()
var addBottom = "</tr></tbody></table>";

//###################################################################################

// draw single line chart
function drawChart(divId, items, data, label, color, title) {
    new Chart(document.getElementById(divId), {
      type: 'line',
      data: {
        labels: items,
        datasets: [{ 
            data: data,
            label: label,
            borderColor: color,
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: title
        }
      }
    });
  }


  // used for single line chart
  function getItemsPrices(source) {
    var items = [];
    var prices = [];
    for (var i in source) {
      items.push(i);
      prices.push(source[i].price); 
    }
    return { items:items, prices:prices };
  }

  //###################################################################################

  // get data picker (stats, bets, account)
  function datePicker(f,f2) {
              
    var start = moment().subtract(1, 'days');
    var end = moment();

    function cb(start, end) {
      // showe date in picker
      $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      // function to return data
      if (f) { f(start, end); }
      if (f2) { f2(start, end); }    
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end); 
}

//###################################################################################

  // get data picker (stats, bets, account)
  function datePickerForSearch(f, team1, team2) {
            
    var start = moment().subtract(2, 'month');
    var end = moment();

    function cb(start, end) {
      // showe date in picker
      $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      // function to return data
      f(team1, team2, start, end);
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end); 
}

//###################################################################################

// draw account chart
function accountChart(div, balance, exposure, times, total) {
  // avoid canvas history bug ->
  var in_canvas = document.getElementById('chart-holder');
	//remove canvas if present
	while (in_canvas.hasChildNodes()) {
    in_canvas.removeChild(in_canvas.lastChild);
  } 
	//insert canvas
  var newDiv = document.createElement('canvas');
  in_canvas.appendChild(newDiv);
  newDiv.id = div;
  // <-

  var ctx = document.getElementById(div);
  var myChart = new Chart(ctx,{
    type: 'line',
    data: {
      labels: times,
      datasets: [{ 
          data: balance,
          label: "Balance",
          borderColor: "#3e95cd",
          fill: false
        }, { 
          data: exposure,
          label: "Exposure",
          borderColor: "#8e5ea2",
          fill: false
        }, { 
          data: total,
          label: "Total",
          borderColor: "#c45850",
          fill: false
        }
      ]
    },
    options: {
      width: 80,
      width_units: '%',
      title: {
        display: true,
        text: 'Account'
      }
    }
  });
}

//###################################################################################

// draw account profit chart
function accountProfitChart(div, times, total) {
  // avoid canvas history bug ->
  var in_canvas = document.getElementById('profit-chart-holder');
	//remove canvas if present
	while (in_canvas.hasChildNodes()) {
    in_canvas.removeChild(in_canvas.lastChild);
  } 
	//insert canvas
  var newDiv = document.createElement('canvas');
  in_canvas.appendChild(newDiv);
  newDiv.id = div;
  // <-

  var ctx = document.getElementById(div);
  var myChart = new Chart(ctx,{
    type: 'line',
    data: {
      labels: times,
      datasets: [{ 
          data: total,
          label: "Total",
          borderColor: "#c45850",
          fill: false
        }
      ]
    },
    options: {
      width: 80,
      width_units: '%',
      title: {
        display: true,
        text: 'Account Status'
      }
    }
  });
}

//###################################################################################

function drawStatsGraph(div, data) {
    // avoid canvas history bug ->
    var in_canvas = document.getElementById('statsGraph-holder');
    //remove canvas if present
    while (in_canvas.hasChildNodes()) {
      in_canvas.removeChild(in_canvas.lastChild);
    } 
    //insert canvas
    var newDiv = document.createElement('canvas');
  //  newDiv.setAttribute("width","800");
  //  newDiv.setAttribute("height","300");
    in_canvas.appendChild(newDiv);
    newDiv.id = div;
    // <-
  
  var ctx = document.getElementById(div).getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["All Games", "Successfully Placed Bets", "Lost Bets", "In Play Bets (or unknown result)"],
          datasets: [
              
              {
              label: 'Stats',
              data: data,

              backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              '#c45850',
              'rgba(54, 162, 235, 0.2)'
              ],

              borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'
              ],

              width: 100,
              borderWidth: 1
          }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

//###################################################################################
function gamesTable(results) {

  var outputTop = 
    "<table class='table table-striped' style='font-size:8px;'>"
    + "<thead>"
        + "<tr>"
            + "<th>Start</th>"
            + "<th>Home</th>"
            + "<th>Away</th>"
            + "<th>Score</th>"
            + "<th>Points</th>"
            + "<th>Id</th>"
            + "<th>Corners</th>"
            + "<th>1.</th>"
            + "<th>2.</th>"
            + "<th>Cards</th>"
            + "<th>Yellow</th>"
            + "<th>Red</th>"
            + "<th></th>"
            + "<th></th>"
        + "</tr>"
    + "</thead>"      
    + "<tbody>";      

  var outputBody = "";
  for (var i in results) {
    try { 
      var homeScore = results[i].score.home.score;
      var awayScore = results[i].score.away.score;
      var home = results[i].score.home.name;
      var away = results[i].score.away.name;
      var bp = results[i].score.bookingPoints;
      var c = results[i].score.numberOfCorners;
      var c1 = results[i].score.numberOfCornersFirstHalf;
      var c2 = results[i].score.numberOfCornersSecondHalf;
      var cards = results[i].score.numberOfCards;
      var yellow = results[i].score.numberOfYellowCards;
      var red = results[i].score.numberOfRedCards;
    } catch(e) { 
      var homeScore = "unknown";
      var awayScore = "unknown";
      var home = "unknown";
      var away = "unknown";
      var bp = "unknown";
      var c = "unknown";
      var c1 = "unknown";
      var c2 = "unknown";
      var cards = "unknown";
      var yellow = "unknown";
      var red = "unknown";
    }

    outputBody = outputBody
    + "<tr>"
    + "<td>" + moment(dateFromObjectId(results[i]._id)).subtract(results[i].timeElapsed, 'minutes').format('H:mm:ss DD/MM/YYYY') + "</td>"
    + "<td>" + home + "</td>"
    + "<td>" + away + "</td>"
    + "<td>" + homeScore + " : " + awayScore + "</td>"
    + "<td>" + bp + "</td>"
    + "<td>" + results[i].eventId + "</td>"
    + "<td>" + c + "</td>"
    + "<td>" + c1 + "</td>"
    + "<td>" + c2 + "</td>"
    + "<td>" + cards + "</td>"
    + "<td>" + yellow + "</td>"
    + "<td>" + red + "</td>"
    + "<td>" + results[i].status + "</td>"
    + "<td>" + results[i].status + "</td>"
    + "<td><a href='/game?eventId=" + results[i].eventId + "' target='_blank'>GAME STATS</a></td>"
    + "<td><a href='/search?" 
            + "team1=" + results[i].score.home.name 
            + "&team2=" + results[i].score.away.name
            + "' target='_blank'>SEARCH</a></td>"
    + "</tr>";
  }

  var outputBottom = "</tbody></table>";

  return outputTop + outputBody + outputBottom;
}

//###################################################################################

function betsTable(results) {
  var outputTop = 
  "<table class='table table-striped' style='font-size:8px;'>"
  + "<thead>"
      + "<tr>"
          + "<th>Date</th>"
          + "<th>Home</th>"
          + "<th>Away</th>"
          + "<th>Time</th>"
          + "<th>Bet On</th>"
          + "<th>Odd</th>"
          + "<th>Bet</th>"
          + "<th>Profit</th>"
          + "<th>Event</th>"
          + "<th>Type</th>"
          + "<th>Game</th>"
          + "<th>Status</th>"
          + "<th>Result</th>"
          + "<th></th>"
          + "<th></th>"
      + "</tr>"
  + "</thead>"      
  + "<tbody>";

  var outputBody = "";
  var errorCode = "";

  for (var ii in results) {

    // add error code for failed bets
    if (results[ii].betStatus.status == "FAILURE") {
      errorCode = "<br>" + JSON.parse(results[ii].betStatus.instructionReports).errorCode;
    } else {
      errorCode = "";
    }
    
    // game name split to eams
    var teams = results[ii].gameName.split(" v ")

    // bet on home or away
    if (results[ii].placedOn == teams[0]) {
      var home = "<br>- home -"; }
    else {
      var home = "<br>- away -";
    }

    // detect winner
    try { 
      var score = "<br>" + results[ii].score.home.score + " : " + results[ii].score.away.score;
      var resultDiv =  results[ii].score.home.score - results[ii].score.away.score 
    } catch(e) { 
      var resultDiv = 999; 
      var score = "<br>unknown"; 
    }
    
    if ( resultDiv == 999) 
      { var winer = "unknown"; }
    else if ( resultDiv > 0) 
      { var winer = teams[0]; }
    else if ( resultDiv < 0) 
      { var winer = teams[1]; }
    else { var winer = "The Draw"; }  

    // add color to the row
    var color = "";
    // successfuly placed
    if (results[ii].betStatus.status == "SUCCESS")
      { var color = "#CCFFCC"; }
    // lost
    if (winer.toUpperCase() != results[ii].placedOn.toUpperCase() && winer != "unknown") 
      { var color = "#FFCCCC"; }
    // in play
    if (results[ii].betStatus.status == "SUCCESS" && results[ii].gameStatus == "IN_PLAY") 
      { var color = "#FFFFCC"; }
    // error state
    if (winer == "unknown" && moment(dateFromObjectId(results[ii]._id)).isBefore(moment().subtract(30, 'minutes')))
      { var color = "#CCFFFF"; }

    var price = results[ii].price;
    var sum = results[ii].sum;
    var type = results[ii].type;
    var profit = price * sum - sum;

    outputBody = outputBody 
      + "<tr style='background-color:" + color + ";'>"
      + "<td>" + moment(dateFromObjectId(results[ii]._id)).format('H:mm:ss DD/MM/YYYY') + "</td>"
      + "<td>" + teams[0] + "</td>"
      + "<td>" + teams[1] + "</td>"
      + "<td>" + results[ii].elapsedTime + "</td>"
      + "<td>" + results[ii].placedOn + home + "</td>"
      + "<td>" + price + "</td>"
      + "<td>" + sum + "</td>"
      + "<td>" + profit.toFixed(2) + "</td>"
      + "<td>" + results[ii].eventId + "</td>"
      + "<td>" + type + "</td>"
      + "<td>" + results[ii].gameStatus + "</td>"
      + "<td>" + results[ii].betStatus.status + errorCode + "</td>"
      + "<td>" + winer + score + "</td>"
      + "<td><a href='/game?eventId=" + results[ii].eventId + "' target='_blank'>STATS</a></td>"
      + "<td><a href='/search?" 
            + "team1=" + teams[0] 
            + "&team2=" + teams[1] 
            + "' target='_blank'>SEARCH</a></td>"      
      + "</tr>";
  }
  
  var outputBottom =  "</tbody></table>";

  return outputTop + outputBody + outputBottom;
}

//###################################################################################

function drawBetsGraph(div, data) {
  // avoid canvas history bug ->
  var in_canvas = document.getElementById('betsGraph-holder');
  //remove canvas if present
  while (in_canvas.hasChildNodes()) {
    in_canvas.removeChild(in_canvas.lastChild);
  } 
  //insert canvas
  var newDiv = document.createElement('canvas');
  in_canvas.appendChild(newDiv);
  newDiv.id = div;
  // <-

  var ctx = document.getElementById(div).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
          "All", 
          "Successful",
          "Failed", 
          "Lost",
          "Error"
        ],
        datasets: [{
            label: 'Bets',
            data: data,
            backgroundColor: [
              '#FFFFFF',
              '#CCFFCC',
              '#D3D3D3',
              '#FFCCCC',
              '#CCFFFF'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  });
}

//###################################################################################

function addTable(date, home, away, homeScore, awayScore, id) {
  return "<tr>"
  + "<td>" + moment(dateFromObjectId(date)).format('H:mm:ss DD/MM/YYYY') + "</td>"
  + "<td><strong>" + home + " v " + away + "</strong></td>"
  + "<td>" + homeScore + " : " + awayScore + "</td>"
  + "<td>" + id + "</td>"
  + "</tr>";
}

function addScore(win, loose, draw) {
  return "<strong>"
  + "<span style='color:green;padding:10px;'>" + win + "</span>" 
  + "<span style='color:red;padding:10px;'>" + loose + "</span>"
  + "<span style='color:black;padding:10px;'>" + draw + "</span>"
  + "</strong>";
}

function searchTable(data, home, away) {
 var results = data.results;

  var outputTop = 
  "<table class='table table-striped' style='font-size:8px;'>"
  + "<thead>"
      + "<tr>"
      + "<th>Date</th>"
      + "<th>Competition</th>"
      + "<th>Score</th>"
      + "<th>Id</th>"
      + "</tr>"
  + "</thead>"      
  + "<tbody>";  

  var bodyHomeHome = "";
  var bodyHomeAway = "";
  var bodyAwayHome = "";
  var bodyAwayAway = "";

  var winHomeHome = 0;
  var looseHomeHome = 0;
  var drowHomeHome = 0;

  var winHomeAway = 0;
  var looseHomeAway = 0;
  var drowHomeAway = 0;

  var winAwayHome = 0;
  var looseAwayHome = 0;
  var drowAwayHome = 0;

  var winAwayAway = 0;
  var looseAwayAway = 0;
  var drowAwayAway = 0;

  for (var i in results) {
    try { 
      if (results[i].score.home.name == home) {
        if (results[i].score.home.score > results[i].score.away.score) { winHomeHome++; }
        if (results[i].score.home.score < results[i].score.away.score) { looseHomeHome++; }
        if (results[i].score.home.score == results[i].score.away.score) { drowHomeHome++; }
        bodyHomeHome = bodyHomeHome + addTable(
          results[i]._id,
          results[i].score.home.name,
          results[i].score.away.name,
          results[i].score.home.score,
          results[i].score.away.score,
          results[i].eventId)
      }
      if (results[i].score.away.name == home) {
        if (results[i].score.home.score < results[i].score.away.score) { winHomeAway++; }
        if (results[i].score.home.score > results[i].score.away.score) { looseHomeAway++; }
        if (results[i].score.home.score == results[i].score.away.score) { drowHomeAway++; }
        bodyHomeAway = bodyHomeAway + addTable(
          results[i]._id,
          results[i].score.home.name,
          results[i].score.away.name,
          results[i].score.home.score,
          results[i].score.away.score,
          results[i].eventId)
      }
      if (results[i].score.home.name == away) {
        if (results[i].score.home.score > results[i].score.away.score) { winAwayHome++; }
        if (results[i].score.home.score < results[i].score.away.score) { looseAwayHome++; }
        if (results[i].score.home.score == results[i].score.away.score) { drowAwayHome++; }
        bodyAwayHome = bodyAwayHome + addTable(
          results[i]._id,
          results[i].score.home.name,
          results[i].score.away.name,
          results[i].score.home.score,
          results[i].score.away.score,
          results[i].eventId)
      }
      if (results[i].score.away.name == away) {
        if (results[i].score.home.score < results[i].score.away.score) { winAwayAway++; }
        if (results[i].score.home.score > results[i].score.away.score) { looseAwayAway++; }
        if (results[i].score.home.score == results[i].score.away.score) { drowAwayAway++; }
        bodyAwayAway = bodyAwayAway + addTable(
          results[i]._id,
          results[i].score.home.name,
          results[i].score.away.name,
          results[i].score.home.score,
          results[i].score.away.score,
          results[i].eventId)
      }
          
    } catch(e) {}
  }

  var outputBottom = "</tbody></table>";

  $('#homehome').html(outputTop + bodyHomeHome + outputBottom);
  $('#homeaway').html(outputTop + bodyHomeAway + outputBottom);
  $('#awayhome').html(outputTop + bodyAwayHome + outputBottom);
  $('#awayaway').html(outputTop + bodyAwayAway + outputBottom);
  
  $('#scorehomehome').html(addScore(winHomeHome, looseHomeHome, drowHomeHome));
  $('#scorehomeaway').html(addScore(winHomeAway, looseHomeAway, drowHomeAway));
  $('#scoreawayhome').html(addScore(winAwayHome, looseAwayHome, drowAwayHome));
  $('#scoreawayaway').html(addScore(winAwayAway, looseAwayAway, drowAwayAway));

  $('#scorehome').html(addScore(winHomeHome + winHomeAway, looseHomeHome + looseHomeAway, drowHomeHome + drowHomeAway));
  $('#scoreaway').html(addScore(winAwayHome + winAwayAway, looseAwayHome + looseAwayAway, drowAwayHome + drowAwayAway));
}
