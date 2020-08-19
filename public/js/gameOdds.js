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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                 arr   in game       msg         do lay to back    cross
function parseOdds(arr, isInPlay, typeForMessage, convertLayToBack, crossArr) { 
    var enableMsgForNormal = false;
    var enableMsgForCross = false

    arr = orderArr(arr);
    var initialArrForLabel = arr;

    if (convertLayToBack) {
        arr = laysToBacks(arr);
    }

    //
    if (crossArr !== undefined) {
        var crossProbsAndVals = getProbsAndVals(arr, isInPlay, typeForMessage, initialArrForLabel, enableMsgForCross, crossArr);
    } else { 
           var crossProbsAndVals = [];
    }
    var probsAndVals =          getProbsAndVals(arr, isInPlay, typeForMessage, initialArrForLabel, enableMsgForNormal);
    //

    return {
        updates:  probsAndVals.updates,
        odds: {
            home: probsAndVals.homeOdds,
            draw: probsAndVals.drawOdds,
            away: probsAndVals.awayOdds
        },
        probs: {
            home: probsAndVals.homeProbs,
            draw: probsAndVals.drawProbs,
            away: probsAndVals.awayProbs
        },
        vals: {
            home: probsAndVals.homeVals,
            draw: probsAndVals.drawVals,
            away: probsAndVals.awayVals
        },
        crossVals: {
            home: crossProbsAndVals.homeVals,
            draw: crossProbsAndVals.drawVals,
            away: crossProbsAndVals.awayVals
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

    //                                   arr   inGame  msg   layToB  cross
    var parsedInGameBackOdds = parseOdds(back, true, "BACK", false, lay);
    var parsedComingBackOdds = parseOdds(back, false, "BACK", false, lay);
    var parsedInGameLayOdds = parseOdds(lay, true, "LAY", true, back);
    var parsedComingLayOdds = parseOdds(lay, false, "LAY", true, back);
    //

    var width = "width='1400'"

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
                    homeOdds:      parsedInGameBackOdds.odds.home,
                    drawOdds:      parsedInGameBackOdds.odds.draw,
                    awayOdds:      parsedInGameBackOdds.odds.away,
                    homeProbs:     parsedInGameBackOdds.probs.home,
                    drawProbs:     parsedInGameBackOdds.probs.draw,
                    awayProbs:     parsedInGameBackOdds.probs.away,
                    homeVals:      parsedInGameBackOdds.vals.home,
                    drawVals:      parsedInGameBackOdds.vals.draw,
                    awayVals:      parsedInGameBackOdds.vals.away,                  
                    homeCrossVals: parsedInGameBackOdds.crossVals.home,
                    drawCrossVals: parsedInGameBackOdds.crossVals.draw,
                    awayCrossVals: parsedInGameBackOdds.crossVals.away,
                    updates:       parsedInGameBackOdds.updates
                    },
                coming: {
                    homeOdds:      parsedComingBackOdds.odds.home,
                    drawOdds:      parsedComingBackOdds.odds.draw,
                    awayOdds:      parsedComingBackOdds.odds.away,
                    homeProbs:     parsedComingBackOdds.probs.home,
                    drawProbs:     parsedComingBackOdds.probs.draw,
                    awayProbs:     parsedComingBackOdds.probs.away,
                    homeVals:      parsedComingBackOdds.vals.home,
                    drawVals:      parsedComingBackOdds.vals.draw,
                    awayVals:      parsedComingBackOdds.vals.away,
                    homeCrossVals: parsedComingBackOdds.crossVals.home,
                    drawCrossVals: parsedComingBackOdds.crossVals.draw,
                    awayCrossVals: parsedComingBackOdds.crossVals.away,
                    updates:       parsedComingBackOdds.updates
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