
const mysql = require('mysql2');


const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
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
