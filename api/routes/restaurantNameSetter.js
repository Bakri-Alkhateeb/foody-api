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
    sqlQuery = `SELECT name FROM restaurants WHERE id = '${restaurantId}';`;
    try {
        con.query(sqlQuery, function (err, rows) {

            var restaurantName;

            if (!err) {

                restaurantName = rows['rows'][0]['name'];

                res.status(201).json({
                    restaurantName: restaurantName
                })

            } else {
                console.error("Failure in restaurantNameSetter.js");
                res.sendStatus(202);
            }
        });
    } catch{
        console.log(err);
        console.log('Error in restaurantNameSetter.js');
    }
});

module.exports = router;