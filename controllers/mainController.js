module.exports = { run: function (app) {

        // main pages
        app.get("/", function(req, res) {
            res.render("bets");
        });

        app.get("/bets", function(req, res) {
            res.render("bets");
        });
  
        app.get("/games", function(req, res) {
            res.render("games");
        });
            
        app.get("/account", function(req, res) {
            res.render("account");
        });

        // sub pages
        app.get("/search", function(req, res) {
            res.render("search");
        });
        
        app.get("/game", function(req, res) {
            res.render("game");
        });
            
        app.get("/gameOdds", function(req, res) {
            res.render("gameOdds");
        });
    }
}
