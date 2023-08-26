
import { Router } from 'express';
import * as ProjectsController from './projects.controller';
import * as authMiddleware from '../../middleware/auth'
import { upload } from '../../middleware/fileUpload';

const router = Router();

router.route('').get(ProjectsController.ProjectList);
router.route('').post(authMiddleware.isAuthorized,upload.single('projectImage'), ProjectsController.AddProject);
router.route('').delete(authMiddleware.isAuthorized, ProjectsController.DeleteAllProjects);
router.route('/:id').get(ProjectsController.FindOneProject);
router.route('/:id').put(authMiddleware.isAuthorized,upload.single('projectImage'),ProjectsController.EditProject);
router.route('/:id').delete(authMiddleware.isAuthorized, ProjectsController.DeleteProject);


//Project_Sections
router.route('/:id/projectsection').post(upload.single('projectSectionImage'), ProjectsController.AddProjectSection);
router.route('/:id/projectsection/:id').delete(ProjectsController.DeleteProjectSection);
router.route('/:id/projectsection/:id').put(upload.single('ProjectsectionImage'),ProjectsController.EditProjectSection);

export default router

