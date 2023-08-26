import { Request, Response } from 'express';
import logger from '../../logger';
import { v4 } from 'uuid'
import Projects from '../../models/Projects';
import projectSection, { IProjectSection } from '../../models/projectSection';

export const AddProject = async (req: Request, res: Response) => {
    try {
        let { projectTitle, description, } = req.body;
        const createProject = new Projects({
            projectTitle: projectTitle,
            description: description,
            projectImage: req.file?.path,
        })
        createProject.save((err, savedService) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(savedService);
            }
        })
    } catch (err) {
        res.status(500).send(err);
    }

}
export const AddProjectSection = async (req: Request, res: Response) => {
    try {
        const projects = await Projects.findOne({ _id: req.params.id });
        if (!projects) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        const { projectSectionContent, projectImagealignment,projectSectionTitle,projectSectionSubTitle } = req.body;
        const newSection = new projectSection({
            projectSectionImage: req.file?.path,
            projectSectionContent: projectSectionContent,
            projectImagealignment: projectImagealignment,
            projectSectionTitle: projectSectionTitle,
            projectSectionSubTitle: projectSectionSubTitle
        });
        const savedProjectSection = await newSection.save();
        projects.ProjectSections.push(savedProjectSection._id);
        await projects.save();
        return res.status(200).json({
            success: true,
            message: 'Service section created successfully',
            data: savedProjectSection
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const ProjectList = async (req: Request, res: Response) => {
    try {
        const projects = await Projects.find().populate({
            path: 'ProjectSections',
            model: 'tbl-projectSection'
        });
        res.json({
            projects: projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const DeleteAllProjects = async (req: Request, res: Response) => {
    try {
        const projectsToDelete = await Projects.find().populate('ProjectSections');
        if (projectsToDelete.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No projects found',
            });
        }
        for (const project of projectsToDelete) {
            await projectSection.deleteMany({ _id: { $in: project.ProjectSections } });
        }
        await Projects.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'All projects and their sections have been deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting all projects and their sections',
        });
    }
};

export const FindOneProject = async (req: Request, res: Response) => {
    try {
        const project = await Projects.findOne({ _id: req.params.id }).populate({
            path: 'ProjectSections',
            model: 'tbl-projectSection'
        });
        return res.status(200).json({
            project
        });
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }
};
export const EditProject = async (req: Request, res: Response) => {
    let { projectTitle, description } = req.body;
    try {
        if (req.params.id) {
            await Projects.findByIdAndUpdate(req.params.id, {
                projectTitle: projectTitle,
                description: description,
                projectImage: req.file?.path
            }, (err, result) => {
                if (err)
                    res.send(err)
            })
            return res.status(200).json({
                success: true,
                message: 'SuccessFully Edit',
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Id is Null to Edit'
            });
        }
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Edit Failure'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: false,
            message: 'Fail to Edit'
        });
    }
};

export const DeleteProject = async (req: Request, res: Response) => {
    try {
        const serviceToDelete = await Projects.findOne({ _id: req.params.id });
        if (!serviceToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Cant Find'
            });
        }
        const del = await Projects.deleteOne({ _id: req.params.id });
        await projectSection.deleteMany({ _id: { $in: serviceToDelete.ProjectSections } });
        return res.status(200).json(del);
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }
};

export const EditProjectSection = async (req: Request, res: Response) => {
    const { sectionContent, imagealignment } = req.body;
    try {
        const { projectSectionContent, projectImagealignment } = req.body;
        if (req.params.id) {
            await projectSection.findByIdAndUpdate(req.params.id, {
                projectSectionImage: req.file?.path,
                projectSectionContent: projectSectionContent,
                projectImagealignment: projectImagealignment
            }, (err, result) => {
                if (err)
                    res.send(err)
            })

            return res.status(200).json({
                success: true,
                message: 'SuccessFully Edit',
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Id is Null to Edit'
            });
        }
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Edit Failure'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: false,
            message: 'Fail to Edit'
        });
    }
};

export const DeleteProjectSection = async (req: Request, res: Response) => {
    try {
        const sectionToDelete = await projectSection.findOne({ _id: req.params.id });
        if (!sectionToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Cant Find'
            });
        }
        // find the service that includes the deleted section ID
        const project = await Projects.findOne({ ProjectSections: { $in: [req.params.id] } });
        if (project) {
            // remove the deleted section ID from the service's sections array
            project.ProjectSections = project.ProjectSections.filter((_id) => _id.toString() !== req.params.id);
            await project.save();
        }
        const del = await projectSection.deleteOne({ _id: req.params.id });
        return res.status(200).json(del);
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }
};


