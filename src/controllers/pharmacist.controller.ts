import { Request, Response } from 'express';
import Pharmacist from '../models/pharmacist.model';
import IPharmacist from '../interfaces/pharmacist.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';

class PharmacistController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const pharmacists: IPharmacist[] = await Pharmacist.find();
    return res.status(200).json({pharmacists});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { enrollment, last_name, first_name, sex, image } = req.body;
    const newPharmacist: IPharmacist = new Pharmacist({
      enrollment,
      last_name,
      first_name, 
      sex,
      image
    });
    try{
      await newPharmacist.save();
      return res.status(200).json({ newPharmacist });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const pharmacist: IPharmacist | null = await Pharmacist.findOne({_id: id});
      return res.status(200).json(pharmacist);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByEnrollment = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const pharmacist: IPharmacist | null = await Pharmacist.findOne({_id: id});
      return res.status(200).json(pharmacist);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { enrollment, last_name, first_name, sex, image } = req.body;
      await Pharmacist.findByIdAndUpdate(id, {
        enrollment,
        last_name,
        first_name,
        sex,
        image
      });
      const pharmacist = await Pharmacist.findOne({_id: id});
      return res.status(200).json(pharmacist);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Pharmacist.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new PharmacistController();
