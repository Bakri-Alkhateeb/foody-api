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

        mealId = req.body.mealId;

        sqlQuery = `SELECT name, price, image FROM meals where id = ${mealId}`;
        try {
            con.query(sqlQuery, function (err, rows) {
                
                var mealName = rows['rows'][0]['name'];
                var mealImage = rows['rows'][0]['image'];
                var mealPrice = rows['rows'][0]['price'];
            
                if (!err) {

                    res.status(201).json({
                        mealName: mealName,
                        mealImage: mealImage,
                        mealPrice: mealPrice,
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