const userService = require('./User.service');
const Joi = require('joi');
const userValidation = require('./User.validation');

const SaveUser = async (req, res, next) => {
    const { name, email, mobile, password } = req.body;
    try {
        // validate the request body first
        const { error } = await userValidation.SaveUser.validateAsync({ name, email, mobile, password });
        if (error) return next(ApiError.badRequest(error.details[0].message));
        const data = await userService.SaveUser(name, email, mobile, password);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

const UpdateUser = async (req, res, next) => {
    const userId = req.params.userId;
    const { name, email, mobile } = req.body;
    try {
        const data = await userService.UpdateUser(userId, name, email, mobile);
        return res.status(200).send(data)
    } catch (error) {
        return next(error);
    }
};

const GetUserList = async (req, res, next) => {
    const { searchString } = req.query;
    try {
        const data = await userService.GetUserList(searchString);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

const DeleteUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const data = await userService.DeleteUser(userId);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    SaveUser,
    UpdateUser,
    GetUserList,
    DeleteUser
};