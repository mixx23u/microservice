const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const db = mysql.createPool({
  host: 'auth-db',       // tên container MySQL
  user: 'user',
  password: 'user123',
  database: 'user_db'
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3001, () => console.log('Auth Service running on port 3001'));
