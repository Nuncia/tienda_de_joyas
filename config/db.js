const { Pool } = require('pg');
require('dotenv').config();
const { HOST, USER, PASSWORD, DATABASE } = process.env;

const pool = new Pool({
   host: HOST,
   user: USER,
   password: '',
   database: DATABASE,
   port: 5433,
   allowExitOnIdle: true,
});

module.exports = pool;
