import { Document } from 'mongoose';
import ISupply from './supply.interface';

export default interface IPrescription extends Document {
  user_id: string;
  patient_id: string;
  supplies: ISupply[];
  status: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}