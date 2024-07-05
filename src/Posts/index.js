const postRoute = require('./Post.routes');
const postController = require('./Post.Controller');
const postService = require('./Post.service');
const postValidation = require('./Post.validation');

module.exports = { postController, postRoute, postService, postValidation };