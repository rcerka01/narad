var secret = require("./secret");

module.exports = {
    app: {
        port: 3004
    },
    db: {
        domain: "@ds231938-a0.mlab.com:31938,ds231938-a1.mlab.com:31938/",
        name: "betfair-db?replicaSet=rs-ds231938",
        login: secret.db.login,
        password: secret.db.password
    },
}
