import { Request, Response, response } from 'express';
import logger from '../../logger';
import Services, { Iservices } from '../../models/services';
import Section, { ISection } from '../../models/section';

export const ServicesList =async (req: Request, res: Response) => {
    try {
      const services = await Services.find().populate({
        path: 'sections',
        model: 'tbl-section'
      });        
      res.json({
        services:services
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
export const AddServices = async (req: Request, res: Response) => {
  try{
    let { servicename, slug } = req.body;
    const createdservices = new Services({
      servicename: servicename,
      slug: slug,
    })
   createdservices.save((err, savedService) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(savedService);
      }
    })
  }catch(err){
    res.status(500).send(err);
  }

  }

export const DeleteAllServices = async (req: Request, res: Response) => {
    try {
      const servicesToDelete = await Services.find();
      if (servicesToDelete.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No services found',
        });
      }
      const serviceIds = servicesToDelete.map((service) => service._id);
      await Services.deleteMany({});
      await Section.deleteMany({ service: { $in: serviceIds } });
      return res.status(200).json({
        success: true,
        message: 'All services and their sections have been deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting all services and their sections',
      });
    }
  };
  

  
  export const FindOneService = async (req: Request, res: Response) => {
      try {
        const service = await Services.findOne({ _id: req.params.id }).populate({
          path: 'sections',
          model: 'tbl-section'
        });        
          return res.status(200).json({
              service
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
  
export const FindOneSection = async (req: Request, res: Response) => {
  try {
     
      const section = await Section.findOne({ _id: req.params.id });
      return res.status(200).json({
        section
      }
        
      );
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
export const Editservices = async (req: Request, res: Response) => {
    const { servicename, slug } = req.body;
    try {                                                                                           
        if (req.params.id) {
            await Services.findByIdAndUpdate(req.params.id, {  
              servicename:servicename, 
              slug: slug,
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
export const Editsection = async (req: Request, res: Response) => {
  const { sectionContent,sectionTitle,sectionSubTitle, imagealignment } = req.body;
  try {                           
                                                                    
      if (req.params.id) {
          await Section.findByIdAndUpdate(req.params.id, {  
            sectionImage: req.file?.path,
            sectionContent: sectionContent,
            imagealignment: imagealignment,
            sectionTitle: sectionTitle,
            sectionSubTitle: sectionSubTitle,
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
export const DeleteService = async (req: Request, res: Response) => {
    try {
        const serviceToDelete = await Services.findOne({ _id: req.params.id });
        if(!serviceToDelete){
            return res.status(404).json({
                success: false,
                message: 'Cant Find'
            });
        }
        const del = await Services.deleteOne({ _id: req.params.id });
        await Section.deleteMany({ _id: { $in: serviceToDelete.sections } });
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

export const DeleteSection = async (req: Request, res: Response) => {
    try {
        const sectionToDelete = await Section.findOne({ _id: req.params.id });
        if(!sectionToDelete){
            return res.status(404).json({
                success: false,
                message: 'Cant Find'
            });
        }
        // find the service that includes the deleted section ID
        const service = await Services.findOne({ sections: { $in: [req.params.id] } });
        if (service) {
            // remove the deleted section ID from the service's sections array
            service.sections = service.sections.filter((_id) => _id.toString() !== req.params.id);
            await service.save();
        }
        const del = await Section.deleteOne({ _id: req.params.id });
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

export const AddServiceSection = async (req: Request, res: Response) => {
    try {
      const service = await Services.findOne({ _id: req.params.id });
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
      const { sectionContent,sectionTitle,sectionSubTitle, imagealignment } = req.body;
      const newSection = new Section({
        sectionImage: req.file?.path,
        sectionContent: sectionContent,
        sectionTitle: sectionTitle,
        sectionSubTitle: sectionSubTitle,
        imagealignment: imagealignment
      });
      console.log(req.file?.path)
      const savedSection = await newSection.save();
      service.sections.push(savedSection._id);
      await service.save();
      return res.status(200).json({
        success: true,
        message: 'Service section created successfully',
        data: savedSection
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
  
  








    