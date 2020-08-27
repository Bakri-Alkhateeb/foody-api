const express = require('express');
const router = express.Router();
var crypto = require('crypto');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

router.post('/', (req, res, next) => {
    username = req.body.username;
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    isManager = req.body.isManager;

    if (isManager === "true") {
        relatedRestaurantName = req.body.relatedRestaurantName;
        sqlQuery2 = `select id from restaurants where name = '${relatedRestaurantName}';`;
        try {
            con.query(sqlQuery2, function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    relatedRestaurantId = rows['rows'][0]['id'];
                    var fullName = 'صاحب مطعم';
                    var phoneNumber = 0;
                    sqlQuery = `insert into users (username, password, is_manager, related_restaurant_id, full_name, phone_number) VALUES ('${username}', '${password}', '${isManager}', '${relatedRestaurantId}', '${fullName}', '${phoneNumber}')`;
                    try {
                        con.query(sqlQuery, function (err, result) {
                            if (err) {
                                res.sendStatus(202);
                                console.log(err);
                            } else {
                                console.log("1 user added");
                                res.sendStatus(201);
                            }
                        });
                    } catch{
                        console.log('Error in signup.js');
                    }
                }
            });
        } catch{
            console.log('Error in signup.js');
        }
    } else {
        fullName = req.body.fullName;
        phoneNumber = req.body.phoneNumber;

        sqlQuery = `insert into users (username, password, is_manager, related_restaurant_id, full_name, phone_number) VALUES ('${username}', '${password}', '${isManager}', '0', '${fullName}', '${phoneNumber}')`;
        try {
            con.query(sqlQuery, function (err, result) {
                if (err) {
                    res.sendStatus(202);
                    console.log(err);
                } else {
                    console.log("1 user added");
                    res.sendStatus(201);
                }
            });
        } catch{
            console.log('Error in signup.js');
        }
    }
});


module.exports = router;