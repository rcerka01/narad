var bodyParser = require('body-parser')
var action = require("../models/Action").dataset;
var logAccount = require("../models/logAccount").dataset;
var logGame= require("../models/logGame").dataset;
var logMarket = require("../models/logMarket").dataset;
var logResult = require("../models/logResult").dataset;
var logStatus = require("../models/logStatus").dataset;

module.exports = { run: function (app) {
    app.use(bodyParser.json());
    
    // ACTION
    app.post("/findActionQuery", function(req, res) {

        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        action.find(find, subset).sort(sort).exec(function (err, results) {
           
            if (err) console.log("EXCEPTION IN FIND ACTION QUERY: " + err);
            
            var total = results.length;
            res.json({total: total, results: results}); 
        });
    });
        
    // LOG ACCOUNT
    app.post("/findLogAccountQuery", function(req, res) {
        
        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        logAccount.find(find, subset).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG ACCOUNT QUERY: " + err);
            
            var total = results.length;
            res.json({total: total, results: results}); 
        });
    });
        
    // LOG GAME
    app.post("/findLogGameQuery", function(req, res) {
        
        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        logGame.find(find, subset).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG GAME QUERY: " + err);
            
            var total = results.length;
            res.json({total: total, results: results}); 
        });
    });
        
    // LOG MARKET
    app.post("/findLogMarketQuery", function(req, res) {
        
        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        logMarket.find(find, subset).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG MARKET QUERY: " + err);
            
            var total = results.length;
            res.json({total: total, results: results}); 
        });
    });

            
    // LOG RESULT
    app.post("/findLogResultQuery", function(req, res) {
        
        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        logResult.find(find, subset).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG RESULT QUERY: " + err);
            
            var total = results.length;
            res.json({total: total, results: results}); 
        });
    });
        
    // LOG STATUS
    app.post("/findLogStatusQuery", function(req, res) {
        
        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        logStatus.find(find, subset).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG STATUS QUERY: " + err);
            
            var total = results.length;
            res.json({total: total, results: results}); 
        });
    });

    //############################################################################    

    app.post("/findLostGames", function(req, res) { 
        var find = req.body.find;
        
        action.find(find).exec(function (err, results) {
                if (err) console.log("EXCEPTION IN FIND LOST GAMES QUERY: " + err);

                var lostGames = []
                 for (var i in results) {

                    if(results[i].results !== "") {
                        var x = results[i].results.split(" ")[1]
                        if(results[i].selectionId !== x) {
                            lostGames.push(results[i])
                        }
                    }

                 }
                var total = lostGames.length;
                res.json({total: total, results: lostGames}); 
            });
        });

    app.post("/findEmptyResponse", function(req, res) { 
        var find = req.body.find;
        
        action.find(find).exec(function (err, results) {
                if (err) console.log("EXCEPTION IN FIND EMPTY RESPONSE GAMES QUERY: " + err);

                var lostGames = []
                    for (var i in results) {
                        if(results[i].results == "") {
                            lostGames.push(results[i])
                        }
                    }
                var total = lostGames.length;
                res.json({total: total, results: lostGames}); 
            });
        });
    }
}
