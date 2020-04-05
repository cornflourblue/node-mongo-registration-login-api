import { Document } from 'mongoose';
import IUser from './user.interface';
import IPatient from './patient.interface';
import ISupply from './supply.interface';

export default interface IPrescription extends Document {
  user: IUser;
  patient: IPatient;
  supplies: ISupply[];
  status: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}