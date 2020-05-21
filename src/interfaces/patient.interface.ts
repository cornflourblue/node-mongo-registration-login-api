import { Document } from 'mongoose';

export default interface IPatient extends Document {
  dni: string;
  lastName: string;
  firstName: string;
  sex: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  findOrCreate(patientParam: IPatient): Promise<IPatient>;
}
