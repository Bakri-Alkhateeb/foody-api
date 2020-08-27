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
    orderId = req.body.orderId;
    sqlQuery = `SELECT meals_ids FROM orders WHERE id = ${orderId}`;
    try {
        con.query(sqlQuery, function (err, rows) {
            var orderMeals = [];
            var orderMealsPrices = [];

            if (!err) {

                mealsIds = rows['rows'][0]['meals_ids'];

                var iterationsCount = mealsIds.length;

                mealsIds.forEach((id) => {

                    sqlQuery2 = `SELECT name, price FROM meals WHERE id = ${id}`;

                    try {
                        con.query(sqlQuery2, function (err, rows) {

                            if (rows['rows'].length > 0) {
                                iterationsCount--;
                                orderMeals.push(rows['rows'][0]['name']);
                                orderMealsPrices.push(rows['rows'][0]['price']);
                            
                                if (iterationsCount == 0) {
                                    res.status(201).json({
                                        count: mealsIds.length,
                                        orderMeals: orderMeals,
                                        orderMealsPrices: orderMealsPrices
                                    })
                                }

                            } else {
                                console.error("Failure in restaurants.js");
                                res.sendStatus(202);
                            }
                        });
                    } catch{
                        console.log(err);
                        console.log('Error in restaurants.js');
                    }

                });

            } else {
                console.error("Failure in restaurants.js");
                res.sendStatus(202);
            }
        });
    } catch{
        console.log(err);
        console.log('Error in restaurants.js');
    }
});

module.exports = router;