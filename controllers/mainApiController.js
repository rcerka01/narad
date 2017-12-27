var bodyParser = require('body-parser')
var action = require("../models/Action").dataset;
var logAccount = require("../models/LogAccount").dataset;
var logGame= require("../models/LogGame").dataset;
var logMarket = require("../models/LogMarket").dataset;
var logResult = require("../models/LogResult").dataset;
var logStatus = require("../models/LogStatus").dataset;
var ObjectId = require('mongodb').ObjectID;

module.exports = { run: function (app) {
    app.use(bodyParser.json());

    // // DELETE EMPTY ACCOUNT LOGS
    // app.post("/dal", function(req, res) {
    //     var x = { "logAccount": [] };
    //     logAccount.remove(x).exec(function (err, results) {
    //         res.json(results);
    //     });
    // });
    
    // ACTION
    app.post("/findActionQuery", function(req, res) {

        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        action.find(find, subset).sort(sort).exec(function (err, results) {
           
            if (err) console.log("EXCEPTION IN FIND ACTION QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    // ACTION BY DATE
    app.post("/findActionByDate", function(req, res) {

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
        action.find(find).sort(sort).exec(function (err, results) {
           
            if (err) console.log("EXCEPTION IN FIND ACTION QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
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
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    // LOG ACCOUNT BY DATE
    app.post("/findLogAccountByDate", function(req, res) {

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
        logAccount.find(find).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG ACCOUNT QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
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
            
            try { var total = results.length; } catch(e) { var total = 0; }
            res.json({total: total, results: results}); 
        });
    });

    // LOG GAME BY DATE
    app.post("/findLogGameByDate", function(req, res) {
    
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
        logGame.find(find).sort(sort).exec(function (err, results) {
            
            if (err) console.log("EXCEPTION IN FIND LOGG GAME QUERY: " + err);
            
            try { var total = results.length; } catch(e) { var total = 0; }
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
            
            try { var total = results.length; } catch(e) { var total = 0; }
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
            
            try { var total = results.length; } catch(e) { var total = 0; }
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
            
            try { var total = results.length; } catch(e) { var total = 0; }
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

                try { var total = lostGames.length; } catch(e) { var total = 0; }
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
                try { var total = lostGames.length; } catch(e) { var total = 0; }
                res.json({total: total, results: lostGames}); 
            });
    });
  }
}
