function getGameOdds(eventId) {
    var body = { find: { eventId: eventId }, sort: {} };

    $.ajax({
       type: "POST",
       url: "/findGames",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify(body),
       success: function(data) {
            var ucgt = getOdds(data.results);

            $('#output').html(ucgt.output).promise().done(function(){
                drawChart(ucgt.chart.back.inGame.updates, ucgt.chart.back.inGame.homeOdds, ucgt.chart.back.inGame.drawOdds, ucgt.chart.back.inGame.awayOdds, "backInGameOdds");
                drawChart(ucgt.chart.back.inGame.updates, ucgt.chart.back.inGame.homeProbs, ucgt.chart.back.inGame.drawProbs, ucgt.chart.back.inGame.awayProbs, "backInGameProbs");
                drawChart(ucgt.chart.back.inGame.updates, ucgt.chart.back.inGame.homeVals, ucgt.chart.back.inGame.drawVals, ucgt.chart.back.inGame.awayVals, "backInGameVals");
                drawChart(ucgt.chart.back.inGame.updates, ucgt.chart.back.inGame.homeCrossVals, ucgt.chart.back.inGame.drawCrossVals, ucgt.chart.back.inGame.awayCrossVals, "backInGameCrossVals");
               
                drawChart(ucgt.chart.back.coming.updates, ucgt.chart.back.coming.homeOdds, ucgt.chart.back.coming.drawOdds, ucgt.chart.back.coming.awayOdds, "backComingOdds");
                drawChart(ucgt.chart.back.coming.updates, ucgt.chart.back.coming.homeProbs, ucgt.chart.back.coming.drawProbs, ucgt.chart.back.coming.awayProbs, "backComingProbs");
                drawChart(ucgt.chart.back.coming.updates, ucgt.chart.back.coming.homeVals, ucgt.chart.back.coming.drawVals, ucgt.chart.back.coming.awayVals, "backComingVals");
                drawChart(ucgt.chart.back.coming.updates, ucgt.chart.back.coming.homeCrossVals, ucgt.chart.back.coming.drawCrossVals, ucgt.chart.back.coming.awayCrossVals, "backComingCrossVals");

                
                drawChart(ucgt.chart.lay.inGame.updates, ucgt.chart.lay.inGame.homeOdds, ucgt.chart.lay.inGame.drawOdds, ucgt.chart.lay.inGame.awayOdds, "layInGameOdds");
                drawChart(ucgt.chart.lay.inGame.updates, ucgt.chart.lay.inGame.homeProbs, ucgt.chart.lay.inGame.drawProbs, ucgt.chart.lay.inGame.awayProbs, "layInGameProbs");
                drawChart(ucgt.chart.lay.inGame.updates, ucgt.chart.lay.inGame.homeVals, ucgt.chart.lay.inGame.drawVals, ucgt.chart.lay.inGame.awayVals, "layInGameVals");
                drawChart(ucgt.chart.lay.inGame.updates, ucgt.chart.lay.inGame.homeCrossVals, ucgt.chart.lay.inGame.drawCrossVals, ucgt.chart.lay.inGame.awayCrossVals, "layInGameCrossVals");

                drawChart(ucgt.chart.lay.coming.updates, ucgt.chart.lay.coming.homeOdds, ucgt.chart.lay.coming.drawOdds, ucgt.chart.lay.coming.awayOdds, "layComingOdds");
                drawChart(ucgt.chart.lay.coming.updates, ucgt.chart.lay.coming.homeProbs, ucgt.chart.lay.coming.drawProbs, ucgt.chart.lay.coming.awayProbs, "layComingProbs");
                drawChart(ucgt.chart.lay.coming.updates, ucgt.chart.lay.coming.homeVals, ucgt.chart.lay.coming.drawVals, ucgt.chart.lay.coming.awayVals, "layComingVals");
                drawChart(ucgt.chart.lay.coming.updates, ucgt.chart.lay.coming.homeCrossVals, ucgt.chart.lay.coming.drawCrossVals, ucgt.chart.lay.coming.awayCrossVals, "layComingCrossVals");
             });
        }
    });     
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                data: homeOdds
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
        options: { }
    });
  }

  function orderArr(arr) {
    if (arr[0].updated > arr[arr.length - 1].updated) { arr = arr.reverse(); }
    return arr;
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseOdds(arr, isInPlay, crossArr) {
    arr = orderArr(arr);

    var homeOdds = [];
    var drawOdds = [];
    var awayOdds = [];
    var homeProbs = [];
    var drawProbs = [];
    var awayProbs = [];    
    var homeVals = [];
    var drawVals = [];
    var awayVals = [];
    var homeCrossVals = [];
    var drawCrossVals = [];
    var awayCrossVals = [];
    var updates = [];

    for (var a in arr) {

        if (arr[a].isInPlay == isInPlay) {

            // find corresponding cross
            if (crossArr !== undefined) {
                crossArr = orderArr(crossArr);

                var startDate = new Date();
                var prev;
                var found = false;
                for (var b in crossArr) {

                    if (arr[a].updated > crossArr[b].updated) { startDate = crossArr[b].updated; }
                    if (arr[a].updated <= crossArr[b].updated && arr[a].updated >= startDate && found == false) {
                        found = true;
                        var correspondingCross = prev;

                    }
                    prev = crossArr[b];
                }
            }
            
            // calculate vlue with cross probabilities
            if (correspondingCross !== undefined) {
                var homeCrossInterm = parseFloat(1 / correspondingCross.home * 100).toFixed(2); 
                var drawCrossInterm = parseFloat(1 / correspondingCross.draw * 100).toFixed(2);
                var awayCrossInterm = parseFloat(1 / correspondingCross.away * 100).toFixed(2);
                var sumCrossInterm = parseFloat(homeCrossInterm) + parseFloat(drawCrossInterm) + parseFloat(awayCrossInterm);
                sumCrossInterm = sumCrossInterm.toFixed(2);
    
                var homeCrossProb = parseFloat(homeCrossInterm/sumCrossInterm * 100).toFixed(2);
                var drawCrossProb = parseFloat(drawCrossInterm/sumCrossInterm * 100).toFixed(2);
                var awayCrossProb = parseFloat(awayCrossInterm/sumCrossInterm * 100).toFixed(2);

                var homeCrossVal = parseFloat(arr[a].home - 1 / homeCrossProb*100).toFixed(2);
                var drawCrossVal = parseFloat(arr[a].draw - 1 / drawCrossProb*100).toFixed(2);
                var awayCrossVal = parseFloat(arr[a].away - 1 / awayCrossProb*100).toFixed(2);

                homeCrossVals.push(homeCrossVal);
                drawCrossVals.push(drawCrossVal);
                awayCrossVals.push(awayCrossVal);
            }
            //

            homeOdds.push(arr[a].home);
            drawOdds.push(arr[a].draw);
            awayOdds.push(arr[a].away);

            updates.push(moment(arr[a].updated).format('H : mm'));

            var homeInterm = parseFloat(1 / arr[a].home * 100).toFixed(2); 
            var drawInterm = parseFloat(1 / arr[a].draw * 100).toFixed(2);
            var awayInterm = parseFloat(1 / arr[a].away * 100).toFixed(2);
            var sumInterm = parseFloat(homeInterm) + parseFloat(drawInterm) + parseFloat(awayInterm);
            sumInterm = sumInterm.toFixed(2);

            var homeProb = parseFloat(homeInterm/sumInterm * 100).toFixed(2);
            var drawProb = parseFloat(drawInterm/sumInterm * 100).toFixed(2);
            var awayProb = parseFloat(awayInterm/sumInterm * 100).toFixed(2);
            var sumProb = parseFloat(homeProb)+parseFloat(drawProb)+parseFloat(awayProb);
            sumProb = sumProb.toFixed(2)

            var homeVal = parseFloat(arr[a].home - 1 / homeProb*100).toFixed(2);
            var drawVal = parseFloat(arr[a].draw - 1 / drawProb*100).toFixed(2);
            var awayVal = parseFloat(arr[a].away - 1 / awayProb*100).toFixed(2);

            homeProbs.push(homeProb);
            drawProbs.push(drawProb);
            awayProbs.push(awayProb);

            homeVals.push(homeVal);
            drawVals.push(drawVal);
            awayVals.push(awayVal);
        }
    }

    return {
        updates: updates,
        odds: {
            home: homeOdds,
            draw: drawOdds,
            away: awayOdds
        },
        probs: {
            home: homeProbs,
            draw: drawProbs,
            away: awayProbs
        },
        vals: {
            home: homeVals,
            draw: drawVals,
            away: awayVals
        },
        crossVals: {
            home: homeCrossVals,
            draw: drawCrossVals,
            away: awayCrossVals
        }
    };
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOdds(odds) {

    try { var id = odds[0].eventId } catch(e) { var id = "undefined" } 
    try { var marketId = odds[0].markets[0].marketId } catch(e) { var marketId = "undefined" } 
    try { var openTime = moment(odds[0].openDate).format('H:mm'); } catch (e) { var openTime = "undefined"; }
    try { var openDate = moment(odds[0].openDate).format('H:mm:ss DD/MM/YYYY'); } catch (e) { var openDate = "undefined"; }
    try { var competition = odds[0].competition; } catch (e) { var competition = "undefined" }
    try { var eventName = odds[0].eventName; } catch (e) { var eventName = "undefined" }
    try { var country = odds[0].country; } catch (e) { var country = "undefined" }
    try { var scoreHome = odds[0].score.home.score; } catch (e) { var scoreHome = "undefined" }
    try { var scoreAway = odds[0].score.away.score; } catch (e) { var scoreAway = "undefined" }

    var dateFromId = moment(dateFromObjectId(odds[0]._id)).format('H:mm:ss DD/MM/YYYY')

    try { var back = odds[0].markets[0].combined.back; if (back === undefined) { back = ["undefined"] } } catch (e) { var back = ["undefined"]; }
    try { var lay = odds[0].markets[0].combined.lay; if (lay === undefined) { lay = ["undefined"] } } catch (e) { var lay = ["undefined"]; }


    var parsedInGameBackOdds = parseOdds(back, true, lay);
    var parsedComingBackOdds = parseOdds(back, false, lay);
    var parsedInGameLayOdds = parseOdds(lay, true, back);
    var parsedComingLayOdds = parseOdds(lay, false, back);

    var width = "width='1000'"

   var names = eventName.split(" v ")
   var homeName = names[0];
   var awayName = names[1]; 

    var outputEvent = 
        "<table class='table table-striped' style='font-size:8px;'>"
        + "<tbody><tr>"
        + "<td>" + id + "<br>" + marketId +  "</td>"
        + "<td style='font-size:9px;'>" +  dateFromId + "<br>" + openDate + "</td>"
        + "<td><h6>" + openTime + "</h6></td>"
        + "<td><h6>" + competition + "</h6></td>"
        + "<td><h6>" + country + "</h6></td>"
        + "<td><h6>" + eventName + "</h6></td>"
        + "<td><h6>" + scoreHome + " : " + scoreAway + "</h6></td>"
        + "<td><a href='/game?eventId=" + id + "' target='_blank'>STATS</a></td>"
        + "<td><a href='/search?" 
              + "team1=" + homeName
              + "&team2=" + awayName
              + "' target='_blank'>SEARCH</a></td>"
        + "</tr>"
        + "</tbody></table>"
        
        + "<table>"

        + "<tr>"
        + "<tr><td><strong>BACK COMING ODDS</strong></td><td><strong>BACK IN GAME ODDS</strong></td></tr>"
        + "<td><canvas " + width + " id='backComingOdds'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='backInGameOdds'>Chart</canvas></td>"
        + "</tr>"   
        + "<tr>"
        + "<tr><td><strong>BACK COMING PROBABILITIES</strong></td><td><strong>BACK IN GAME PROBABILITIES</strong></td></tr>"
        + "<td><canvas " + width + " id='backComingProbs'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='backInGameProbs'>Chart</canvas></td>"
        + "</tr>" 
        + "<tr><td><strong>BACK COMING VALUE</strong></td><td><strong>BACK IN GAME VALUE</strong></td></tr>"
        + "<td><canvas " + width + " id='backComingVals'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='backInGameVals'>Chart</canvas></td>"
        + "</tr>" 
        + "<tr><td><strong>BACK COMING VALUE WITH LAY PROBABILITY</strong></td><td><strong>BACK IN GAME VALUE WITH LAY PROBABILITY</strong></td></tr>"
        + "<td><canvas " + width + " id='backComingCrossVals'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='backInGameCrossVals'>Chart</canvas></td>"
        + "</tr>" 
        
        + "<tr>"
        + "<tr><td><strong>LAY COMING ODDS</strong><td><strong>LAY IN GAME ODDS</strong></td></td></tr>"
        + "<td><canvas " + width + " id='layComingOdds'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='layInGameOdds'>Chart</canvas></td>"
        + "</tr>"   
        + "<tr>"
        + "<tr><td><strong>LAY COMING PROBABILITIES</strong></td><td><strong>LAY IN GAME PROBABILITIES</strong></td></tr>"
        + "<td><canvas " + width + " id='layComingProbs'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='layInGameProbs'>Chart</canvas></td>"
        + "</tr>"
        + "</tr>" 
        + "<tr><td><strong>LAY COMING VALUE</strong></td><td><strong>LAY IN GAME VALUE</strong></td></tr>"
        + "<td><canvas " + width + " id='layComingVals'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='layInGameVals'>Chart</canvas></td>"
        + "</tr>"  
        + "<tr><td><strong>LAY COMING VALUE WITH BACK PROBABILITY</strong></td><td><strong>LAY IN GAME VALUE WITH BACK PROBABILITY</strong></td></tr>"
        + "<td><canvas " + width + " id='layComingCrossVals'>Chart</canvas></td>"
        + "<td><canvas " + width + " id='layInGameCrossVals'>Chart</canvas></td>"
        + "</tr>"   
        
        + "</trable>";

    return { output: outputEvent,
        chart: {
            back : {
                inGame: {
                    homeOdds: parsedInGameBackOdds.odds.home,
                    drawOdds: parsedInGameBackOdds.odds.draw,
                    awayOdds: parsedInGameBackOdds.odds.away,
                    homeProbs: parsedInGameBackOdds.probs.home,
                    drawProbs: parsedInGameBackOdds.probs.draw,
                    awayProbs: parsedInGameBackOdds.probs.away,
                    homeVals: parsedInGameBackOdds.vals.home,
                    drawVals: parsedInGameBackOdds.vals.draw,
                    awayVals: parsedInGameBackOdds.vals.away,                  
                    homeCrossVals: parsedInGameBackOdds.crossVals.home,
                    drawCrossVals: parsedInGameBackOdds.crossVals.draw,
                    awayCrossVals: parsedInGameBackOdds.crossVals.away,
                    updates: parsedInGameBackOdds.updates
                    },
                coming: {
                    homeOdds: parsedComingBackOdds.odds.home,
                    drawOdds: parsedComingBackOdds.odds.draw,
                    awayOdds: parsedComingBackOdds.odds.away,
                    homeProbs: parsedComingBackOdds.probs.home,
                    drawProbs: parsedComingBackOdds.probs.draw,
                    awayProbs: parsedComingBackOdds.probs.away,
                    homeVals: parsedComingBackOdds.vals.home,
                    drawVals: parsedComingBackOdds.vals.draw,
                    awayVals: parsedComingBackOdds.vals.away,
                    homeCrossVals: parsedComingBackOdds.crossVals.home,
                    drawCrossVals: parsedComingBackOdds.crossVals.draw,
                    awayCrossVals: parsedComingBackOdds.crossVals.away,
                    updates: parsedComingBackOdds.updates
                    }
               },
            lay : {
                inGame: {
                    homeOdds: parsedInGameLayOdds.odds.home,
                    drawOdds: parsedInGameLayOdds.odds.draw,
                    awayOdds: parsedInGameLayOdds.odds.away,
                    homeProbs: parsedInGameLayOdds.probs.home,
                    drawProbs: parsedInGameLayOdds.probs.draw,
                    awayProbs: parsedInGameLayOdds.probs.away,
                    homeVals: parsedInGameLayOdds.vals.home,
                    drawVals: parsedInGameLayOdds.vals.draw,
                    awayVals: parsedInGameLayOdds.vals.away,
                    homeCrossVals: parsedInGameLayOdds.crossVals.home,
                    drawCrossVals: parsedInGameLayOdds.crossVals.draw,
                    awayCrossVals: parsedInGameLayOdds.crossVals.away,
                    updates: parsedInGameLayOdds.updates,
                    },
                coming: {
                    homeOdds: parsedComingLayOdds.odds.home,
                    drawOdds: parsedComingLayOdds.odds.draw,
                    awayOdds: parsedComingLayOdds.odds.away,
                    homeProbs: parsedComingLayOdds.probs.home,
                    drawProbs: parsedComingLayOdds.probs.draw,
                    awayProbs: parsedComingLayOdds.probs.away,
                    homeVals: parsedComingLayOdds.vals.home,
                    drawVals: parsedComingLayOdds.vals.draw,
                    awayVals: parsedComingLayOdds.vals.away,
                    homeCrossVals: parsedComingLayOdds.crossVals.home,
                    drawCrossVals: parsedComingLayOdds.crossVals.draw,
                    awayCrossVals: parsedComingLayOdds.crossVals.away,
                    updates: parsedComingLayOdds.updates
                    }
                 }
            }
        };
  }