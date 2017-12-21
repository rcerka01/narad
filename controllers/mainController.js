module.exports = { run: function (app) {
    
        app.get("/game", function(req, res) {
            res.render("game");
        });

        app.get("/", function(req, res) {
            res.render("main");
        });

    }
}
