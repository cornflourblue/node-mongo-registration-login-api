import { Document } from 'mongoose';

export default interface IPatient extends Document {
  dni: string;
  lastName: string;
  firstName: string;
  sex: string;
  createdAt?: Date;
  updatedAt?: Date;
}