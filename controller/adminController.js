const db = require('../config/db');

exports.getAdminLogin = (req,res)=>{
    res.render('adminLogin');
};

exports.postAdminLogin = (req,res)=>{
    const{ email, password } = req.body;

    db.query('SELECT * FROM admins WHERE email = ? AND password = ?', 
        [email, password], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.send('Admin login successful! Welcome, ' + results[0].username);
            } else {
                res.send('Invalid admin email or password!');
            }
        });
    };