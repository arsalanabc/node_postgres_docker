function routes(app) {
    app.get('/', (req, res) => res.send("welcome to my page after routing"));
}

module.exports = routes;