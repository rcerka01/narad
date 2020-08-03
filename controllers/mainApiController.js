var bodyParser = require('body-parser');
var bet = require("../models/Bet").dataset;
var account = require("../models/Account").dataset;
var vishnu = require("../models/Vishnu").dataset;
var ObjectId = require('mongodb').ObjectID;

module.exports = { run: function (app) {
    app.use(bodyParser.json());

    // BETS ############################################################################
    app.post("/findBetByDate", function(req, res) {

        var start = req.body.start;
        var end = req.body.end;

        var find = 
            { _id: 
                {
                    $gte: ObjectId(Math.floor(start/1000).toString(16) + "0000000000000000"), 
                    $lte: ObjectId(Math.floor(end/1000).toString(16) + "0000000000000000")
                }
            };

        var sort = req.body.sort;
        var subset = req.body.subset;    
        bet.find(find).sort(sort).exec(function (err, results) {
           
            if (err) console.log("EXCEPTION IN FIND ACTION QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });
        
    // GAMES ############################################################################
    app.post("/findGameByDate", function(req, res) {
    
        var start = req.body.start;
        var end = req.body.end;
        var command1 = req.body.command1;
        var command2 = req.body.command2;

        if (command1) { var command1Js = { $eq: command1 }; } else { var command1Js = { $exists: true }; }
        if (command2) { var command2Js = { $eq: command2 }; } else { var command2Js = { $exists: true }; }
        
        var find = {
             _id: {
                    $gte: ObjectId(Math.floor(start/1000).toString(16) + "0000000000000000"), 
                    $lte: ObjectId(Math.floor(end/1000).toString(16) + "0000000000000000")
                }
            };

        var sort = req.body.sort;
        var subset = req.body.subset;  
          
        vishnu.find(find).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG GAME QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    app.post("/findGamesQuery", function(req, res) {
        
        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        vishnu.find(find, subset).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG MARKET QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    // all game queries should be replaced with this one
    app.post("/findGames", function(req, res) {        

        var sort = req.body.sort;
        var find = req.body.find;

        vishnu.find(find).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG MARKET QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    // ACCOUNTS ############################################################################
    app.post("/findAccountByDate", function(req, res) {

        var start = req.body.start;
        var end = req.body.end;

        var find = 
            { _id: 
                {
                    $gte: ObjectId(Math.floor(start/1000).toString(16) + "0000000000000000"), 
                    $lte: ObjectId(Math.floor(end/1000).toString(16) + "0000000000000000")
                }
            };

        var sort = req.body.sort;
        var subset = req.body.subset;    
        account.find(find).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG ACCOUNT QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    // SEARCH ############################################################################

    app.post("/findGamesByDateAndTeam", function(req, res) {

        var start = req.body.start;
        var end = req.body.end;
        var home = req.body.home;
        var away = req.body.away;

        var find = { $and: [
            { _id: 
                {
                    $gte: ObjectId(Math.floor(start/1000).toString(16) + "0000000000000000"), 
                    $lte: ObjectId(Math.floor(end/1000).toString(16) + "0000000000000000")
                }
            },
            { $or: [
                { "score.home.name": home },
                { "score.home.name": away },
                { "score.away.name": home },
                { "score.away.name": away }
                ]
            }
        ]};
            
        var sort = req.body.sort;
        vishnu.find(find).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG RESULTS QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });
  }
}
