import { Document } from 'mongoose';

export default interface IPharmacist extends Document {
  enrollment: string;
  last_name: string;
  first_name: string;
  sex: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}