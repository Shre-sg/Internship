
const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USR,
  password: process.env.PASS,  // Use the environment variable
  database: process.env.DB,
  port: process.env.PORT,
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
});

module.exports = db;
