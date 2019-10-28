const { Client } = require('pg');

prod = {
    user: process.env.POSTGRES_USER,
    host: process.env.PGHOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT
}
testing = {
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT
}
const current = process.env.NODE_ENV=='production'?prod:testing;
const client = new Client(current);
client.connect().catch((e) =>{
        console.error(e)
        process.exit(1)}
    );

module.exports = client;