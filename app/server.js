const express = require('express');
const app = express();

switch (process.env.NODE_ENV) {
    case ('production'):
        require('dotenv').config({path: './.env'});
        break
    default:
        require('dotenv').config({path: './.env.test'});
        break;
}

const port = process.env.PORT;

const log4js = require('log4js');
log4js.configure('./src/config/log4js.json');

const log = log4js.getLogger();

const routes = require('./src/routes/routes.js')(app);

app.listen(port, () => console.log(`this is ${process.env.NODE_ENV} listening at: ${port}`));
log.info('app launched and listening at', port);

module.exports = app;