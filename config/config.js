var secret = require("./secret");

module.exports = {
    app: {
        port: 3004
    },
    db: {
        domain: "@ds143774.mlab.com:43774/",
        name: "betfair-db",
        login: secret.db.login,
        password: secret.db.password
    },
}
