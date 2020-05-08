import { Document } from 'mongoose';
import ISupply from '../../interfaces/supply.interface';
import IPatient from '../../interfaces/patient.interface';
import IUser from '../../interfaces/user.interface';

export default interface IPrescriptionOld extends Document {
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
