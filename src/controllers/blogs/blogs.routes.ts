import { Router } from 'express';
import * as BlogController from './blogs.controller';
 import * as authMiddleware from '../../middleware/auth'
import { upload } from '../../middleware/fileUpload';

const router = Router();

router.route('').get(BlogController.BlogsList);
router.route('/add').post(upload.single('blogImage'), BlogController.AddBlog);
router.route('/edit').post(upload.single('blogImage'), BlogController.EditBlog);
router.route('/*').get(BlogController.FindOne);
router.route('/*').delete(authMiddleware.isAuthorized, BlogController.DeleteBlog);

export default router