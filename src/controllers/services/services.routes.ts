import { Router } from 'express';
import * as servicesController from './services.controller';
import * as authMiddleware from '../../middleware/auth'
import { upload } from '../../middleware/fileUpload';

const router = Router();

router.route('').get(servicesController.ServicesList);
router.route('').post(authMiddleware.isAuthorized, servicesController.AddServices);
router.route('').delete(authMiddleware.isAuthorized, servicesController.DeleteAllServices);
router.route('/:id').put(servicesController.Editservices);
router.route('/:id').get(servicesController.FindOneService);

router.route('/:id').delete(authMiddleware.isAuthorized, servicesController.DeleteService);
//sections Routes:
router.route('/:id/section/:id').get(servicesController.FindOneSection);
router.route('/:id/section/:id').delete(servicesController.DeleteSection);
router.route('/:id/section/:id').put(upload.single('sectionImage'),servicesController.Editsection);
router.route('/:id/section').post(upload.single('sectionImage'), servicesController.AddServiceSection);
export default router