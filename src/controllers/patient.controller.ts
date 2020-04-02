import { Request, Response } from 'express';
import Patient from '../models/patient.model';
import IPatient from '../interfaces/patient.interface';

class PatientController {

  public getPatients = async (req: Request, res: Response): Promise<Response> => {
    const patients: IPatient[] = await Patient.find();
    return res.status(200).json({patients});
  }

  public getPatientByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const patient: IPatient | null = await Patient.findOne({_id: id});
      return res.status(200).json(patient);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }

  }

  public createPatient = async (req: Request, res: Response): Promise<Response> => {
    const { dni, last_name, first_name, sex, image } = req.body;
    const newPatient: IPatient = new Patient({
      dni,
      last_name,
      first_name, 
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

  public updatePatient = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { dni, last_name, first_name, sex, image } = req.body;
      await Patient.findByIdAndUpdate(id, {
        dni,
        last_name,
        first_name,
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

  public deletePatient =  async (req: Request, res: Response): Promise<Response> => {
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
