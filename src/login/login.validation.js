const Joi = require('joi');

const LoginBody = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    LoginBody
};