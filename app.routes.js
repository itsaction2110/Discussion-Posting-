const express = require('express');
const apiRoute = express.Router({ mergeParams: true });
const { userRoute } = require('./src/User');
const { postRoute } = require('./src/Posts');
const registerRoute = require('./src/Register/registration.routes');
const loginRoute = require('./src/login/login.routes');

apiRoute.use('/login', loginRoute);
apiRoute.use('/signup', registerRoute);
apiRoute.use('/user', userRoute);
apiRoute.use('/post', postRoute);

module.exports = apiRoute;