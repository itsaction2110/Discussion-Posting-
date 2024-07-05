const userRoute = require('./User.routes');
const userController = require('./User.Controller');
const userService = require('./User.service');
const userValidation = require('./User.validation');

module.exports = { userController, userRoute, userService, userValidation };