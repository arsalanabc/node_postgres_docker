const { Client } = require('pg');

prod = {
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
}
testing = {
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5433
}
const current = process.env.NODE_ENV=='production'?prod:testing;
const client = new Client(current);
client.connect();

module.exports = client;