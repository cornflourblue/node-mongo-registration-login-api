import { Schema, Model, model, Mongoose } from 'mongoose';
import IPharmacy from '../interfaces/pharmacy.interface';

// Schema
const pharmacySchema = new Schema({
  cuit: {
    type: String,
    required: '{PATH} is required',
    unique: true
  },
  name: {
    type: String,
    required: '{PATH} is required'
  },
  city: {
    type: String,
    required: '{PATH} is required'
  },
  pharmacist:{
    type: Schema.Types.ObjectId,
    ref: 'Pharmacist',
    required: true
  },
  address: {
    type: String
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
const Pharmacy: Model<IPharmacy> = model<IPharmacy>('Pharmacy', pharmacySchema);


export default Pharmacy;