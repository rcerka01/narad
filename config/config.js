var secret = require("./secret");

module.exports = {
    app: {
        port: 3004
    },
    db: {
        name: "betfair-db",
        login: secret.db.login,
        password: secret.db.password
    }
}
