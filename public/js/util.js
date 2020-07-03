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
  newDiv.setAttribute("width","1100");
  newDiv.setAttribute("height","400");
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
  newDiv.setAttribute("width","1100");
  newDiv.setAttribute("height","400");
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
function gamesTable(resultsGames) {
  var outputTop = 
    "<table class='table table-striped' style='font-size:8px;'>"
    + "<thead>"
        + "<tr>"
            + "<th>Event ID</th>"
            + "<th>Start Time</th>"
            + "<th>Game</th>"
            + "<th>Competition</th>"
            + "<th>Country</th>"
            + "<th></th>"
            + "<th></th>"
        + "</tr>"
    + "</thead>"      
    + "<tbody>";      

  var outputBody = "";
  for (var i in resultsGames) {
  outputBody = outputBody
    + "<tr>"
      + "<td>" + resultsGames[i].logGame.eventId + "</td>"
      + "<td>" + resultsGames[i].logGame.startTime.slice(0, -5).replace("T", " ") + "</td>"
      + "<td>" + resultsGames[i].logGame.eventName + "</td>"
      + "<td>" + resultsGames[i].logGame.competitionName + "</td>"
      + "<td>" + resultsGames[i].logGame.countryCode + "</td>"
      + "<td><a href='/game?eventId=" + resultsGames[i].logGame.eventId + "' target='_blank'>GAME STATS</a></td>"
      + "<td><a href='/search?" 
            + "team1=" + resultsGames[i].logGame.runners.runner1Name 
            + "&team2=" + resultsGames[i].logGame.runners.runner2Name 
            + "' target='_blank'>SEARCH</a></td>"
    + "</tr>";
  }

  var outputBottom = "</tbody></table>";

  return outputTop + outputBody + outputBottom;
}

//###################################################################################

