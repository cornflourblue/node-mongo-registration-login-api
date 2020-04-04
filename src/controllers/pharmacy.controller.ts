import { Request, Response } from 'express';
import Pharmacy from '../models/pharmacy.model';
import IPharmacy from '../interfaces/pharmacy.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';
import Pharmacist from '../models/patient.model';

class PharmacyController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const pharmacys: IPharmacy[] = await Pharmacy.find();
    return res.status(200).json({pharmacys});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { cuit, name, city, address, pharmacist, image } = req.body;
    const newPharmacy: IPharmacy = new Pharmacy({
      cuit,
      name,
      city,
      address,
      pharmacist,
      image
    });
    try{
      await newPharmacy.save();
      return res.status(200).json({ newPharmacy });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const pharmacy: IPharmacy | null = await Pharmacy.findOne({_id: id});
      return res.status(200).json(pharmacy);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const pharmacy: IPharmacy | null = await Pharmacy.findOne({_id: id});
      return res.status(200).json(pharmacy);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { cuit, name, city, address, image } = req.body;
      await Pharmacy.findByIdAndUpdate(id, {
        cuit,
        name,
        city,
        address,
        image
      });
      const pharmacy = await Pharmacy.findOne({_id: id});
      return res.status(200).json(pharmacy);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Pharmacy.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new PharmacyController();
