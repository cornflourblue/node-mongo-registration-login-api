import { Document } from 'mongoose';
import ISupply from './supply.interface';

export default interface IPrescription extends Document {
  user_id: string;
  patientId: string;
  supplies: ISupply[];
  status: string;
  date: Date;
  professionalFullname: string;
  dispensedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}