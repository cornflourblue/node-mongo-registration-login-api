import { Document } from 'mongoose';

export default interface ISupply extends Document {
  id: string;
  name: string;
  description: string;
  observation: string;
  unity: string;
  supply_area: string;
  createdAt?: Date;
  updatedAt?: Date;
}