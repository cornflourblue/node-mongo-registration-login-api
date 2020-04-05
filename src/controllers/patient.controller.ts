import { Request, Response } from 'express';
import Patient from '../models/patient.model';
import IPatient from '../interfaces/patient.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';

class PatientController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const patients: IPatient[] = await Patient.find();
    return res.status(200).json({patients});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { dni, lastName, firstName, sex, image } = req.body;
    const newPatient: IPatient = new Patient({
      dni,
      lastName,
      firstName,
      sex,
      image
    });
    try{
      await newPatient.save();
      return res.status(200).json({ newPatient });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const patient: IPatient | null = await Patient.findOne({_id: id});
      return res.status(200).json(patient);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const { dni } = req.params;
      const patient: IPatient | null = await Patient.findOne({dni: dni});

      console.log('GET PATIENT DNI ==========> ', patient);
      return res.status(200).json(patient);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { dni, lastName, firstName, sex, image } = req.body;
      await Patient.findByIdAndUpdate(id, {
        dni,
        lastName,
        firstName,
        sex,
        image
      });
      const patient = await Patient.findOne({_id: id});
      return res.status(200).json(patient);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Patient.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new PatientController();
