import { Document } from 'mongoose';

export default interface IProfessional extends Document {
  dni: string;
  enrollment: string;
  last_name: string;
  first_name: string;
  sex: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}