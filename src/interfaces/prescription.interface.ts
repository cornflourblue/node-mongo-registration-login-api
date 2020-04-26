import { Document } from 'mongoose';
import ISupply from './supply.interface';
import IPatient from './patient.interface';
import IUser from './user.interface';

export default interface IPrescription extends Document {
  user: IUser;
  patient: IPatient;
  supplies: [{
    supply: ISupply,
    quantity: number
  }];
  status: string;
  date: Date;
  professionalFullname: string;
  observation?: string;
  dispensedBy: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}