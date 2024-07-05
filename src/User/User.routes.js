const express = require('express');
const cors = require('cors');
const routes = express.Router();
const userController = require('./User.Controller');
const auth = require('../middleware/auth');

routes.post('/save', auth, userController.SaveUser);
routes.put('/:userId', auth, userController.UpdateUser);
routes.get('/listing', auth, userController.GetUserList);
routes.delete('/:userId', auth, userController.DeleteUser);

module.exports = routes;