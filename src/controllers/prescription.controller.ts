import { Request, Response } from 'express';
import Prescription from '../models/prescription.model';
import IPrescription, { PrescriptionSupply } from '../interfaces/prescription.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';
import ISupply  from '../interfaces/supply.interface';
import Supply from '../models/supply.model';
import IPatient from '../interfaces/patient.interface';
import Patient from '../models/patient.model';
import User from '../models/user.model';
import IUser from '../interfaces/user.interface';
import moment = require('moment');

class PrescriptionController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const prescriptions: IPrescription[] = await Prescription.find();
    return res.status(200).json({prescriptions});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { professional, patient, date, supplies, observation, diagnostic} = req.body;
    const myPatient: IPatient = await Patient.schema.methods.findOrCreate(patient);
    const myProfessional: IUser | null = await User.findOne({ _id: professional});
    const newPrescription: IPrescription = new Prescription({
      patient: myPatient,
      professional: {
        userId: myProfessional?._id,
        businessName: myProfessional?.businessName,
        cuil: myProfessional?.cuil,
        enrollment: myProfessional?.enrollment,
      },
      date,
      observation,
      diagnostic,
    });
    try{
      const errors: any[] = [];
      let isValid: boolean = false;
      await Promise.all( supplies.map( async (sup: any) => {
        if(sup.supply !== null && sup.supply !== ''){
          const sp: ISupply | null = await Supply.findOne({ _id: sup.supply._id });
          if(sp){
            newPrescription.supplies.push({supply: sp, quantity: sup.quantity});
            isValid = true;
          }else{
            errors.push({supply: sup.supply, message: 'Este medicamento no fue encontrado, por favor seleccionar un medicamento válido.'});
          }
        }
      }));
      if(errors.length && !isValid){
        return res.status(422).json(errors);
      }

      await newPrescription.save();
      return res.status(200).json( newPrescription );
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

  public getPrescriptionsByDateOrPatientId = async (req: Request, res: Response): Promise<Response<IPrescription[]>> => {
    try{
      const filterPatient = req.params.patient_id;
      const filterDate: string | null = req.params.date;

      // define a default date for retrieve all the documents if the date its not provided
      const defaultStart = '1900-01-01';
      const defaultEnd = '3000-12-31';
      let startDate: Date = moment(defaultStart, 'YYYY-MM-DD').startOf('day').toDate();
      let endDate: Date = moment(defaultEnd, 'YYYY-MM-DD').endOf('day').toDate();

      if(typeof(filterDate) !== 'undefined'){
        startDate = moment(filterDate, 'YYYY-MM-DD').startOf('day').toDate();
        endDate = moment(filterDate, 'YYYY-MM-DD').endOf('day').toDate();
      }

      await this.updateStatuses('', filterPatient);

      const prescriptions: IPrescription[] | null = await Prescription.find({
        "patient.dni": filterPatient,
        "date": { "$gte": startDate, "$lt": endDate }
      }).sort({ field: 'desc', date: -1});

      return res.status(200).json(prescriptions);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByUserId = async (req: Request, res: Response): Promise<Response> => {
    try{
      const { userId } = req.params;
      await this.updateStatuses(userId, '');
      const prescriptions: IPrescription[] | null = await Prescription.find({ "professional.userId":  userId}).sort({ field: 'desc', date: -1});
      return res.status(200).json(prescriptions);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  // Dispense prescription if it hasn't already been

  public dispense = async (req: Request, res: Response) => {
    try{
      const {prescriptionId, userId } = req.params;

      const dispensedBy: IUser | null = await User.findOne({_id: userId});
      if(!dispensedBy) return res.status(4000).json("Farmacia no encontrada");

      const opts: any = {new: true};
      const prescription: IPrescription | null = await Prescription.findOneAndUpdate({_id: prescriptionId, status: 'Pendiente'}, {
        status: 'Dispensada',
        dispensedBy: {
          userId: dispensedBy?._id,
          businessName: dispensedBy?.businessName,
          cuil: dispensedBy?.cuil,
        },
        dispensedAt: new Date()
      }, opts);

      if(!prescription) return res.status(422).json('La receta ya había sido dispensada.');

      return res.status(200).json(prescription);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { date, supplies, observation, diagnostic} = req.body;

    try{

      const prescription: IPrescription | null = await Prescription.findOne({_id: id, status: "Pendiente"});
      if(!prescription) return res.status(400).json("No se encontró la prescripción, se encuentra dispensada o vencida");

      const errors: any[] = [];
      const suppliesLoaded: PrescriptionSupply[] = [];

      await Promise.all( supplies.map( async (sup: any) => {
        if(sup.supply !== null && sup.supply !== ''){
          const sp: ISupply | null = await Supply.findOne({ _id: sup.supply._id });
          if(sp){
            suppliesLoaded.push({supply: sp, quantity: sup.quantity});
          }else{
            errors.push({supply: sup.supply, message: 'Este medicamento no fue encontrado, por favor seleccionar un medicamento válido.'});
          }
        }
      }));

      if(errors.length){
        return res.status(422).json(errors);
      }

      if(!suppliesLoaded.length){
        return res.status(422).json({message: 'Debe seleccionar al menos 1 medicamento'});
      }

      const opts: any = { runValidators: true, new: true, context: 'query' };
      const updatedPrescription: IPrescription | null = await Prescription.findOneAndUpdate({_id: id}, {
        date,
        observation,
        diagnostic,
        supplies: suppliesLoaded
      }, opts);
      return res.status(200).json( updatedPrescription );
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{
      const { id } = req.params;
      const prescription = await Prescription.findOne({_id: id});
      if( prescription?.status === "Pendiente"){
        await Prescription.findByIdAndDelete(id);
        return res.status(200).json(prescription);
      }else{
        return res.status(422).json('La receta ya se ha dispensado y no puede ser eliminada.')
      }
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  private updateStatuses = async (professionalId: string = '', filterPatient: string = ''): Promise<void> => {
    let limitDate: Date = moment().subtract(30, 'day').startOf('day').toDate(); // expired control date
    // before search: update expired prescriptions, with status "Pendiente"
    await Prescription.updateMany({
      "status": "Pendiente",
      "date": { "$lt": limitDate },
      "$or": [{
        "professional.userId": (professionalId !== '' ? professionalId : null)
      },{
        "patient.dni": filterPatient
      }]
    }, {
      "status": "Vencida"
    });
  }
}

export default new PrescriptionController();
