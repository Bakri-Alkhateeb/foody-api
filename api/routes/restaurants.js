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

router.get('/', (req, res, next) => {

    sqlQuery = 'SELECT * FROM restaurants ORDER BY id ASC';
    try {
        con.query(sqlQuery, function (err, rows) {
            var restaurantsNames = [];
            var restaurantsImages = [];
            var restaurantsIds = [];
            var restaurantsLocations = [];
            var restaurantsRatings = [];

            if (rows['rows'].length > 0) {

                rows['rows'].forEach((row) => {
                    restaurantsNames.push(row.name);
                    restaurantsImages.push(row.image);
                    restaurantsIds.push(row.id);
                    restaurantsLocations.push(row.location);
                    restaurantsRatings.push(row.rating);
                });

                res.status(201).json({
                    count: rows['rows'].length,
                    restaurantsNames: restaurantsNames,
                    restaurantsImages: restaurantsImages,
                    restaurantsIds: restaurantsIds,
                    restaurantsLocations: restaurantsLocations,
                    restaurantsRatings: restaurantsRatings
                })

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