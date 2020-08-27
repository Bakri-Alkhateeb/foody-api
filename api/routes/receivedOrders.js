const express = require('express');
const router = express.Router();
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
    restaurantId = req.body.restaurantId;
    console.log(restaurantId);
    sqlQuery = `SELECT id FROM orders WHERE owner_restaurant_id = '${restaurantId}' ORDER BY id DESC`;
    try {
        con.query(sqlQuery, function (err, rows) {

            var ordersIds = [];

            if (rows['rows'].length > 0) {

                rows['rows'].forEach((row) => {
                    ordersIds.push(row.id);
                });
                
                res.status(201).json({
                    count: ordersIds.length,
                    ordersIds: ordersIds
                })

            } else {
                console.error("Failure in receivedOrders.js");
                res.sendStatus(202);
            }
        });
    } catch{
        console.log(err);
        console.log('Error in receivedOrders.js');
    }
});

module.exports = router;