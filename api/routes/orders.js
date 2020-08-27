const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool
const dotenv = require('dotenv');
dotenv.config();
let nodeGeocoder = require('node-geocoder');

let options = {
    provider: 'nominatimmapquest',
    apiKey: 'TTHv5MLuNRyF0RHBvwJS5lC3Qq2HVAwE'
};

let geoCoder = nodeGeocoder(options);

const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

router.post('/', (req, res, next) => {
    var mealsIds = req.body.mealsIds;
    var mealsPrices = req.body.mealsPrices;
    var userId = req.body.userId;
    var ownerRestaurantId = req.body.ownerRestaurantId;
    var orderPrice = req.body.orderPrice;
    var quantities = req.body.quantities;
    var lat = req.body.lat;
    var long = req.body.long;
    var time = new Date();
    var mins = time.getMinutes();
    if (mins < 10) {
        mins = "0" + mins.toString();
    }
    var myDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getUTCDate()}`;
    var myTime = `${time.getHours()}:${mins}`;

    var orderLocation;

    geoCoder.reverse({ lat: lat, lon: long })
        .then((location) => {
            console.log(location);
            if (location[0]['streetName'] != null) {
                orderLocation = location[0]['streetName'];
            }else{
                orderLocation = 'غير معروف'
            }
        })
        .catch((err) => {
            console.log(err);
        }).then(() => {

            sqlQuery = `insert into orders (order_date, user_id, meals_ids, owner_restaurant_id, order_price, location, quantities, order_time, meals_prices) VALUES('${myDate}', ${userId}, ARRAY${mealsIds}, ${ownerRestaurantId}, ${orderPrice}, '${orderLocation}', ARRAY${quantities}, '${myTime}', ARRAY${mealsPrices});`;

            try {
                con.query(sqlQuery, function (err, row) {
                    if (err) {
                        res.sendStatus(202);
                        console.log(err);
                    } else {
                        console.log("1 order inserted");
                        res.sendStatus(201);
                    }
                });
            } catch{
                console.log('Error in orders.js');
            }
        });
});


module.exports = router;