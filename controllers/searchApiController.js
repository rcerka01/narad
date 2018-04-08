var bodyParser = require('body-parser')
var logGame = require("../models/LogGame").dataset;
var logResult = require("../models/LogResult").dataset;
var logStatus = require("../models/LogStatus").dataset;
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var unirest = require('unirest');

function formatOutput(results, res) {
    var output = []; 
    function joinAwayHome(results, eventId) {
        var bothResults = results.filter(filter => filter.eventId == eventId);
        return {
            eventId: bothResults[0].eventId,
            competitionName: bothResults[0].competitionName,
            startTime: bothResults[0].startTime,
            home: bothResults[0].home,
            away: bothResults[0].away,
            draw: bothResults[0].draw,
            history: [ bothResults[0].history, bothResults[1].history]
        }
    }   
    results.map(result => { 
        if (output.filter(item => item.eventId == result.eventId).length == 0) {
            output.push(joinAwayHome(results, result.eventId));
        }
    });
    return res.json(output);
}

function gameToFormatedGame(game) {
    return {
        eventId: game.logGame.eventId,
        eventName: game.logGame.eventName,
        startTime: game.logGame.startTime,
        home: game.logGame.homeName + "#" + game.logGame.runners.runner1SelectionId,
        away: game.logGame.awayName + "#" + game.logGame.runners.runner2SelectionId,
        draw: game.logGame.runners.drawSelectionId
    };
}

function addGameToArray(responseSimilarGames, result, homeAway) {
    try {var mainGame = JSON.parse(responseSimilarGames.request.headers.game)
    var gameAndHistory = {
        eventId: mainGame.eventId,
        eventName: mainGame.eventName,
        startTime: mainGame.startTime,
        home: mainGame.home,
        away: mainGame.away,
        draw: mainGame.draw,
        history: { 
            [homeAway]: { 
                total: responseSimilarGames.body.total,
                games: responseSimilarGames.body.results.map(gameToFormatedGame)
            }
        }
    }
    result.push(gameAndHistory)} catch(e){}
}

module.exports = { run: function (app) {
    app.use(bodyParser.json());

    app.post("/searchByEventId", function(req, res) {

        req.setTimeout(0);

        var host = "http://127.0.0.1:3004"

        var eventIds = req.body.eventIds;
        var month = req.body.month;

        var fingGamesBody = { "find": {
            "logGame.eventId": { "$in" : eventIds }
            }
        }

        unirest.post(host + '/findLogGameQuery')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(JSON.stringify(fingGamesBody))
        .end(function (responseGames) {
            var games = responseGames.body.results;
        
            var result = [];
            games.map(game => { 

                var start = moment(game.logGame.startTime).subtract(month, 'month');
                var end = moment(game.logGame.startTime);
                var teamHome = game.logGame.homeName;
                var teamAway = game.logGame.awayName;

                function findSameTeamGamesBody(start, end, team) { return { "find": {
                    "$and": [{
                        "$or": [ 
                            { "logGame.runners.runner1Name": team },
                            { "logGame.runners.runner2Name": team }
                        ]
                    },{
                        "logGame.startTime": {
                            "$gte": start,
                            "$lt": end
                        }
                    }]
                }}}

                unirest.post(host + '/findLogGameQuery')
                .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'game': JSON.stringify(gameToFormatedGame(game))})
                .send(JSON.stringify(findSameTeamGamesBody(start, end, teamHome)))
                .end(function (responseSimilarGames) {
                    addGameToArray(responseSimilarGames, result, "home");

                    if ((result.length ) == games.length*2) {
                       formatOutput(result, res);
                    } 
                });

                unirest.post(host + '/findLogGameQuery')
                .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'game': JSON.stringify(gameToFormatedGame(game))})
                .send(JSON.stringify(findSameTeamGamesBody(start, end, teamAway)))
                .end(function (responseSimilarGames) {
                    addGameToArray(responseSimilarGames, result, "away");

                    if ((result.length ) == games.length*2) {
                       formatOutput(result, res);
                    } 
                });
            });        
        });
    });
}}
