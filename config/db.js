const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'pslj4265@localhost',
  password: '',
  database: 'pslj4265_rifkira'
});

conn.connect(err => {
  if (err) throw err;
  console.log('Database connected');
});

module.exports = conn;