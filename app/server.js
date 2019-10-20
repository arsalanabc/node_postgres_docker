const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send("welcome to my page"))

app.listen(port, () => console.log('example of app listening'))

module.exports = app;