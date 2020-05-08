import { Document } from 'mongoose';
import ISupply from './supply.interface';
import IPatient from './patient.interface';
import IUser from './user.interface';

export default interface IPrescription extends Document {
  patient: IPatient;
  professional: {
    userId: string,
    enrollment: string,
    cuil: string,
    businessName: string,
  };
  dispensedBy?: {
    userId: string,
    cuil: string,
    businessName: string,
  };
  dispensedAt: Date;
  supplies: Array<{supply: ISupply, quantity: number}>;
  status: string;
  date: Date;

  observation?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // production field (deprecated)
  dispensedBy_deprecated: IUser;
  supplies_deprecated: [{
    supply: ISupply,
    quantity: number
  }];
  user_deprecated: IUser;
  patient_deprecated: IPatient;
  professionalFullname_deprecated: string;
}
