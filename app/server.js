require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000;

const routes = require('./src/routes/routes.js')(app);

app.listen(port, () => console.log('example of app listening'))

module.exports = app;