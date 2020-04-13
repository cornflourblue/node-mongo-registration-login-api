import { Request, Response } from 'express';
import Prescription from '../models/prescription.model';
import IPrescription from '../interfaces/prescription.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';
import ISupply  from '../interfaces/supply.interface';
import Supply from '../models/supply.model';
import IPatient from '../interfaces/patient.interface';
import Patient from '../models/patient.model';

class PrescriptionController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const prescriptions: IPrescription[] = await Prescription.find();
    return res.status(200).json({prescriptions});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { user_id, patient, date, supplies, professionalFullname, observation} = req.body;

    const myPatient: IPatient = await Patient.schema.methods.findOrCreate(patient);
    const newPrescription: IPrescription = new Prescription({
      user_id,
      patient: myPatient,
      date,
      professionalFullname,
      observation
    });
    try{
      const errors: any[] = [];
      await Promise.all( supplies.map( async (sup: any) => {
        const sp: ISupply | null = await Supply.findOne({ _id: sup.supply._id});

        if(sp){
          newPrescription.supplies.push({supply: sp, quantity: sup.quantity});
        }else{
          errors.push({supply: sup.supply, message: 'Este medicamento no fue encontrado, por favor seleccionar un medicamento válido.'});
        }
      }));
      if(errors.length){
        return res.status(422).json(errors);
      }

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
        .populate("supplies.supply", { name: 1, quantity: 1 })
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
      
      var start = new Date(req.params.date);
      start.setHours(0,0,0,0);
      var end = new Date(req.params.date);
      end.setHours(23,59,59,999);

      const prescription: IPrescription[] | null = await Prescription.find({
        "date": { "$gte": start, "$lt": end }, "patient" : patient
      }).populate("supplies.supply", { name: 1, quantity: 1 })
        .populate('patient');
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  // Dispense prescription if it hasn't already been
  public dispense = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { dispensedBy } = req.body;
      const status = 'Dispensada';
      const prescription = await Prescription.findOne({_id: id});
      if(prescription?.status === 'Dispensada'){
        console.log("Ya está dispensada!");
        return res.status(422).json('La receta ya había sido dispensada.')
      }else{
        await Prescription.findByIdAndUpdate(id, {
          status,
          dispensedBy
        });
        const prescription = await Prescription.findOne({_id: id});
        return res.status(200).json(prescription);
      }
    } catch(err){
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
