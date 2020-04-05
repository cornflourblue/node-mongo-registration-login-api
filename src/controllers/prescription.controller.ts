import { Request, Response } from 'express';
import Prescription from '../models/prescription.model';
import IPrescription from '../interfaces/prescription.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';

class PrescriptionController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const prescriptions: IPrescription[] = await Prescription.find();
    return res.status(200).json({prescriptions});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { user, patient, date, supplies} = req.body;
    const newPrescription: IPrescription = new Prescription({
      user,
      patient,
      date,
      supplies
    });
    try{
      await newPrescription.save();
      return res.status(200).json({ newPrescription });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const prescription: IPrescription | null = await Prescription.findOne({_id: id});
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const { dni } = req.params;
      const prescription: IPrescription | null = await Prescription.findOne({dni: dni});
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { user, patient, date, supplies, status } = req.body;
      await Prescription.findByIdAndUpdate(id, {
        user,
        patient,
        date,
        supplies,
        status
      });
      const prescription = await Prescription.findOne({_id: id});
      return res.status(200).json(prescription);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Prescription.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new PrescriptionController();
