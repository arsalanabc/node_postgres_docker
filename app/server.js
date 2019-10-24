require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const log4js = require('log4js');
log4js.configure('./src/config/log4js.json');

const log = log4js.getLogger();

const routes = require('./src/routes/routes.js')(app);

app.listen(port, () => console.log('example of app listening'));
log.info('app launched and listening at', port);

module.exports = app;