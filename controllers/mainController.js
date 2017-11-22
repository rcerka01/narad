var bodyParser = require('body-parser')
var action = require("../models/Action").dataset;

module.exports = { run: function (app) {
    app.use(bodyParser.json());
    
    app.post("/findQuery", function(req, res) {

        var find = req.body.find;
        var sort = req.body.sort;
        var subset = req.body.subset;    
        action.find(find, subset).sort(sort).exec(function (err, results) {
           
               if (err) console.log("EXCEPTION IN FIND QUERY: " + err);
               
               var total = results.length;
               res.json({total: total, results: results}); 
           });
        });

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
