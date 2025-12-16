const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const db = mysql.createPool({
  host: 'product-db',
  user: 'product',
  password: 'product123',
  database: 'product_db'
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3002, () => console.log('Product Service running on port 3002'));

