import { Document } from 'mongoose';

export default interface IPatient extends Document {
  dni: string;
  last_name: string;
  first_name: string;
  sexo: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}