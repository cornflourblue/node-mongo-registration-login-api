import { Document } from 'mongoose';
import IPharmacist from './pharmacist.interface';

export default interface IPharmacy extends Document {
  pharmacist: IPharmacist;
  cuit: string;
  name: string;
  city: string;
  address: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}