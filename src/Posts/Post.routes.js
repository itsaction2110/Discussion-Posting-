const express = require('express');
const cors = require('cors');
const routes = express.Router();
const { upload, uploadMemory } = require('../middleware/multer');
const postController = require('./Post.Controller');
const auth = require('../middleware/auth');

//using multer middleware parses the form-data into key-value pair and store in req body.
routes.post('/save', auth, upload, postController.SavePost);
routes.put('/:postId', auth, upload, postController.UpdatePost);
routes.get('/listing', auth, postController.GetPostList);
routes.delete('/:postId', auth, postController.DeletePost);

module.exports = routes;