const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const loginRoute = require('./api/routes/login');
const signUpRoute = require('./api/routes/signup');
const restaurantsRoute = require('./api/routes/restaurants');
const mealsRoute = require('./api/routes/meals');
const ordersRoute = require('./api/routes/orders');
const mealsInsertRoute = require('./api/routes/mealsInsert');
const restaurantsInsertRoute = require('./api/routes/restaurantsInsert');
const receivedOrdersRoute = require('./api/routes/receivedOrders');
const restaurantNameSetterRoute = require('./api/routes/restaurantNameSetter');
const cartRoute = require('./api/routes/cart');
const fetchClientInfoRoute = require('./api/routes/fetchClientInfo');
const fetchOrderInfoRoute = require('./api/routes/fetchOrderInfo');
const fetchOrderMealsRoute = require('./api/routes/fetchOrderMeals');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*')
        return res.status(200).json({})
    }
    next();
})

app.use('/login', loginRoute);
app.use('/signup', signUpRoute);
app.use('/restaurants', restaurantsRoute);
app.use('/meals', mealsRoute);
app.use('/orders', ordersRoute);
app.use('/mealsInsert', mealsInsertRoute);
app.use('/restaurantsInsert', restaurantsInsertRoute);
app.use('/cart', cartRoute);
app.use('/receivedOrders', receivedOrdersRoute);
app.use('/restaurantNameSetter', restaurantNameSetterRoute);
app.use('/fetchClientInfo', fetchClientInfoRoute);
app.use('/fetchOrderInfo', fetchOrderInfoRoute);
app.use('/fetchOrderMeals', fetchOrderMealsRoute);
app.use('/restaurantsImages', express.static('restaurantsImages'));
app.use('/mealsImages', express.static('mealsImages'));

app.use('/', (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use('/', (error, req, res, next) => {
    res.status(error.status || 500);    
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;