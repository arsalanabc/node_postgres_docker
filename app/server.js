require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000;

const { Client } = require('pg');

const client = new Client({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

client.connect();

client.query('show tables;', (err, res) => {
    console.log(res)
    client.end()
})

const routes = require('./src/routes/routes.js')(app);

app.listen(port, () => console.log('example of app listening'))

module.exports = app;