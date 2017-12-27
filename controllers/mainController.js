module.exports = { run: function (app) {

        app.get("/", function(req, res) {
            res.render("inbet");
        });
            
        app.get("/game", function(req, res) {
            res.render("game");
        });
  
        app.get("/stats", function(req, res) {
            res.render("stats");
        });
            
        app.get("/bets", function(req, res) {
            res.render("bets");
        });
            
        app.get("/search", function(req, res) {
            res.render("search");
        });
            
        app.get("/account", function(req, res) {
            res.render("account");
        });
    }
}
