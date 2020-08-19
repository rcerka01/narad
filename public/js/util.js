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

// get data picker (stats, bets, account)
function datePicker(f,f2) {
              
    var start = moment().subtract(2, 'days');
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
function gamesTable(results) {

  results = results.sort((a,b) => a.openDate > b.openDate);

  var outputTop = 
    "<table class='table table-striped' style='font-size:8px;'>"
    + "<thead>"
        + "<tr>"
            + "<th>Start</th>"
            + "<th>Id</th>"
            + "<th>Competition</th>"
            + "<th>Country</th>"
            + "<th>Event Name</th>"
            + "<th>Open Time</th>"
            + "<th>Status</th>"
            + "<th>Score</th>"
            + "<th></th>"
            + "<th></th>"
            + "<th></th>"
        + "</tr>"
    + "</thead>"      
    + "<tbody>";      

  var outputBody = "";

  for (var i in results) {
      var displaySearch = true;
      var displayStats = true;

      if (results[i].score === undefined) { displayStats = false; }

      var dateFromId = moment(dateFromObjectId(results[i]._id)).format('H:mm:ss DD/MM/YYYY')

      try { var id = results[i].eventId; } catch(e) { var id = "?" } 
      try { var marketId = results[i].markets[0].marketId; if (marketId === undefined) { marketId = "?"; } } catch(e) { var marketId = "?" } 
      try { var openTime = moment(results[i].openDate).format('H:mm'); if (openTime === undefined) { openTime = "?"; } } catch (e) { var openTime = "?"; }
      try { var openDate = moment(results[i].openDate).format('DD / MM / YYYY'); if (openDate === undefined) { openDate = "?"; }  } catch (e) { var openDate = "?"; }
      try { var competition = results[i].competition; if (competition === undefined) { competition = "?"; }  } catch (e) { var competition = "?" }
      try { var eventName = results[i].eventName; if (eventName === undefined) { eventName = "?"; } } catch (e) { var eventName = "?" }
      try { var country = results[i].country; if (country === undefined) { country = "?"; }  } catch (e) { var country = "?" }
      try { var status = results[i].status; if (status === undefined) { status = "UPCOMING" } } catch (e) { var status = "UPCOMING" }
      try { var scoreHome = results[i].score.home.score; } catch (e) { var scoreHome = "-" }
      try { var scoreAway = results[i].score.away.score; } catch (e) { var scoreAway = "-" }

      if (status === undefined) { status = "UPCOMING"; }

      var teamNames = eventName.split(" v ");

      try { var homeTeamName = results[i].score.home.name; } catch (e) { 
        if (teamNames.length > 0) { var homeTeamName = teamNames[0]; } else { var homeTeamName = ""; displaySearch = false; }
      }
      try { var awayTeamName = results[i].score.away.name; } catch (e) { 
        if (teamNames.length > 0) { var awayTeamName = teamNames[1]; } else { var awayTeamName = ""; displaySearch = false; }
      }

      if (homeTeamName == "Home" && teamNames.length > 0) { homeTeamName = teamNames[0]; }
      if (awayTeamName == "Away" && teamNames.length > 0) { awayTeamName = teamNames[1]; }

      if (displaySearch) {
        var searchLink = "<td><a href='/search?" 
        + "team1=" + homeTeamName
        + "&team2=" + awayTeamName
        + "' target='_blank'>SEARCH</a></td>";
      } else {
        var searchLink = "";
      }

      if (displayStats) {
        var statsLink = "<td><a href='/game?eventId=" + id + "' target='_blank'>GAME STATS</a></td>"
      } else {
        var statsLink = "<td>disabled</td>";
      }

      outputBody = outputBody
      + "<tr>"
      + "<td> Record: " + dateFromId + "<br>Open Date: <strong>" + openDate + "</strong></td>"
      + "<td>" + id + "<br>" + marketId + "</td>"
      + "<td>" + competition + "</td>"
      + "<td>" + country + "</td>"
      + "<td>" + eventName + "</td>"
      + "<td>" + openTime + "</td>"
      + "<td>" + status + "</td>"
      + "<td>" + scoreHome + " : " + scoreAway + "</td>"
      + searchLink
      + "<td><a href='/gameOdds?eventId=" + id + "' target='_blank'>GAME ODDS</a></td>"
      + statsLink
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
      + "<td><a href='/gameOdds?eventId=" + results[ii].eventId + "' target='_blank'>ODDS</a></td>"
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

//////////////////////////////////////////////// ODDS ///////////////////////////////////////////////////////////////////////////////

function drawChart(updates, homeOdds, drawOdds, awayOdds, id) {
  var ctx = document.getElementById(id).getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
  
      // The data for our dataset
      data: {
          labels: updates,
          datasets: [{
              label: 'Home',
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              data:  homeOdds,
          },
          {
              label: 'Draw',
              fill: false,
              borderColor: 'rgb(25, 112, 132)',
              data: drawOdds
          },
          {
              label: 'Away',
              fill: false,
              borderColor: 'rgb(99, 115, 132)',
              data: awayOdds
          }]
      },
  
      // Configuration options go here
      options: {
          spanGaps: true,
          extrapolateMissingData: false,
          scales: {
              xAxes: [{
                  ticks: {
                      // Include a dollar sign in the ticks
                      callback: function(value, index, values) {
                          return value;
                      }
                  }
              }]
          }
      }
  });
}

function orderArr(arr) {
  if (arr[0].updated > arr[arr.length - 1].updated) { arr = arr.reverse(); }
  return arr;
}

function layToBack(val) {
    var transfared = 1 + 1 / ( val - 1 );
    return parseFloat(transfared).toFixed(3);
}

function laysToBacks(arr) {
  arr = orderArr(arr);
  var tempArr = [];
  for(var a in arr) {
      var home = layToBack(arr[a].home);
      var draw = layToBack(arr[a].draw);  
      var away = layToBack(arr[a].away);
      tempArr.push({
          home: home,
          draw: draw, 
          away:away,
          updated:  arr[a].updated,
          isInPlay: arr[a].isInPlay
      });
  }
  return orderArr(tempArr);
}

function getCorrespondingCrossOdd(crossArr, odd) {
  if (crossArr !== undefined) {
      crossArr = orderArr(crossArr);

      var startDate = new Date();
      var prev;
      var found = false;
      for (var b in crossArr) {

          if (odd.updated >= crossArr[b].updated) {
               startDate = crossArr[b].updated; 
              }
          if (odd.updated <= crossArr[b].updated && odd.updated >= startDate && found == false) {
              found = true;
              var correspondingCross = prev;
          }
          prev = crossArr[b];
      }
  }
  return correspondingCross;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getProbsAndVals(arr, isInPlay, typeForMessage, initialArrForLabel, alertMessage, crossArr) {
  var homeOdds = [];
  var drawOdds = [];
  var awayOdds = []; 
  var homeProbs = [];
  var drawProbs = [];
  var awayProbs = [];    
  var homeVals = [];
  var drawVals = [];
  var awayVals = [];
  var updates = [];

  var homeValInfinite = [];
  var drawValInfinite = [];
  var awayValInfinite = [];

  var isInPlayMessage = "IN PLAY";
  if (!isInPlay) { isInPlayMessage = "COMING"; }

  function addToInfiniteMessage(arr, val, date, home, draw, away) {
      var time = (date).slice(11,-8);
      arr.push(
          { time: time,
            val: val,
            home: home,
            draw: draw,
            away: away,
          });
      return arr;
  }

  function alertInfinity(home, away, draw) {
      function formMsgFromArr(arr) {
          var arrMsg = "";
          for (var i in arr) {
              arrMsg = arrMsg + arr[i].time + " " + arr[i].val + " " + arr[i].home + "~" + arr[i].draw + "~" + arr[i].away + "\n";
          }
          return arrMsg;
      }
      var msg = "For " + typeForMessage + " " + isInPlayMessage + " folowing Value Bets are infinite: \n"
          + "HOME:\n"
          + formMsgFromArr(home)
          + "DRAW:\n"
          + formMsgFromArr(draw)
          + "AWAY:\n"
          + formMsgFromArr(away)
      alert(msg);
  }

  for (var a in arr) {
      var oddValue = arr[a];

      // calculate cross
      if (crossArr !== undefined) {
          oddValue = getCorrespondingCrossOdd(crossArr, arr[a]);
      }

      if (oddValue !== undefined && oddValue.isInPlay == isInPlay) {


          if (initialArrForLabel !== undefined && arr.length == initialArrForLabel.length) {
              updates.push(moment(oddValue.updated).format('H : mm') + "  \n" 
                  + oddValue.home + "~" + oddValue.draw + "~" + oddValue.away + " \n" 
                  + initialArrForLabel[a].home + "~" +initialArrForLabel[a].draw + "~" + initialArrForLabel[a].away);
          } else {
              updates.push(moment(oddValue.updated).format('H : mm') + "  \n" 
                  + oddValue.home + "~" + oddValue.draw + "~" + oddValue.away + " \n"); 
          }

          homeOdds.push(oddValue.home);
          drawOdds.push(oddValue.draw);
          awayOdds.push(oddValue.away);

          var homeInterm = parseFloat(1 / oddValue.home * 100).toFixed(2); 
          var drawInterm = parseFloat(1 / oddValue.draw * 100).toFixed(2);
          var awayInterm = parseFloat(1 / oddValue.away * 100).toFixed(2);
          var sumInterm = parseFloat(homeInterm) + parseFloat(drawInterm) + parseFloat(awayInterm);
          sumInterm = sumInterm.toFixed(2);

          var homeProb = parseFloat(homeInterm/sumInterm * 100).toFixed(2);
          var drawProb = parseFloat(drawInterm/sumInterm * 100).toFixed(2);
          var awayProb = parseFloat(awayInterm/sumInterm * 100).toFixed(2);
          var sumProb = parseFloat(homeProb) + parseFloat(drawProb) + parseFloat(awayProb);
          sumProb = sumProb.toFixed(2)

          var homeVal = parseFloat(oddValue.home - 1 / homeProb*100).toFixed(2);
          var drawVal = parseFloat(oddValue.draw - 1 / drawProb*100).toFixed(2);
          var awayVal = parseFloat(oddValue.away - 1 / awayProb*100).toFixed(2);

          // homeProbs.push({x: oddValue.updated, y: homeProb});
          // drawProbs.push({x: oddValue.updated, y: drawProb});
          // awayProbs.push({x: oddValue.updated, y: awayProb});

          homeProbs.push(homeProb);
          drawProbs.push(drawProb);
          awayProbs.push(awayProb);

          // form infinity message if flaged and 0 values
          if (!isFinite(homeVal)) { 
              addToInfiniteMessage(
                  homeValInfinite,
                  homeVal,
                  oddValue.updated,
                  initialArrForLabel[a].home,
                  initialArrForLabel[a].draw,
                  initialArrForLabel[a].away); 
              homeVal = "0"; 
          }

          if (!isFinite(drawVal)) { 
              addToInfiniteMessage(
                  drawValInfinite,
                  drawVal,
                  oddValue.updated,
                  initialArrForLabel[a].home,
                  initialArrForLabel[a].draw,
                  initialArrForLabel[a].away); 
              drawVal = "0"; 
          }

          if (!isFinite(awayVal)) { 
              addToInfiniteMessage(
                  awayValInfinite,
                  awayVal,
                  oddValue.updated,
                  initialArrForLabel[a].home,
                  initialArrForLabel[a].draw,
                  initialArrForLabel[a].away); 
              awayVal = "0"; 
          }

          if (alertMessage && (homeValInfinite.length > 0 || drawValInfinite.length > 0 || awayValInfinite.length > 0) ) { 
              alertInfinity(homeValInfinite, drawValInfinite, awayValInfinite); 
          }
          //

          homeVals.push(homeVal);
          drawVals.push(drawVal);
          awayVals.push(awayVal);
      }
  }

  var probsAndVals = { 
      updates: updates,
      homeOdds: homeOdds,
      drawOdds: drawOdds,
      awayOdds: awayOdds,
      homeProbs: homeProbs,
      drawProbs: drawProbs,
      awayProbs: awayProbs,
      homeVals: homeVals,
      drawVals: drawVals,
      awayVals: awayVals
  }

  return probsAndVals; 
}
