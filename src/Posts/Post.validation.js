const Joi = require('joi');

const SavePost = Joi.object().keys({
    description: Joi.string().required(),
    hashtag: Joi.string().required()
});

module.exports = {
    SavePost
};