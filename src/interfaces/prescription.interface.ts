import { Document } from 'mongoose';
import ISupply from './supply.interface';
import IPatient from './patient.interface';

export default interface IPrescription extends Document {
  user_id: string;
  patient: IPatient;
  supplies: [{
    supply: ISupply,
    quantity: number
  }];
  status: string;
  date: Date;
  professionalFullname: string;
  observation?: string;
  dispensedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}