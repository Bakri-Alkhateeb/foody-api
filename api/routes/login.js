const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const KEY = `${process.env.CRYPTO_KEY}`;
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

router.post('/', (req, res) => {
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    username = req.body.username;
    isManager = req.body.isManager;

    if (isManager === 'true') {
        const sqlQuery = `SELECT related_restaurant_id FROM users WHERE username = '${username}' and password = '${password}' and is_manager = 'true';`;

        con.query(sqlQuery, function (err, rows) {

            var userId, userUsername;
            var relatedRestaurantId = rows['rows'][0]['related_restaurant_id'];

            try {
                if (rows['rows'].length > 0) {
                    var payload = {
                        username: req.body.username,
                    }
                    
                    rows['rows'].forEach((row) => {
                        userId = row.id;
                        userUsername = row.username;
                    });

                    var token = jwt.sign(payload, KEY, { algorithm: 'HS256' });
                    console.log("Logged In");

                    res.status(201).json({
                        token: token,
                        id: userId,
                        username: userUsername,
                        password: req.body.password,
                        relatedRestaurantId: relatedRestaurantId
                    })
                } else {
                    console.error("Failure in login.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            } catch{
                console.log('Error in login.js');
            }
        });
    } else {

        const sqlQuery2 = `SELECT * FROM users WHERE username = '${username}' and password = '${password}' and is_manager = 'false';`;

        con.query(sqlQuery2, function (err, rows) {

            var userId, userUsername, fullName;
            console.log('=======================');
            console.log(rows['rows']);
            console.log('=======================');

            try {
                if (rows['rows'].length > 0) {

                    var payload = {
                        username: req.body.username,
                    }

                    rows['rows'].forEach((row) => {
                        userId = row.id;
                        userUsername = row.username;
                        fullName = row.full_name;
                    });

                    var token = jwt.sign(payload, KEY, { algorithm: 'HS256' });
                    console.log("Logged In");

                    res.status(201).json({
                        token: token,
                        id: userId,
                        username: userUsername,
                        password: req.body.password,
                        fullName: fullName
                    })
                } else {
                    console.error("Failure in login.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            } catch{
                console.log('Error in login.js');
            }
        });
    }
});

module.exports = router;