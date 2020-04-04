import { Document } from 'mongoose';

export default interface IPharmacy extends Document {
  cuit: string;
  name: string;
  city: string;
  address: string;
  pharmacist: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}