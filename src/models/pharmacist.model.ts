import { Schema, Model, model } from 'mongoose';
import IPharmacist from '../interfaces/pharmacist.interface';

// Schema
const pharmacistSchema = new Schema({
  enrollment: {
    type: String
  },
  last_name: {
    type: String
  },
  first_name: {
    type: Number
  },
  sex: {
    type: Number
  },
  image: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: Date,
});

// Model
const Pharmacist: Model<IPharmacist> = model<IPharmacist>('Pharmacist', pharmacistSchema);


export default Pharmacist;