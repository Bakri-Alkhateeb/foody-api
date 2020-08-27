const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const Pool = require('pg').Pool;
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

try {
    router.post('/', (req, res, next) => {

        restaurantId = req.body.restaurantId;

        sqlQuery = `SELECT * FROM meals where owner_restaurant_id = ${restaurantId} ORDER BY id ASC`;
        try {
            con.query(sqlQuery, function (err, rows) {

                var mealsNames = [];
                var mealsImages = [];
                var mealsIds = [];
                var mealsPrices = [];

                try {
                    mealsArray = rows['rows'];
                } catch{
                    console.log('Don\'t Mind This Error');
                }

                if (!err) {
                    mealsArray.forEach((row) => {
                        mealsNames.push(row.name);
                        mealsImages.push(row.image);
                        mealsIds.push(row.id);
                        mealsPrices.push(row.price);
                    });

                    res.status(201).json({
                        count: rows['rows'].length,
                        mealsNames: mealsNames,
                        mealsImages: mealsImages,
                        mealsIds: mealsIds,                        
                        mealsPrices: mealsPrices,
                    })

                } else {
                    console.error("Failure in meals.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down in meals.js');
        }
    });
} catch{
    console.log('Error in meals.js');
}

module.exports = router;