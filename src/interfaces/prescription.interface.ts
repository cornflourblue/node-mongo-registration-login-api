import { Document } from 'mongoose';
import ISupply from './supply.interface';
import IPatient from './patient.interface';

export interface PrescriptionSupply {
  supply: ISupply;
  quantity: number;
}

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
  supplies: PrescriptionSupply[];
  status: string;
  date: Date;

  diagnostic?: string;
  observation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
