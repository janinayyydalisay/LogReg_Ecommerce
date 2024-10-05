const mysql = require ('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    root: 'root',
    password: '',
    database: 'ecommerce'
});

db.connect((err) =>{
    if (err) throw err;
    console.log('Already connected to the Database in MySql');
});

module.exports=db;