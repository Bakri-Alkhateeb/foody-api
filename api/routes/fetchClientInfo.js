const express = require('express');
const router = express.Router();
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

router.post('/', (req, res, next) => {

    var orderId = req.body.orderId;

    const sqlQuery = `SELECT user_id FROM orders WHERE id = '${orderId}';`;

    con.query(sqlQuery, function (err, rows) {

        try {
            if (!err) {

                var userId = rows['rows'][0]['user_id'];

                const sqlQuery2 = `SELECT full_name, phone_number FROM users WHERE id = '${userId}';`;

                con.query(sqlQuery2, function (err, rows) {

                    var fullName;

                    try {
                        if (!err) {

                            fullName = rows['rows'][0]['full_name'];
                            phoneNumber = rows['rows'][0]['phone_number'];

                            res.status(201).json({
                                fullName: fullName,
                                phoneNumber: phoneNumber
                            })

                        } else {
                            console.error("Failure in fetchClientName.js");
                            console.log(err);
                            res.sendStatus(202);
                        }
                    } catch{
                        console.log('Error in fetchClientName.js');
                    }
                });

            } else {
                console.error("Failure in fetchClientName.js");
                console.log(err);
                res.sendStatus(202);
            }
        } catch{
            console.log('Error in fetchClientName.js');
        }
    });

});

module.exports = router;