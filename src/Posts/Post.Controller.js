const postService = require('./Post.service');
const postValidation = require('./Post.validation');
const ApiError = require('../../libs/common/handlers/error/ApiError');

const SavePost = async (req, res, next) => {
    try {
        const image = req.file;
        const { description, hashtag } = req.body;
        const userId = req.userId;
         // validate the request body first
        const { error } = await postValidation.SavePost.validateAsync({ description, hashtag });
        if (error) return next(ApiError.badRequest(error.details[0].message));
        const data = await postService.SavePost(description, hashtag, image, userId);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

const UpdatePost = async (req, res, next) => {
    try {
        const image = req.file;
        const postId = req.params.postId;
        const userId = req.userId;
        const { description, hashtag } = req.body;
        const data = await postService.UpdatePost(postId, description, hashtag, image, userId);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

const DeletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const data = await postService.DeletePost(postId, userId);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

const GetPostList = async (req, res, next) => {
    try {
        const { searchString, searchByHashtag } = req.query;
        const data = await postService.GetPostList(searchString, searchByHashtag);
        return res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    SavePost,
    UpdatePost,
    GetPostList,
    DeletePost
}