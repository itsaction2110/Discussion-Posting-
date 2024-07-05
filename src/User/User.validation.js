const Joi = require('joi');

const SaveUser = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.number().required(),
    password: Joi.string().required()
});

module.exports = {
    SaveUser
};