function betsTable(resultsActions) {
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

  for (var ii in resultsActions) {

    // add error code for failed bets
    if (resultsActions[ii].betStatus.status == "FAILURE") {
      errorCode = "<br>" + JSON.parse(resultsActions[ii].betStatus.instructionReports).errorCode;
    } else {
      errorCode = "";
    }
    
    // game name split to eams
    var teams = resultsActions[ii].gameName.split(" v ")

    // bet on home or away
    if (resultsActions[ii].placedOn == teams[0]) {
      var home = "<br>- home -"; }
    else {
      var home = "<br>- away -";
    }

    // detect winner
    try { 
      var score = "<br>" + resultsActions[ii].score.home.score + " : " + resultsActions[ii].score.away.score;
      var resultDiv =  resultsActions[ii].score.home.score - resultsActions[ii].score.away.score 
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
    if (resultsActions[ii].betStatus.status == "SUCCESS")
     { var color = "#CCFFCC"; }
     // lost
    if (winer.toUpperCase() != resultsActions[ii].placedOn.toUpperCase() && winer != "unknown") 
     { var color = "#FFCCCC"; }
     // error state
    if (winer == "unknown") 
     { var color = "#CCFFFF"; }
     // in play
    if (resultsActions[ii].betStatus.status == "SUCCESS" && resultsActions[ii].gameStatus == "IN_PLAY") 
     { var color = "#FFFFCC"; }

    var price = resultsActions[ii].price;
    var sum = resultsActions[ii].sum;
    var type = resultsActions[ii].type;
    var profit = price * sum - sum;

    outputBody = outputBody 
      + "<tr style='background-color:" + color + ";'>"
      + "<td>" + moment(dateFromObjectId(resultsActions[ii]._id)).format('H:mm:ss DD/MM/YYYY') + "</td>"
      + "<td>" + teams[0] + "</td>"
      + "<td>" + teams[1] + "</td>"
      + "<td>" + resultsActions[ii].elapsedTime + "</td>"
      + "<td>" + resultsActions[ii].placedOn + home + "</td>"
      + "<td>" + price + "</td>"
      + "<td>" + sum + "</td>"
      + "<td>" + profit.toFixed(2) + "</td>"
      + "<td>" + resultsActions[ii].eventId + "</td>"
      + "<td>" + type + "</td>"
      + "<td>" + resultsActions[ii].gameStatus + "</td>"
      + "<td>" + resultsActions[ii].betStatus.status + errorCode + "</td>"
      + "<td>" + winer + score + "</td>"
      + "<td><a href='/game?eventId=" + resultsActions[ii].eventId + "' target='_blank'>STATS</a></td>"
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
  newDiv.setAttribute("width","800");
  newDiv.setAttribute("height","300");
  in_canvas.appendChild(newDiv);
  newDiv.id = div;
  // <-

var ctx = document.getElementById(div).getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
          "All Bets", 
          "Successful Bets",
          "Failed Zero Back Price Bets", 
          "Other Failed Bets", 
          "No Results",
          "Lost Bets",
          "Unknown Result"
        ],
        datasets: [{
            label: 'Bets',
            data: data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              '#D3D3D3',
              'pink',
              '#ff8080',
              'yellow',
              'red',
              'brown'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            //width: 100,
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

function searchTable(data, homeAway) {
  var outputTop = 
  "<table class='table table-striped' style='font-size:8px;'>"
  + "<thead>"
      + "<tr>"
      + "<th>Start Time</th>"
      + "<th>Competition</th>"
      + "<th>Name</th>"
      + "<th>Team</th>"
      + "<th>Draw</th>"
      + "<th></th>"
      + "</tr>"
  + "</thead>"      
  + "<tbody>";  

  var outputBody = "";

  var win = 0;
  var loose = 0;
  var draw = 0;

  for (var i in data) {

    if (data[i].team == "WINNER") win++;
    if (data[i].team == "LOSER" && data[i].draw == "LOSER") loose++;
    if (data[i].draw == "WINNER") draw++;

    outputBody = outputBody
      + "<tr>"
      + "<td>" + data[i].startTime.slice(0, -5).replace("T", " ") + "</td>"
      + "<td><strong>" + data[i].eventName + "</strong><br>" + data[i].competitionName + "<br>" + data[i].countryCode + "</td>"
      + "<td>" + homeAway + " name: <strong>" + data[i].homeName + "</strong><br>Runner: " + data[i].run1Name + "<br>Selection ID: " + data[i].runSelectionId + "</td>"
      + "<td>" + data[i].homeName + "<br>" + data[i].runSelectionId + "<br><strong>" + data[i].team + "</strong></td>"
      + "<td>" + data[i].runDrawSelectionId + "<br><strong>" + data[i].draw + "</strong></td>"
      + "<td><a href='/game?eventId=" + data[i].eventId + "' target='_blank'>GAME STATS</a></td>"
      + "</tr>";
  }

  var outputBottom = "</tbody></table>";

  var outputResume = "<br><strong>" +
  "<span style='color:green;padding:10px;'>" + win + "</span>" +
  "<span style='color:red;padding:10px;'>" + loose + "</span>" +
  "<span style='color:black;padding:10px;'>" + draw + "</span>" +
  "</strong>";

  return outputTop + outputBody + outputBottom + outputResume;
}

//###################################################################################

function getSearchResults(runner, i, total, outputDiv, homeAway, results, selIds) {
  $.ajax({
      type: "POST",
      url: "/findLogResultQuery",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ find: { "logResult.eventId": runner[i].logGame.eventId } }),
      success: function(r) {

          var item = {
              total: total,
              eventId: runner[i].logGame.eventId,
              startTime: runner[i].logGame.startTime,
              countryCode: runner[i].logGame.countryCode,
              competitionName: runner[i].logGame.competitionName,
              eventName: runner[i].logGame.eventName,
              runSelectionId: runner[i].logGame.runners[selIds.selectionId],
              runDrawSelectionId: runner[i].logGame.runners.drawSelectionId,
              run1Name: runner[i].logGame.runners[selIds.runName],
              homeName: runner[i].logGame[selIds.name]
          };

          if (r.total > 0) {
              var runners = r.results[0].logResult[0].item.runners;
              for (var ii in runners) {
                  if (runners[ii].selectionId == item.runSelectionId) {
                      item.team = runners[ii].status
                  }
                  if (runners[ii].selectionId == item.runDrawSelectionId) {
                      item.draw = runners[ii].status
                  }
              }
          }

          results.push(item);
          if (results.length == total) {  
              results.reverse();
              var output = searchTable(results, homeAway)
              $(outputDiv).html(output);
          } else {
            $(outputDiv).html("...");
          }
      }
  })
}
