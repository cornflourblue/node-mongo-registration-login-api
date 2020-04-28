import { Document } from 'mongoose';
import ISupply from './supply.interface';
import IPatient from './patient.interface';
import IUser from './user.interface';

export default interface IPrescription extends Document {
  patient_embbeded: IPatient;
  professional: {
    userId: string,
    enrollment: string,
    cuil: string,
    businessName: string,
  };
  dispensedBy_embedded?: {
    userId: string,
    cuil: string,
    businessName: string,
  };
  dispensedAt: Date;
  supplies_embedded: Array<{supply: ISupply, quantity: number}>;
  status: string;
  date: Date;

  observation?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // production field (deprecated)
  dispensedBy: IUser;
  supplies: [{
    supply: ISupply,
    quantity: number
  }];
  user: IUser;
  patient: IPatient;
  professionalFullname: string;
}
