import { Schema, Model, model } from 'mongoose';
import IPatient from '../patients/patient.interface';

// Schema
const patientSchema = new Schema({
  name: {
    type: String
  },
  barcode: {
    type: String
  },
  costPrice: {
    type: Number
  },
  salePrice: {
    type: Number
  },
  description: {
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
const Patient: Model<IPatient> = model<IPatient>('Patient', patientSchema);


export default Patient;