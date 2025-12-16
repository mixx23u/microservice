const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const db = mysql.createPool({
  host: 'order-db',
  user: 'order',
  password: 'order123',
  database: 'order_db'
});

app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3003, () => console.log('Order Service running on port 3003'));


