const bcrypt = require('bcrypt');
const db = require('../config/db');

const ADMIN_EMAIL = 'admin@example.com'; 
const ADMIN_PASSWORD = 'admin1234'; 


exports.getSignup = (req, res) => {
    res.render('signup');
};


exports.postSignup = (req, res) => {
    const { username, address, email, password } = req.body;

    // Check if the email matches the admin email
    if (email === ADMIN_EMAIL) {
        return res.send('Admin cannot sign up, please use the admin login page.'); // Prevent admin registration
    }

    // Hash the password for regular users
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        // Insert user into the database
        db.query('INSERT INTO users (username, address, email, password, role) VALUES (?, ?, ?, ?, ?)', 
            [username, address, email, hashedPassword, 'user'], 
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.send('Username or email already exists!'); // Provide feedback to user
                    }
                    throw err;
                }
                res.redirect('/login'); // Redirect to login page after successful sign-up
            }
        );
    });
};


exports.getLogin = (req, res) => {
    res.render('login');
};


exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            
            bcrypt.compare(password, results[0].password, (err, match) => {
                if (err) throw err;

                if (match) {
                    const role = results[0].role;
                    if (role === 'admin') {
                        res.redirect('/admin'); 
                    } else {
                        res.redirect('/user'); 
                    }
                } else {
                    res.send('Invalid username or password!');
                }
            });
        } else {
            res.send('Invalid username or password!');
        }
    });
};


exports.postAdminLogin = (req, res) => {
    const { username, password } = req.body;

    
    if (username === 'admin' && password === ADMIN_PASSWORD) {
        
        db.query('SELECT * FROM users WHERE username = ?', ['admin'], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                
                bcrypt.hash(ADMIN_PASSWORD, 10, (err, hashedPassword) => {
                    if (err) throw err;

                    db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
                        ['admin', ADMIN_EMAIL, hashedPassword, 'admin'], 
                        (err, result) => {
                            if (err) throw err;
                            console.log('Admin account created successfully.');
                            res.redirect('/admin'); 
                        }
                    );
                });
            } else {
                res.redirect('/admin'); 
            }
        });
    } else {
        res.send('Invalid admin username or password!');
    }
};


exports.getUserUI = (req, res) => {
    res.render('userUI');
};

exports.getAdminUI = (req, res) => {
    res.render('adminUI');
};