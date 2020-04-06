import { Request, Response } from 'express';
import Prescription from '../models/prescription.model';
import IPrescription from '../interfaces/prescription.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';
import ISupply  from '../interfaces/supply.interface';
import Supply from '../models/supply.model';

class PrescriptionController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const prescriptions: IPrescription[] = await Prescription.find();
    return res.status(200).json({prescriptions});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { user_id, patientId, date, supplies, professionalFullname} = req.body;
    const newPrescription: IPrescription = new Prescription({
      user_id,
      patientId,
      date,
      professionalFullname
    });
    try{
      await newPrescription.save();
      let supply: ISupply | null;
      supplies.forEach( async (sup: any) => {
        supply = await Supply.findOne({ _id: sup.supply._id});
        if(supply){
          newPrescription.supplies.push(supply);
          await newPrescription.save();
        }
      });

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
      const { patientId } =  req.params;
      const prescription: IPrescription[] | null = await Prescription.find({patientId: patientId});
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByPatientAndDate = async (req: Request, res: Response): Promise<Response> => {
    try{
      const { patientId, date } =  req.params;
      const prescription: IPrescription[] | null = await Prescription.find( //query today up to tonight
        {"created_on": {"$gte": date, "$lt": date}}, {patientId: patientId}
      )
      return res.status(200).json(prescription);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { user_id, patientId, date, supplies, status, professionalFullname, dispensedBy } = req.body;
      await Prescription.findByIdAndUpdate(id, {
        user_id,
        patientId,
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
