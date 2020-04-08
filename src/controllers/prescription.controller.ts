import { Request, Response } from 'express';
import Prescription from '../models/prescription.model';
import IPrescription from '../interfaces/prescription.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';
import ISupply  from '../interfaces/supply.interface';
import Supply from '../models/supply.model';
import IPatient from '../interfaces/patient.interface';

class PrescriptionController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const prescriptions: IPrescription[] = await Prescription.find();
    return res.status(200).json({prescriptions});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { user_id, patient, date, supplies, professionalFullname} = req.body;
    const newPrescription: IPrescription = new Prescription({
      user_id,
      patient,
      date,
      professionalFullname
    });
    try{
      await Promise.all( supplies.map( async (sup: any) => {
        const sp: ISupply | null = await Supply.findOne({ _id: sup.supply._id});
        if(sp){
          newPrescription.supplies.push(sp);
        }

      }));
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

  public getByPatientId = async (req: Request, res: Response): Promise<Response> => {
    try{
      const patient_id: IPatient =  <IPatient> {_id: req.params.patient_id};
      const prescription: IPrescription[] | null = await Prescription.find({patient: patient_id})
        .populate('supplies', 'name')
        .populate('patient');
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByPatientAndDate = async (req: Request, res: Response): Promise<Response> => {
    try{
      const patient: IPatient =  <IPatient> {_id: req.params.patientId};
      const date: Date = new Date(req.params.date);
      const prescription: IPrescription[] | null = await Prescription.find({
        "date": {
          "$gte": new Date(date),
        }},{"patient_id": patient._id}
      ).populate('supplies', 'name').populate('patient');
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { user_id, patient, date, supplies, status, professionalFullname, dispensedBy } = req.body;
      await Prescription.findByIdAndUpdate(id, {
        user_id,
        patient,
        date,
        supplies,
        status,
        professionalFullname,
        dispensedBy
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
