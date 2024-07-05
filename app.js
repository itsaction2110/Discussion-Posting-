const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const logger = require('morgan');
const apiRoute = require('./app.routes');
const apiErrorHandler = require('./libs/common/handlers/error/api-error-handler');

//load app middlewares
app.use(cors());
app.use(logger('dev'));
app.use(bodyparser.raw());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.text());

//routing middleware 
app.use(apiRoute);

//error handler.
app.use(apiErrorHandler);

// establish http server connection
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));