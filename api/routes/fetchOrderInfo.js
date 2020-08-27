const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool
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

    var orderId = req.body.orderId;

    sqlQuery = `SELECT order_date, order_time FROM orders WHERE id = ${orderId} ;`;

    try {
        con.query(sqlQuery, function (err, rows) {
            
            var orderDate, orderTime;

            if (err) {
                res.sendStatus(202);
                console.log(err);
            } else {
                orderDate = rows['rows'][0]['order_date'];
                orderTime = rows['rows'][0]['order_time'];
                res.status(201).json({
                    orderDate: orderDate,
                    orderTime: orderTime
                });
            }
        });
    } catch{
        console.log('Error in orders.js');
    }
});


module.exports = router;