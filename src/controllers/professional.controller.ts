import { Request, Response } from 'express';
import Professional from '../models/professional.model';
import IProfessional from '../interfaces/professional.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';

class ProfessionalController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const professionals: IProfessional[] = await Professional.find();
    return res.status(200).json({professionals});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { dni, last_name, first_name, sex, image } = req.body;
    const newProfessional: IProfessional = new Professional({
      dni,
      last_name,
      first_name, 
      sex,
      image
    });
    try{
      await newProfessional.save();
      return res.status(200).json({ newProfessional });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const professional: IProfessional | null = await Professional.findOne({_id: id});
      return res.status(200).json(professional);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const dni: string = req.params.dni;
      const professional: IProfessional | null = await Professional.findOne({dni: dni});
      return res.status(200).json(professional);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByEnrollment = async (req: Request, res: Response): Promise<Response> => {
    try{
      const enrollment: string = req.params.enrollment;
      const professional: IProfessional | null = await Professional.findOne({enrollment: enrollment});
      return res.status(200).json(professional);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { dni, last_name, first_name, sex, image } = req.body;
      await Professional.findByIdAndUpdate(id, {
        dni,
        last_name,
        first_name,
        sex,
        image
      });
      const professional = await Professional.findOne({_id: id});
      return res.status(200).json(professional);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Professional.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new ProfessionalController();
